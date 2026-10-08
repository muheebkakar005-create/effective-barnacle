import { Router, Request, Response } from 'express';
import { readDb, writeDb, Order, OrderItem } from '../data/db.ts';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// Create new order (Public or Authenticated)
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      items,
      couponCode,
      paymentMethod,
      userId
    } = req.body;

    if (!customerInfo || !customerInfo.email || !customerInfo.firstName || !customerInfo.phone) {
      res.status(400).json({ success: false, message: 'Customer information (name, email, phone) is required.' });
      return;
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.country) {
      res.status(400).json({ success: false, message: 'Valid shipping address is required.' });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Your cart is empty. Add products before checkout.' });
      return;
    }

    const db = readDb();

    // Validate items, prices, and stock against database
    let subtotal = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId || p.slug === item.productSlug);
      if (!product) {
        res.status(400).json({ success: false, message: `Product "${item.name || 'Unknown'}" not found in catalog.` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} left in stock.`
        });
        return;
      }

      // Check specific variation stock if specified
      if (item.color || item.size) {
        const variation = product.variations.find(v =>
          (!item.color || v.color.toLowerCase() === item.color.toLowerCase()) &&
          (!item.size || v.size.toUpperCase() === item.size.toUpperCase())
        );
        if (variation && variation.stock < item.quantity) {
          res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.name} (${item.color || ''} - ${item.size || ''})". Available: ${variation.stock}.`
          });
          return;
        }
      }

      // Real price from product (salePrice if available, otherwise regular price)
      const unitPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
      subtotal += unitPrice * item.quantity;

      validatedItems.push({
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        color: item.color,
        size: item.size,
        price: unitPrice,
        quantity: item.quantity,
        image: item.image || product.images[0],
        sku: item.sku || product.sku
      });
    }

    // Coupon discount calculation
    let discount = 0;
    let appliedCoupon: { code: string; amount: number } | undefined;

    if (couponCode) {
      const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
      if (coupon) {
        const now = new Date();
        const validDate = (!coupon.startDate || new Date(coupon.startDate) <= now) &&
                          (!coupon.expiryDate || new Date(coupon.expiryDate) >= now);
        const validUsage = coupon.usedCount < coupon.usageLimit;
        const validMinOrder = subtotal >= coupon.minOrder;

        if (validDate && validUsage && validMinOrder) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.amount) / 100);
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = Math.min(coupon.amount, subtotal);
          }
          appliedCoupon = {
            code: coupon.code,
            amount: discount
          };
          coupon.usedCount += 1;
        }
      }
    }

    // Shipping calculation based on country and store settings
    const settings = db.settings;
    const isPakistan = shippingAddress.country.toLowerCase().includes('pakistan') || shippingAddress.country.toLowerCase() === 'pk';
    let shipping = 0;

    if (subtotal >= settings.freeShippingThreshold) {
      shipping = 0;
    } else {
      shipping = isPakistan ? settings.standardShippingFee : settings.internationalShippingFee;
    }

    const total = Math.max(0, subtotal - discount + shipping);

    // Generate Order Number: SK-2026-000XXX
    const orderCount = db.orders.length + 1;
    const paddedNum = String(orderCount).padStart(6, '0');
    const orderNumber = `SK-2026-${paddedNum}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: userId || undefined,
      customerInfo: {
        firstName: customerInfo.firstName.trim(),
        lastName: (customerInfo.lastName || '').trim(),
        email: customerInfo.email.trim().toLowerCase(),
        phone: customerInfo.phone.trim()
      },
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        country: shippingAddress.country.trim(),
        postalCode: (shippingAddress.postalCode || '').trim()
      },
      items: validatedItems,
      subtotal,
      discount,
      shipping,
      total,
      coupon: appliedCoupon,
      paymentMethod: paymentMethod || 'Manual Payment (WhatsApp Invoice / Bank Transfer)',
      paymentStatus: 'Pending',
      orderStatus: 'Pending Payment',
      notes: [
        {
          id: `note-${Date.now()}`,
          text: `Order placed online. Payment status pending verification. Method: ${paymentMethod || 'Manual Payment'}`,
          date: new Date().toISOString(),
          author: 'System'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Decrement inventory
    for (const item of validatedItems) {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (item.color || item.size) {
          const v = prod.variations.find(varItem =>
            (!item.color || varItem.color.toLowerCase() === item.color?.toLowerCase()) &&
            (!item.size || varItem.size.toUpperCase() === item.size?.toUpperCase())
          );
          if (v) {
            v.stock = Math.max(0, v.stock - item.quantity);
          }
        }
      }
    }

    db.orders.unshift(newOrder);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Order created successfully. Our concierge will verify your payment and provide updates.',
      order: newOrder
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error processing order.' });
  }
});

// GET customer orders
router.get('/my-orders', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const orders = db.orders.filter(o => o.userId === user.id || o.customerInfo.email.toLowerCase() === user.email.toLowerCase());
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer orders.' });
  }
});

// GET single order by ID or orderNumber
router.get('/:id', (req: Request, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const order = db.orders.find(o => o.id === id || o.orderNumber.toUpperCase() === id.toUpperCase());

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving order.' });
  }
});

// POST /api/orders/track - Lookup order by order number and email or phone
router.post('/track', (req: Request, res: Response) => {
  try {
    const { orderNumber, identifier } = req.body;
    if (!orderNumber || !identifier) {
      res.status(400).json({ success: false, message: 'Order number and Email or Phone number are required.' });
      return;
    }

    const cleanOrderNum = orderNumber.trim().toUpperCase();
    const cleanId = identifier.trim().toLowerCase();

    const db = readDb();
    const order = db.orders.find(o => {
      const matchNum = o.orderNumber.toUpperCase() === cleanOrderNum;
      const matchEmail = o.customerInfo.email.toLowerCase() === cleanId;
      const matchPhone = o.customerInfo.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '');
      return matchNum && (matchEmail || matchPhone);
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'No matching order found. Please check your Order Number and Email/Phone.'
      });
      return;
    }

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error tracking order.' });
  }
});

export default router;

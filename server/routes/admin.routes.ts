import { Router, Response } from 'express';
import { readDb, writeDb } from '../data/db.ts';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// Apply requireAdmin to all admin subroutes
router.use(requireAdmin);

// Dashboard stats & charts data
router.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const orders = db.orders;
    const products = db.products;
    const users = db.users.filter(u => u.role === 'customer');

    // Total sales
    const completedOrPaidOrders = orders.filter(o => o.paymentStatus === 'Paid' || o.orderStatus === 'Completed' || o.orderStatus === 'Shipped');
    const totalSales = completedOrPaidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending Payment').length;
    const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

    // Sales over time (last 7 days / recent buckets)
    const salesByDate: { [date: string]: number } = {};
    orders.forEach(o => {
      const dateKey = o.createdAt.slice(0, 10);
      salesByDate[dateKey] = (salesByDate[dateKey] || 0) + o.total;
    });

    const recentTrend = Object.keys(salesByDate)
      .sort()
      .slice(-7)
      .map(date => ({ date, amount: salesByDate[date] }));

    // Top products calculated from orders
    const productSalesMap: { [prodId: string]: { name: string; quantity: number; revenue: number; image: string } } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            image: item.image
          };
        }
        productSalesMap[item.productId].quantity += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        pendingOrders,
        totalCustomers: users.length,
        totalProducts: products.length,
        lowStockCount: lowStockProducts.length
      },
      salesTrend: recentTrend,
      topProducts,
      recentOrders: orders.slice(0, 6)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to generate dashboard statistics.' });
  }
});

// GET /api/admin/orders - with search and filters
router.get('/orders', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    let orders = [...db.orders];

    const { status, paymentStatus, search } = req.query;

    if (status && status !== 'all') {
      orders = orders.filter(o => o.orderStatus.toLowerCase() === (status as string).toLowerCase());
    }

    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter(o => o.paymentStatus.toLowerCase() === (paymentStatus as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase().trim();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerInfo.firstName.toLowerCase().includes(q) ||
        o.customerInfo.lastName.toLowerCase().includes(q) ||
        o.customerInfo.email.toLowerCase().includes(q) ||
        o.customerInfo.phone.includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving orders.' });
  }
});

// PATCH /api/admin/orders/:id/status - Update order & payment status
router.patch('/orders/:id/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const { orderStatus, paymentStatus, trackingNumber, shippingCarrier, note } = req.body;

    const orderIndex = db.orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const order = db.orders[orderIndex];

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }
    if (shippingCarrier !== undefined) {
      order.shippingCarrier = shippingCarrier;
    }

    if (note) {
      order.notes.push({
        id: `note-${Date.now()}`,
        text: note,
        date: new Date().toISOString(),
        author: req.user?.name || 'Admin'
      });
    }

    order.updatedAt = new Date().toISOString();
    writeDb(db);

    res.json({
      success: true,
      message: `Order #${order.orderNumber} updated.`,
      order
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

// POST /api/admin/orders/:id/notes - Add note to order
router.post('/orders/:id/notes', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
      return;
    }

    const orderIndex = db.orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const newNote = {
      id: `note-${Date.now()}`,
      text: text.trim(),
      date: new Date().toISOString(),
      author: req.user?.name || 'Admin'
    };

    db.orders[orderIndex].notes.push(newNote);
    db.orders[orderIndex].updatedAt = new Date().toISOString();
    writeDb(db);

    res.json({ success: true, message: 'Note added successfully.', note: newNote });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to add note.' });
  }
});

// GET /api/admin/customers
router.get('/customers', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const customers = db.users
      .filter(u => u.role === 'customer')
      .map(customer => {
        const userOrders = db.orders.filter(
          o => o.userId === customer.id || o.customerInfo.email.toLowerCase() === customer.email.toLowerCase()
        );
        const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          addresses: customer.addresses || [],
          orderCount: userOrders.length,
          totalSpent,
          recentOrders: userOrders.slice(0, 3),
          createdAt: customer.createdAt
        };
      });

    res.json({ success: true, customers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve customers.' });
  }
});

// GET /api/admin/inventory
router.get('/inventory', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const items = db.products.map(p => {
      let statusText: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
      if (p.stock <= 0) {
        statusText = 'Out of Stock';
      } else if (p.stock <= p.lowStockThreshold) {
        statusText = 'Low Stock';
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: p.category,
        fabric: p.fabric,
        price: p.price,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        stockStatus: statusText,
        variations: p.variations
      };
    });

    res.json({ success: true, inventory: items });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve inventory.' });
  }
});

// PATCH /api/admin/inventory/:id - Fast update stock
router.patch('/inventory/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const { stock, lowStockThreshold } = req.body;

    const prodIndex = db.products.findIndex(p => p.id === id);
    if (prodIndex === -1) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    if (stock !== undefined) {
      db.products[prodIndex].stock = Number(stock);
    }
    if (lowStockThreshold !== undefined) {
      db.products[prodIndex].lowStockThreshold = Number(lowStockThreshold);
    }
    db.products[prodIndex].updatedAt = new Date().toISOString();

    writeDb(db);
    res.json({ success: true, message: 'Stock updated.', product: db.products[prodIndex] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update stock.' });
  }
});

// GET /api/admin/settings
router.get('/settings', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    res.json({ success: true, settings: db.settings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve settings.' });
  }
});

// PUT /api/admin/settings
router.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    db.settings = {
      ...db.settings,
      ...req.body
    };
    writeDb(db);
    res.json({ success: true, message: 'Store settings saved successfully.', settings: db.settings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update store settings.' });
  }
});

// GET /api/admin/inquiries
router.get('/inquiries', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    res.json({ success: true, inquiries: db.contactMessages });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer inquiries.' });
  }
});

// PATCH /api/admin/inquiries/:id
router.patch('/inquiries/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const { status } = req.body;

    const msg = db.contactMessages.find(m => m.id === id);
    if (!msg) {
      res.status(404).json({ success: false, message: 'Inquiry not found.' });
      return;
    }

    if (status) {
      msg.status = status;
    }
    writeDb(db);

    res.json({ success: true, message: 'Inquiry status updated.', inquiry: msg });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry.' });
  }
});

export default router;

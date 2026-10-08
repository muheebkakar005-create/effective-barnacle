import { Router, Request, Response } from 'express';
import { readDb, writeDb, Coupon } from '../data/db.ts';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// Validate coupon for checkout (Public)
router.post('/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
      return;
    }

    const orderSubtotal = Number(subtotal) || 0;
    const db = readDb();
    const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!coupon) {
      res.status(404).json({ success: false, message: 'Invalid coupon code.' });
      return;
    }

    if (!coupon.active) {
      res.status(400).json({ success: false, message: 'This coupon is no longer active.' });
      return;
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      res.status(400).json({ success: false, message: 'This coupon has not started yet.' });
      return;
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) {
      res.status(400).json({ success: false, message: 'This coupon has expired.' });
      return;
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: 'Coupon usage limit has been reached.' });
      return;
    }

    if (coupon.minOrder && orderSubtotal < coupon.minOrder) {
      res.status(400).json({
        success: false,
        message: `Minimum order amount of Rs. ${coupon.minOrder.toLocaleString()} required to use this coupon.`
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((orderSubtotal * coupon.amount) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.amount, orderSubtotal);
    }

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied successfully! You save Rs. ${discount.toLocaleString()}`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        amount: coupon.amount,
        calculatedDiscount: discount
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error validating coupon.' });
  }
});

// Admin: Get all coupons
router.get('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    res.json({ success: true, coupons: db.coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve coupons.' });
  }
});

// Admin: Create coupon
router.post('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, discountType, amount, minOrder, maxDiscount, startDate, expiryDate, usageLimit, active } = req.body;
    if (!code || !amount) {
      res.status(400).json({ success: false, message: 'Coupon code and discount amount are required.' });
      return;
    }

    const db = readDb();
    if (db.coupons.some(c => c.code.toUpperCase() === code.trim().toUpperCase())) {
      res.status(400).json({ success: false, message: 'A coupon with this code already exists.' });
      return;
    }

    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType: discountType || 'percentage',
      amount: Number(amount),
      minOrder: Number(minOrder || 0),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      startDate: startDate || new Date().toISOString(),
      expiryDate: expiryDate || '2026-12-31T23:59:59.000Z',
      usageLimit: Number(usageLimit || 1000),
      usedCount: 0,
      active: active !== undefined ? Boolean(active) : true
    };

    db.coupons.push(newCoupon);
    writeDb(db);

    res.status(201).json({ success: true, message: 'Coupon created successfully.', coupon: newCoupon });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error creating coupon.' });
  }
});

// Admin: Update coupon
router.put('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const index = db.coupons.findIndex(c => c.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Coupon not found.' });
      return;
    }

    const current = db.coupons[index];
    const data = req.body;

    db.coupons[index] = {
      ...current,
      code: data.code ? data.code.trim().toUpperCase() : current.code,
      discountType: data.discountType || current.discountType,
      amount: data.amount !== undefined ? Number(data.amount) : current.amount,
      minOrder: data.minOrder !== undefined ? Number(data.minOrder) : current.minOrder,
      maxDiscount: data.maxDiscount !== undefined ? (data.maxDiscount ? Number(data.maxDiscount) : undefined) : current.maxDiscount,
      startDate: data.startDate || current.startDate,
      expiryDate: data.expiryDate || current.expiryDate,
      usageLimit: data.usageLimit !== undefined ? Number(data.usageLimit) : current.usageLimit,
      active: data.active !== undefined ? Boolean(data.active) : current.active
    };

    writeDb(db);
    res.json({ success: true, message: 'Coupon updated.', coupon: db.coupons[index] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error updating coupon.' });
  }
});

// Admin: Delete coupon
router.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const index = db.coupons.findIndex(c => c.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Coupon not found.' });
      return;
    }

    db.coupons.splice(index, 1);
    writeDb(db);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error deleting coupon.' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { readDb, writeDb, ContactMessage } from '../data/db.ts';

const router = Router();

// POST /api/contact - Customer contact message
router.post('/contact', (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
      return;
    }

    const db = readDb();
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      message: message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    db.contactMessages.unshift(newMsg);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to SK Brands! Our styling concierge will contact you shortly.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// GET /api/settings - Public store settings
router.get('/settings', (req: Request, res: Response) => {
  try {
    const db = readDb();
    const s = db.settings;
    res.json({
      success: true,
      settings: {
        brandName: s.brandName,
        tagline: s.tagline,
        phone: s.phone,
        whatsappNumber: s.whatsappNumber,
        email: s.email,
        address: s.address,
        currency: s.currency,
        currencySymbol: s.currencySymbol,
        freeShippingThreshold: s.freeShippingThreshold,
        standardShippingFee: s.standardShippingFee,
        internationalShippingFee: s.internationalShippingFee,
        announcementText: s.announcementText,
        socialLinks: s.socialLinks,
        bankDetails: s.bankDetails,
        seoDefaults: s.seoDefaults
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load store settings.' });
  }
});

export default router;

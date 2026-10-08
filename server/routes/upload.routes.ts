import { Router, Response } from 'express';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.ts';
import { imageStorage } from '../services/imageStorage.ts';

const router = Router();

// Upload image (base64 payload or curated gallery preset)
router.post('/', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { image, fileName } = req.body;
    if (!image) {
      res.status(400).json({ success: false, message: 'Image data is required.' });
      return;
    }

    const url = await imageStorage.uploadImage(image, fileName);
    res.json({
      success: true,
      url,
      message: 'Image uploaded successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Image upload failed.' });
  }
});

// Curated stock fashion gallery for instant one-click image selection in Admin
router.get('/presets', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const presets = [
    { title: 'Chiffon Maroon Festive', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop' },
    { title: 'Royal Green Silk Ensemble', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop' },
    { title: 'Golden Organza Evening', url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=900&auto=format&fit=crop' },
    { title: 'Pastel Mint Lawn Pret', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop' },
    { title: 'Ivory Handcrafted Silk', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop' },
    { title: 'Regal Rose Gold Bridal', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop' },
    { title: 'Velvet Midnight Black', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop' },
    { title: 'Crimson Embroidered Pishwas', url: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=900&auto=format&fit=crop' }
  ];
  res.json({ success: true, presets });
});

export default router;

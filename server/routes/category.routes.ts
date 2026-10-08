import { Router, Request, Response } from 'express';
import { readDb, writeDb, Category } from '../data/db.ts';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET all categories
router.get('/', (req: Request, res: Response) => {
  try {
    const db = readDb();
    const categoriesWithCount = db.categories.map(cat => {
      const count = db.products.filter(p => p.category === cat.slug && p.status === 'active').length;
      return {
        ...cat,
        productCount: count
      };
    });
    res.json({ success: true, categories: categoriesWithCount });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

// POST new category (Admin)
router.post('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, image, status } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required.' });
      return;
    }

    const db = readDb();
    const slug = slugify(name);

    if (db.categories.some(c => c.slug === slug)) {
      res.status(400).json({ success: false, message: 'Category with this name already exists.' });
      return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
      status: status || 'active',
      createdAt: new Date().toISOString()
    };

    db.categories.push(newCategory);
    writeDb(db);

    res.status(201).json({ success: true, message: 'Category created.', category: newCategory });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
});

// PUT update category (Admin)
router.put('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const catIndex = db.categories.findIndex(c => c.id === id || c.slug === id);

    if (catIndex === -1) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    const { name, description, image, status } = req.body;
    const current = db.categories[catIndex];

    db.categories[catIndex] = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      description: description !== undefined ? description : current.description,
      image: image !== undefined ? image : current.image,
      status: status !== undefined ? status : current.status
    };

    writeDb(db);
    res.json({ success: true, message: 'Category updated.', category: db.categories[catIndex] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
});

// DELETE category (Admin)
router.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const catIndex = db.categories.findIndex(c => c.id === id || c.slug === id);

    if (catIndex === -1) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    const removed = db.categories.splice(catIndex, 1)[0];
    writeDb(db);
    res.json({ success: true, message: `Category "${removed.name}" deleted.` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
});

export default router;

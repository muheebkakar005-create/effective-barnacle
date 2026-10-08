import { Router, Request, Response } from 'express';
import { readDb, writeDb, Product } from '../data/db.ts';
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

// GET /api/products with advanced filters & server-side pagination & sorting
router.get('/', (req: Request, res: Response) => {
  try {
    const db = readDb();
    let products = [...db.products];

    // Filter active products unless requested by admin
    const status = req.query.status as string;
    if (status) {
      products = products.filter(p => p.status === status);
    } else {
      // By default show active
      products = products.filter(p => p.status === 'active');
    }

    // Search query (name, description, fabric, category, sku)
    const search = (req.query.search as string || req.query.q as string || '').toLowerCase().trim();
    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.fabric.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.colors.some(c => c.toLowerCase().includes(search))
      );
    }

    // Category filter
    const category = req.query.category as string;
    if (category && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Fabric filter (Cotton, Lawn, Chiffon, Organza, Silk, Velvet, Net)
    const fabric = req.query.fabric as string;
    if (fabric && fabric !== 'all') {
      const fabrics = fabric.split(',').map(f => f.trim().toLowerCase());
      products = products.filter(p => fabrics.includes(p.fabric.toLowerCase()));
    }

    // Color filter
    const color = req.query.color as string;
    if (color && color !== 'all') {
      const colors = color.split(',').map(c => c.trim().toLowerCase());
      products = products.filter(p => p.colors.some(c => colors.includes(c.toLowerCase())));
    }

    // Size filter (XS, S, M, L, XL, XXL)
    const size = req.query.size as string;
    if (size && size !== 'all') {
      const sizes = size.split(',').map(s => s.trim().toUpperCase());
      products = products.filter(p => p.sizes.some(s => sizes.includes(s.toUpperCase())));
    }

    // Availability filter
    const inStock = req.query.inStock as string;
    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    } else if (inStock === 'false') {
      products = products.filter(p => p.stock <= 0);
    }

    // Price range filter
    const minPrice = parseFloat(req.query.minPrice as string);
    if (!isNaN(minPrice)) {
      products = products.filter(p => (p.salePrice || p.price) >= minPrice);
    }
    const maxPrice = parseFloat(req.query.maxPrice as string);
    if (!isNaN(maxPrice)) {
      products = products.filter(p => (p.salePrice || p.price) <= maxPrice);
    }

    // Featured only
    const featured = req.query.featured as string;
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    // Extract facets from the full catalog for filter sidebars
    const allFabrics = Array.from(new Set(db.products.map(p => p.fabric))).sort();
    const allColors = Array.from(new Set(db.products.flatMap(p => p.colors))).sort();
    const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unstitched'];
    const minCatalogPrice = Math.min(...db.products.map(p => p.salePrice || p.price), 0);
    const maxCatalogPrice = Math.max(...db.products.map(p => p.price), 20000);

    // Sorting
    const sort = (req.query.sort as string || 'featured').toLowerCase();
    switch (sort) {
      case 'price-low':
      case 'price-asc':
        products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
      case 'price-desc':
        products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'a-z':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        products.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'best-selling':
        // Sort featured first, then stock descending
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.price - a.price);
        break;
      case 'featured':
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit as string || '24', 10));
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    res.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      facets: {
        fabrics: allFabrics,
        colors: allColors,
        sizes: allSizes,
        minPrice: minCatalogPrice,
        maxPrice: maxCatalogPrice
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching products.' });
  }
});

// GET /api/products/:slug - Product details with related products
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const db = readDb();
    const { slug } = req.params;
    const product = db.products.find(p => p.slug === slug || p.id === slug);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Find related products in same category or fabric, excluding this product
    const related = db.products
      .filter(p => p.id !== product.id && p.status === 'active' && (p.category === product.category || p.fabric === product.fabric))
      .slice(0, 4);

    res.json({
      success: true,
      product,
      related
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching product details.' });
  }
});

// POST /api/products - Create product (Admin)
router.post('/', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const data = req.body;

    if (!data.name || !data.price || !data.sku) {
      res.status(400).json({ success: false, message: 'Product name, price, and SKU are required.' });
      return;
    }

    let slug = slugify(data.name);
    // ensure unique slug
    let counter = 1;
    while (db.products.some(p => p.slug === slug)) {
      slug = `${slugify(data.name)}-${counter++}`;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: data.name.trim(),
      slug,
      shortDescription: data.shortDescription || '',
      description: data.description || '',
      category: data.category || 'new-arrivals',
      fabric: data.fabric || 'Cotton',
      sku: data.sku.trim().toUpperCase(),
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      costPrice: data.costPrice ? Number(data.costPrice) : undefined,
      images: Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop'],
      colors: Array.isArray(data.colors) && data.colors.length > 0 ? data.colors : ['Classic'],
      sizes: Array.isArray(data.sizes) && data.sizes.length > 0 ? data.sizes : ['S', 'M', 'L'],
      variations: Array.isArray(data.variations) ? data.variations : [],
      stock: Number(data.stock || 0),
      lowStockThreshold: Number(data.lowStockThreshold || 5),
      status: data.status || 'active',
      featured: Boolean(data.featured),
      seo: {
        metaTitle: data.seo?.metaTitle || `${data.name} | SK Brands`,
        metaDescription: data.seo?.metaDescription || data.shortDescription || data.description?.slice(0, 160) || ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating product.' });
  }
});

// PUT /api/products/:id - Update product (Admin)
router.put('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id || p.slug === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const current = db.products[index];
    const data = req.body;

    const updatedProduct: Product = {
      ...current,
      name: data.name !== undefined ? data.name.trim() : current.name,
      slug: data.slug !== undefined && data.slug.trim() ? slugify(data.slug) : current.slug,
      shortDescription: data.shortDescription !== undefined ? data.shortDescription : current.shortDescription,
      description: data.description !== undefined ? data.description : current.description,
      category: data.category !== undefined ? data.category : current.category,
      fabric: data.fabric !== undefined ? data.fabric : current.fabric,
      sku: data.sku !== undefined ? data.sku.trim().toUpperCase() : current.sku,
      price: data.price !== undefined ? Number(data.price) : current.price,
      salePrice: data.salePrice !== undefined ? (data.salePrice ? Number(data.salePrice) : undefined) : current.salePrice,
      costPrice: data.costPrice !== undefined ? (data.costPrice ? Number(data.costPrice) : undefined) : current.costPrice,
      images: Array.isArray(data.images) ? data.images : current.images,
      colors: Array.isArray(data.colors) ? data.colors : current.colors,
      sizes: Array.isArray(data.sizes) ? data.sizes : current.sizes,
      variations: Array.isArray(data.variations) ? data.variations : current.variations,
      stock: data.stock !== undefined ? Number(data.stock) : current.stock,
      lowStockThreshold: data.lowStockThreshold !== undefined ? Number(data.lowStockThreshold) : current.lowStockThreshold,
      status: data.status !== undefined ? data.status : current.status,
      featured: data.featured !== undefined ? Boolean(data.featured) : current.featured,
      seo: {
        metaTitle: data.seo?.metaTitle || current.seo?.metaTitle,
        metaDescription: data.seo?.metaDescription || current.seo?.metaDescription
      },
      updatedAt: new Date().toISOString()
    };

    db.products[index] = updatedProduct;
    writeDb(db);

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating product.' });
  }
});

// DELETE /api/products/:id - Delete product (Admin)
router.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = readDb();
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id || p.slug === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const deleted = db.products.splice(index, 1)[0];
    writeDb(db);

    res.json({
      success: true,
      message: `Product "${deleted.name}" deleted successfully.`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting product.' });
  }
});

export default router;

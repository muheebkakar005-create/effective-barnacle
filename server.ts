import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './server/routes/auth.routes.ts';
import productRoutes from './server/routes/product.routes.ts';
import categoryRoutes from './server/routes/category.routes.ts';
import orderRoutes from './server/routes/order.routes.ts';
import couponRoutes from './server/routes/coupon.routes.ts';
import adminRoutes from './server/routes/admin.routes.ts';
import contactRoutes from './server/routes/contact.routes.ts';
import uploadRoutes from './server/routes/upload.routes.ts';
import { readDb } from './server/data/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, 'public', 'uploads')));

// Pre-warm DB
readDb();

// Mount REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', contactRoutes);

// SEO: robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${process.env.APP_URL || 'https://skbrands.pk'}/sitemap.xml
`);
});

// SEO: Dynamic sitemap.xml
app.get('/sitemap.xml', (req: Request, res: Response) => {
  try {
    const db = readDb();
    const baseUrl = process.env.APP_URL || 'https://skbrands.pk';
    const now = new Date().toISOString();

    const staticRoutes = [
      '',
      '/shop',
      '/about',
      '/contact',
      '/faq',
      '/privacy-policy',
      '/terms',
      '/shipping-policy',
      '/return-policy',
      '/track-order'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    staticRoutes.forEach(route => {
      xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    db.products
      .filter(p => p.status === 'active')
      .forEach(prod => {
        xml += `
  <url>
    <loc>${baseUrl}/product/${prod.slug}</loc>
    <lastmod>${prod.updatedAt || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      });

    xml += `
</urlset>`;

    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Centralized error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Express Error Handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    errors: err.errors || []
  });
});

async function startServer() {
  if (!isProduction) {
    // In development, hook up Vite dev server as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SK Brands Full-Stack Store running at http://localhost:${PORT}`);
  });
}

startServer();

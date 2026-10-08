# SK BRANDS — Premium Pakistani Fashion & Pret E-Commerce Platform

A production-ready full-stack luxury fashion e-commerce web platform for **SK Brands**, an artisanal Pakistani fashion house specializing in embroidered chiffon, festive lawn, organza, silk, and bridal couture.

---

## 🌟 Key Highlights & Features

### 🛍️ Customer Experience
- **Responsive Luxury Aesthetics:** Crafted with a refined fashion palette (ivory, charcoal, champagne gold, serif typography) inspired by top couture boutiques.
- **Sticky Luxury Header:** Announcement bar with dynamic promo code reminders, logo branding, collection dropdowns, instant search, wishlist counter, and sliding cart drawer.
- **Advanced Shop & Collections (`/shop`):**
  - Left filter sidebar (Desktop) + Mobile slide-out drawer
  - Filtering by **Price Range**, **Availability** (In Stock / Out of Stock), **Category** (Formal, Casual Lawn, Party Wear, Luxury Pret, Bridal Couture), **Fabric** (Chiffon, Lawn, Organza, Silk, Velvet, Cotton), **Color**, and **Size** (XS to XXL, Unstitched)
  - Sorting: Featured, Best Selling, A-Z, Z-A, Price Low-to-High, Price High-to-Low, Newest
  - Dynamic active filter tags with one-click **"Clear All"**
- **Rich Product Grid Cards:**
  - Double image hover flip (primary & secondary high-resolution fashion model photography)
  - Sale discount percentage badges
  - Quick Add to bag & Quick View modal
  - Wishlist heart toggle
- **Comprehensive Product Details (`/product/:slug`):**
  - Interactive multi-image gallery with zoom
  - Rating stars, reviews count, SKU, stock status
  - Color swatches & size selection
  - Interactive **Size Guide Modal** with exact chest, waist, hip, and length measurements in inches
  - **"Order via WhatsApp"** button generating pre-formatted WhatsApp messages containing product name, SKU, selected size, color, quantity, and price
  - Information accordions: Description, Size Guide, Worldwide & Domestic Shipping, Returns Policy
  - Dynamic **"You May Also Like"** related products recommendation engine
- **Cart & Slide-Over Drawer:**
  - Real-time **Free Worldwide Shipping progress bar** (threshold: Rs. 10,000)
  - Quantity controls, variation badges, instant line totals
  - Server-validated coupon discount engine (`WELCOME10`, `EID20`, `SKBRANDS15`)
- **Checkout & Manual Payment Request Workflow:**
  - Two-column checkout collecting customer contact and destination address
  - Implements the commercial manual payment request workflow requested in the proposal:
    - **Bank Transfer** (Meezan Bank Limited / HBL account and IBAN with one-click copy)
    - **EasyPaisa / JazzCash** mobile wallet transfer
    - **WhatsApp Concierge Invoice / Card link** for international UK/US cardholders
  - Stock validation & real-time inventory decrements
  - Unique order number generation: `SK-2026-000XXX`
- **Order Confirmation & Tracking (`/order-confirmation/:id` & `/track-order`):**
  - Confetti celebration upon order submission
  - Visual 4-stage fulfillment stepper: **Pending Payment ➔ Verified / Processing ➔ Shipped ➔ Completed**
  - Printable customer receipt & direct WhatsApp payment confirmation button
- **Customer Account (`/account`):**
  - Order history with article breakdowns, saved shipping addresses, and profile details

---

### 🛡️ Powerful Admin Dashboard (`/admin`)
- **Protected Portal:** Dedicated login (`/admin/login`) with role-based JWT authorization (`admin` vs `customer`).
- **Real-Time Analytics:**
  - Total Sales (PKR), Total Orders, Pending Payment Orders, Customer Directory count, Catalog Suits, and Low Stock count
  - Visual revenue trajectory bar chart
  - Top 5 best-selling articles by revenue & units sold
  - Recent orders quick-inspect table
- **Product Management (`/admin/products` & `/admin/products/new`):**
  - Add, edit, and delete products with confirmation dialogs
  - Configure titles, SEO slugs, fabrics, categories, retail & sale prices, cost prices, stock thresholds, colors, and sizes
  - Image management with curated high-resolution photography presets or custom image URLs
- **Order Management (`/admin/orders`):**
  - Filter orders by status (Pending Payment, Processing, Shipped, Completed, Cancelled, Refunded)
  - Inspect items, customer shipping details, and payment method
  - Update fulfillment status, payment status, courier tracking IDs (e.g. DHL Express), and append timestamped order notes
- **Client Directory (`/admin/customers`):**
  - Customer contact records, lifetime order counts, and total expenditure
- **Inventory Monitor (`/admin/inventory`):**
  - Warehouse stock monitor with low-stock alerts and inline fast stock adjustment
- **Category & Coupon Management (`/admin/categories` & `/admin/coupons`):**
  - Create and manage seasonal categories and coupon codes (percentage or fixed discount, minimum order, maximum caps, expiry dates, and usage limits)
- **Store Settings (`/admin/settings`):**
  - Edit brand name, WhatsApp concierge phone number, support email, showroom address, shipping fees, free shipping threshold, and bank account details
- **Customer Inquiries (`/admin/inquiries`):**
  - Review and update status on client contact inquiries submitted via `/contact`

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@skbrands.com` | `admin123` | Full Admin Dashboard & Storefront |
| **Demo Customer** | `ayesha.malik@example.com` | `customer123` | Customer Account & Order History |

*(One-click demo login buttons are also available on `/login` and `/admin/login`)*

---

## 🎟️ Active Demo Coupons

| Code | Discount | Min Order | Description |
|---|---|---|---|
| `WELCOME10` | 10% OFF | Rs. 3,000 | Welcome promotion for new customers |
| `EID20` | 20% OFF | Rs. 8,000 | Festive Eid collection discount (Max Rs. 2,500) |
| `SKBRANDS15` | 15% OFF | Rs. 5,000 | VIP client perk |

---

## 🛠️ Technology Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React Icons, React Router v7, Canvas Confetti
- **Backend:** Node.js, Express.js, TypeScript (`tsx` runtime), JSON Web Tokens (JWT), Bcrypt password hashing
- **Data Persistence:** Atomic JSON storage engine (`data/db.json`) supporting full CRUD, relationships, schema validation, and pre-seeded luxury Pakistani fashion data
- **SEO Ready:** Dynamic XML sitemap at `/sitemap.xml`, `/robots.txt`, and Schema.org JSON-LD structured data on all product pages

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at **http://localhost:3000**.

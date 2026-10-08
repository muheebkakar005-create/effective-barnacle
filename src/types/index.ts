export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses?: Array<{
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    isDefault?: boolean;
  }>;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
  productCount?: number;
}

export interface ProductVariation {
  id: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  fabric: string;
  sku: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  variations: ProductVariation[];
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  productSlug: string;
  name: string;
  color?: string;
  size?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  sku: string;
  maxStock: number;
}

export interface OrderItem {
  productId: string;
  productSlug: string;
  name: string;
  color?: string;
  size?: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface OrderNote {
  id: string;
  text: string;
  date: string;
  author: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  billingAddress?: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: {
    code: string;
    amount: number;
  };
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: 'Pending Payment' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled' | 'Refunded';
  trackingNumber?: string;
  shippingCarrier?: string;
  notes: OrderNote[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  amount: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  logo: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  internationalShippingFee: number;
  announcementText: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
  };
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCode: string;
  };
  seoDefaults: {
    title: string;
    description: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Facets {
  fabrics: string[];
  colors: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
}

import {
  Product,
  Category,
  Order,
  Coupon,
  StoreSettings,
  ContactMessage,
  Pagination,
  Facets,
  User
} from '../types/index.ts';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('sk_auth_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('sk_auth_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('sk_auth_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed.');
  }

  return data;
}

export const api = {
  // Products
  getProducts: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    return request<{
      success: boolean;
      products: Product[];
      pagination: Pagination;
      facets: Facets;
    }>(`/products?${query.toString()}`);
  },

  getProduct: (slug: string) => {
    return request<{
      success: boolean;
      product: Product;
      related: Product[];
    }>(`/products/${slug}`);
  },

  createProduct: (data: Partial<Product>) => {
    return request<{ success: boolean; product: Product; message: string }>('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateProduct: (id: string, data: Partial<Product>) => {
    return request<{ success: boolean; product: Product; message: string }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteProduct: (id: string) => {
    return request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Categories
  getCategories: () => {
    return request<{ success: boolean; categories: Category[] }>('/categories');
  },

  createCategory: (data: Partial<Category>) => {
    return request<{ success: boolean; category: Category; message: string }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateCategory: (id: string, data: Partial<Category>) => {
    return request<{ success: boolean; category: Category; message: string }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteCategory: (id: string) => {
    return request<{ success: boolean; message: string }>(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Orders
  createOrder: (orderData: any) => {
    return request<{ success: boolean; order: Order; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  getMyOrders: () => {
    return request<{ success: boolean; orders: Order[] }>('/orders/my-orders');
  },

  getOrder: (id: string) => {
    return request<{ success: boolean; order: Order }>(`/orders/${id}`);
  },

  trackOrder: (orderNumber: string, identifier: string) => {
    return request<{ success: boolean; order?: Order; message?: string }>('/orders/track', {
      method: 'POST',
      body: JSON.stringify({ orderNumber, identifier })
    });
  },

  // Coupons
  validateCoupon: (code: string, subtotal: number) => {
    return request<{
      success: boolean;
      message: string;
      coupon: { code: string; discountType: string; amount: number; calculatedDiscount: number };
    }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    });
  },

  // Auth
  login: (credentials: { email: string; password: string }) => {
    return request<{ success: boolean; token: string; user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  register: (userData: { name: string; email: string; password: string; phone?: string }) => {
    return request<{ success: boolean; token: string; user: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: () => {
    return request<{ success: boolean; user: User }>('/auth/me');
  },

  updateProfile: (data: any) => {
    return request<{ success: boolean; user: User; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Contact & Settings
  sendMessage: (data: { name: string; email: string; phone?: string; message: string }) => {
    return request<{ success: boolean; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getSettings: () => {
    return request<{ success: boolean; settings: StoreSettings }>('/settings');
  },

  // Admin APIs
  getAdminDashboard: () => {
    return request<{
      success: boolean;
      stats: {
        totalSales: number;
        totalOrders: number;
        pendingOrders: number;
        totalCustomers: number;
        totalProducts: number;
        lowStockCount: number;
      };
      salesTrend: Array<{ date: string; amount: number }>;
      topProducts: Array<{ name: string; quantity: number; revenue: number; image: string }>;
      recentOrders: Order[];
    }>('/admin/dashboard');
  },

  getAdminOrders: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ success: boolean; orders: Order[] }>(`/admin/orders?${query}`);
  },

  updateOrderStatus: (id: string, update: {
    orderStatus?: string;
    paymentStatus?: string;
    trackingNumber?: string;
    shippingCarrier?: string;
    note?: string;
  }) => {
    return request<{ success: boolean; order: Order; message: string }>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(update)
    });
  },

  addOrderNote: (id: string, text: string) => {
    return request<{ success: boolean; note: any; message: string }>(`/admin/orders/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },

  getAdminCustomers: () => {
    return request<{ success: boolean; customers: any[] }>('/admin/customers');
  },

  getAdminInventory: () => {
    return request<{ success: boolean; inventory: any[] }>('/admin/inventory');
  },

  updateInventoryStock: (id: string, data: { stock?: number; lowStockThreshold?: number }) => {
    return request<{ success: boolean; product: any; message: string }>(`/admin/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  getAdminCoupons: () => {
    return request<{ success: boolean; coupons: Coupon[] }>('/admin/coupons');
  },

  createCoupon: (data: Partial<Coupon>) => {
    return request<{ success: boolean; coupon: Coupon; message: string }>('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateCoupon: (id: string, data: Partial<Coupon>) => {
    return request<{ success: boolean; coupon: Coupon; message: string }>(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteCoupon: (id: string) => {
    return request<{ success: boolean; message: string }>(`/admin/coupons/${id}`, {
      method: 'DELETE'
    });
  },

  getAdminSettings: () => {
    return request<{ success: boolean; settings: StoreSettings }>('/admin/settings');
  },

  updateAdminSettings: (settings: Partial<StoreSettings>) => {
    return request<{ success: boolean; settings: StoreSettings; message: string }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  getAdminInquiries: () => {
    return request<{ success: boolean; inquiries: ContactMessage[] }>('/admin/inquiries');
  },

  updateInquiryStatus: (id: string, status: 'unread' | 'read' | 'replied') => {
    return request<{ success: boolean; inquiry: ContactMessage; message: string }>(`/admin/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  uploadImage: (image: string, fileName?: string) => {
    return request<{ success: boolean; url: string; message: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ image, fileName })
    });
  },

  getImagePresets: () => {
    return request<{ success: boolean; presets: Array<{ title: string; url: string }> }>('/upload/presets');
  }
};

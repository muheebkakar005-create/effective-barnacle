import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AppliedCoupon {
  code: string;
  discountType: string;
  amount: number;
  calculatedDiscount: number;
}

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  total: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 10000; // Rs. 10,000
const STANDARD_SHIPPING = 350;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      const saved = localStorage.getItem('sk_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sk_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('sk_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('sk_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [coupon]);

  const addToCart = (product: Product, color?: string, size?: string, quantity = 1) => {
    const selectedColor = color || (product.colors && product.colors[0]) || '';
    const selectedSize = size || (product.sizes && product.sizes[0]) || '';
    const unitPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.productId === product.id && item.color === selectedColor && item.size === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          productSlug: product.slug,
          name: product.name,
          color: selectedColor,
          size: selectedSize,
          price: unitPrice,
          originalPrice: product.salePrice ? product.price : undefined,
          quantity: Math.min(quantity, product.stock),
          image: product.images[0] || '',
          sku: product.sku,
          maxStock: product.stock
        };
        return [...prevItems, newItem];
      }
    });

    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setItems(prev =>
      prev.filter(
        item => !(item.productId === productId && item.color === (color || '') && item.size === (size || ''))
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.productId === productId && item.color === (color || '') && item.size === (size || '')) {
          return {
            ...item,
            quantity: Math.min(quantity, item.maxStock || 99)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    localStorage.removeItem('sk_cart');
    localStorage.removeItem('sk_coupon');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Recalculate discount based on current subtotal
  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.amount) / 100);
    } else {
      discount = Math.min(coupon.amount, subtotal);
    }
  }

  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const shipping = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : STANDARD_SHIPPING;
  const total = Math.max(0, subtotal - discount + shipping);
  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success && res.coupon) {
        setCoupon({
          code: res.coupon.code,
          discountType: res.coupon.discountType,
          amount: res.coupon.amount,
          calculatedDiscount: res.coupon.calculatedDiscount
        });
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Invalid coupon' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shipping,
        freeShippingThreshold,
        freeShippingRemaining,
        total,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

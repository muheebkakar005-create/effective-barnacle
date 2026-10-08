import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { formatPrice } from '../../utils/formatters.ts';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    freeShippingThreshold,
    freeShippingRemaining
  } = useCart();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(100, Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCFAF7] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-display text-lg font-bold tracking-wider text-black">
                SHOPPING BAG ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 text-stone-400 hover:text-black transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F6F2EC] px-5 py-3 border-b border-stone-200 text-xs">
            {freeShippingRemaining > 0 ? (
              <div>
                <p className="text-stone-700 flex items-center gap-1.5 font-medium mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B016]" />
                  Add <strong className="text-black font-semibold">{formatPrice(freeShippingRemaining)}</strong> more for <span className="text-[#F5B016] font-semibold">Free Worldwide Shipping</span>!
                </p>
                <div className="w-full bg-stone-300 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F5B016] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Congratulations! You qualified for Free Worldwide Shipping!
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-200">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-display text-lg font-medium text-stone-800">Your shopping bag is empty</p>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore our curated Pakistani pret collections and timeless hand-embroidered silhouettes.
                  </p>
                </div>
                <Link
                  to="/shop"
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#18181A] text-white text-xs tracking-widest uppercase font-semibold hover:bg-stone-800 transition-colors rounded"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.productSlug}`}
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-20 h-26 shrink-0 bg-stone-100 rounded overflow-hidden border border-stone-200"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.productSlug}`}
                          onClick={() => setIsDrawerOpen(false)}
                          className="text-xs font-semibold text-stone-900 hover:text-[#F5B016] line-clamp-2 transition-colors leading-snug"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.color, item.size)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variation tags */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-500">
                        {item.color && (
                          <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-semibold text-stone-700">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-300 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.size)}
                          className="p-1 text-stone-500 hover:text-black hover:bg-stone-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}
                          className="p-1 text-stone-500 hover:text-black hover:bg-stone-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.originalPrice && (
                          <div className="text-[10px] text-stone-400 line-through">
                            {formatPrice(item.originalPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal & Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{subtotal >= freeShippingThreshold ? 'Free Worldwide' : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Estimated Total</span>
                  <span className="text-base text-black font-display font-bold">
                    {formatPrice(subtotal - discount)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-3 text-center border border-stone-900 text-stone-900 font-semibold text-xs tracking-widest uppercase hover:bg-stone-50 transition-colors rounded"
                >
                  View Bag
                </Link>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#18181A] text-white font-semibold text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors rounded shadow"
                >
                  Checkout
                </button>
              </div>

              <p className="text-[10px] text-stone-400 text-center">
                Taxes, duties & concierge payment verified at final step.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { formatPrice } from '../utils/formatters.ts';
import { SEO } from '../components/common/SEO.tsx';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    freeShippingThreshold,
    freeShippingRemaining,
    total,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { showToast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    const res = await applyCoupon(couponCode.trim());
    setIsApplying(false);

    if (res.success) {
      showToast(res.message, 'success');
      setCouponCode('');
    } else {
      showToast(res.message, 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FCFAF7] flex flex-col items-center justify-center text-center px-4 py-16">
        <SEO title="Shopping Bag | SK Brands" />
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-display text-3xl font-normal text-stone-900 mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
          Looks like you haven't selected any luxury pieces yet. Explore our handcrafted festive pret and embroidered chiffon suits.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  const freeShippingProgress = Math.min(100, Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100));

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-8 sm:py-12">
      <SEO title="Shopping Bag | SK Brands" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200 flex items-center justify-between">
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-stone-950">
            Shopping Bag
          </h1>
          <Link
            to="/shop"
            className="text-xs font-semibold text-stone-600 hover:text-black flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Free Shipping Progress */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-stone-200">
          {freeShippingRemaining > 0 ? (
            <div>
              <p className="text-xs text-stone-700 flex items-center gap-1.5 font-medium mb-2">
                <Sparkles className="w-4 h-4 text-[#F5B016]" />
                Add <strong className="text-black">{formatPrice(freeShippingRemaining)}</strong> more to unlock <span className="text-[#F5B016] font-semibold">Free Worldwide Shipping</span>!
              </p>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#F5B016] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              You qualify for Free Worldwide Shipping!
            </p>
          )}
        </div>

        {/* Cart Content: Items Table (Left) & Summary (Right) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Items List (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-200 overflow-hidden shadow-xs">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="w-24 h-32 sm:w-28 sm:h-36 shrink-0 bg-stone-100 rounded overflow-hidden border border-stone-200"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.productSlug}`}
                          className="font-display text-sm sm:text-base font-semibold text-stone-900 hover:text-[#F5B016] transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.color, item.size)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs text-stone-500 flex-wrap">
                        {item.color && (
                          <span className="bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
                            Color: <strong className="text-stone-800">{item.color}</strong>
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
                            Size: <strong className="text-stone-800">{item.size}</strong>
                          </span>
                        )}
                        <span className="text-stone-400 font-mono text-[11px]">
                          SKU: {item.sku}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-stone-100">
                      {/* Qty Controls */}
                      <div className="flex items-center border border-stone-300 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.size)}
                          className="p-1.5 text-stone-600 hover:text-black hover:bg-stone-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}
                          className="p-1.5 text-stone-600 hover:text-black hover:bg-stone-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-bold text-stone-900 font-sans">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.originalPrice && (
                          <div className="text-xs text-stone-400 line-through">
                            {formatPrice(item.originalPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reassurance Banner */}
            <div className="p-4 bg-stone-100/70 rounded-lg flex items-center gap-3 text-xs text-stone-600">
              <ShieldCheck className="w-5 h-5 text-[#F5B016] shrink-0" />
              <span>
                All garments undergo thorough hand-inspection in our Lahore atelier before export packaging.
              </span>
            </div>
          </div>

          {/* Order Summary (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Coupon Code Section */}
            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs">
              <h3 className="font-display text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#F5B016]" />
                Promo / Coupon Code
              </h3>

              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800">
                  <div>
                    <span className="font-bold tracking-wider">{coupon.code}</span>
                    <span className="block text-[11px] text-emerald-600">
                      Savings: {formatPrice(coupon.calculatedDiscount)}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 text-xs font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs font-medium text-black uppercase placeholder-stone-400 focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponCode.trim()}
                    className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <strong className="text-emerald-700">Free Worldwide</strong>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-900">Grand Total</span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-stone-950">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-[0.2em] uppercase rounded transition-colors shadow flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-stone-400 text-center leading-normal">
                Payment verified securely by concierge. Bank transfer & WhatsApp invoice supported.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, Building2, Smartphone, MessageCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { api } from '../services/api.ts';
import { formatPrice } from '../utils/formatters.ts';
import { SEO } from '../components/common/SEO.tsx';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: 'United Kingdom',
    city: '',
    address: '',
    postalCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'easypaisa_jazzcash' | 'whatsapp_invoice'>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Autofill if logged in
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.name.split(' ')[0] || '',
        lastName: prev.lastName || user.name.split(' ').slice(1).join(' ') || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        country: defaultAddr?.country || prev.country,
        city: defaultAddr?.city || prev.city,
        address: defaultAddr?.address || prev.address,
        postalCode: defaultAddr?.postalCode || prev.postalCode
      }));
    }
  }, [user]);

  // Shipping calculation
  const isPakistan = formData.country.toLowerCase().includes('pakistan') || formData.country.toLowerCase() === 'pk';
  const shipping = subtotal >= 10000 ? 0 : isPakistan ? 350 : 3500;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.country) {
      setErrorMessage('Please fill in all required shipping and contact fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      let paymentLabel = 'Manual Payment (Bank Transfer)';
      if (paymentMethod === 'easypaisa_jazzcash') {
        paymentLabel = 'JazzCash / EasyPaisa Mobile Transfer';
      } else if (paymentMethod === 'whatsapp_invoice') {
        paymentLabel = 'WhatsApp Concierge Invoice / Card Link';
      }

      const orderPayload = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode
        },
        items: items.map(i => ({
          productId: i.productId,
          productSlug: i.productSlug,
          name: i.name,
          color: i.color,
          size: i.size,
          quantity: i.quantity,
          image: i.image,
          sku: i.sku
        })),
        couponCode: coupon?.code,
        paymentMethod: paymentLabel,
        userId: user?.id
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.order) {
        clearCart();
        showToast('Order placed successfully! Concierge details generated.', 'success');
        navigate(`/order-confirmation/${res.order.orderNumber}`);
      } else {
        setErrorMessage(res.message || 'Failed to place order.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-8 sm:py-12">
      <SEO title="Checkout | SK Brands" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="font-display tracking-[0.25em] text-xl font-bold text-stone-900">
              SK BRANDS
            </span>
            <span className="text-xs text-stone-400 ml-2 font-mono">SECURE CHECKOUT</span>
          </div>
          <Link
            to="/cart"
            className="text-xs font-semibold text-stone-600 hover:text-black flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bag
          </Link>
        </div>

        {errorMessage && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Customer & Shipping Information (Col 7) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Information */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-display text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
                1. Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="order updates will be sent here"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="e.g. +44 7700 900123"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs space-y-4">
              <h2 className="font-display text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
                2. Delivery Destination
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Canada">Canada</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Oman">Oman</option>
                    <option value="Other">Other Worldwide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    placeholder="e.g. London, Lahore, New York"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Street Address & Flat / Apartment Number *
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="Complete residential or business address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Postal Code / ZIP *
                  </label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    placeholder="e.g. W8 4SG / 54000"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Delivery Instructions / Custom Sizing Notes
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="Optional notes for our stylist"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection (Manual Request Workflow) */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="font-display text-lg font-bold text-stone-900">
                  3. Payment Method
                </h2>
                <span className="text-[11px] text-stone-500 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Manual Request Workflow
                </span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                As per Pakistani commercial regulations, international and domestic orders are initially processed as <strong>Pending Payment</strong>. Once placed, you will receive our verified account invoice, and our styling concierge will contact you on WhatsApp/Email to confirm receipt.
              </p>

              <div className="space-y-3 pt-2">
                {/* Option 1: Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-black bg-stone-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-0.5 accent-black"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <Building2 className="w-4 h-4 text-[#F5B016]" />
                      Direct Bank Transfer (Meezan Bank Limited - Liaqat Bazaar Quetta)
                    </div>
                    <p className="text-stone-500 mt-1">
                      Account Title: <strong>SK Brand Sami Khan</strong>. You will receive verified IBAN & account details immediately on the order confirmation screen.
                    </p>
                  </div>
                </label>

                {/* Option 2: EasyPaisa / JazzCash */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'easypaisa_jazzcash'
                      ? 'border-black bg-stone-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'easypaisa_jazzcash'}
                    onChange={() => setPaymentMethod('easypaisa_jazzcash')}
                    className="mt-0.5 accent-black"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <Smartphone className="w-4 h-4 text-[#F5B016]" />
                      JazzCash / EasyPaisa (Pakistan Mobile Wallets)
                    </div>
                    <p className="text-stone-500 mt-1">
                      Convenient instant transfer via mobile wallet to <strong>0314 0003801 / 0316 0367456</strong> (Title: Sami Khan).
                    </p>
                  </div>
                </label>

                {/* Option 3: WhatsApp Concierge Invoice / Card link */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'whatsapp_invoice'
                      ? 'border-black bg-stone-50/80 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'whatsapp_invoice'}
                    onChange={() => setPaymentMethod('whatsapp_invoice')}
                    className="mt-0.5 accent-black"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      International Payment Link via WhatsApp Concierge (0316 0367456)
                    </div>
                    <p className="text-stone-500 mt-1">
                      Ideal for UK, US, and Middle Eastern clients. Our Quetta atelier concierge will generate a secure card invoice link for credit/debit card payment.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sidebar (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4 sticky top-24">
              <h3 className="font-display text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
                Order Review ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-stone-100">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="pt-2 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover rounded bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {item.color} â€¢ Size {item.size} â€¢ Qty {item.quantity}
                      </p>
                      <span className="text-xs font-bold text-stone-900 font-sans">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
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
                  <span>Shipping ({formData.country})</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-700">Free</strong> : formatPrice(shipping)}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-900">Total Due</span>
                  <span className="font-display text-2xl font-bold text-stone-950">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-[0.2em] uppercase rounded transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#F5B016]" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    Place Order (SK-2026)
                  </>
                )}
              </button>

              <div className="p-3 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-500 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-700">
                  <ShieldCheck className="w-4 h-4 text-[#F5B016]" />
                  SK Brands Protection Guarantee
                </div>
                <p>
                  No payment is charged automatically. You will receive an official invoice and your allocated inventory is reserved immediately.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


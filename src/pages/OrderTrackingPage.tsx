import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Order } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatPrice, formatDate } from '../utils/formatters.ts';
import { SEO } from '../components/common/SEO.tsx';
import { SKBrandLogo } from '../components/common/SKBrandLogo.tsx';

export const OrderTrackingPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !identifier.trim()) {
      setError('Please provide both your Order Number and Email or Phone number.');
      return;
    }

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await api.trackOrder(orderNumber.trim(), identifier.trim());
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setError(res.message || 'No matching order found.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to track order. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepStatus = (status: string) => {
    const sequence = ['Pending Payment', 'Processing', 'Shipped', 'Completed'];
    const currentIndex = sequence.indexOf(status);

    return {
      isPending: currentIndex >= 0,
      isProcessing: currentIndex >= 1,
      isShipped: currentIndex >= 2,
      isCompleted: currentIndex >= 3
    };
  };

  const steps = order ? getStepStatus(order.orderStatus) : null;

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-8 sm:py-16">
      <SEO
        title="Track Your Order | SK Brands"
        description="Check real-time status, payment verification, and dispatch tracking for your SK Brands order."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex justify-center mb-2">
            <SKBrandLogo size="md" showText={true} />
          </div>
          <span className="text-xs font-semibold tracking-[0.25em] text-[#F5B016] uppercase block mb-1">
            Dispatch & Delivery â€¢ Liaqat Bazaar Quetta
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-stone-900">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Enter your unique SK Brands order number along with the email or phone number used at checkout.
          </p>
        </div>

        {/* Tracking Lookup Form */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SK-2026-000101"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Billing Email or Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ayesha.malik@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-semibold text-xs tracking-[0.2em] uppercase rounded transition-colors flex items-center justify-center gap-2 shadow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F5B016]" />
                  Locating Order...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Live Status
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Try sample order:</span>
            <button
              type="button"
              onClick={() => {
                setOrderNumber('SK-2026-000101');
                setIdentifier('ayesha.malik@example.com');
              }}
              className="text-[#F5B016] font-semibold hover:underline"
            >
              Load Demo Order (SK-2026-000101)
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Results Card */}
        {order && steps && (
          <div className="mt-8 bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in duration-300">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#F5B016] block">
                  Order Details
                </span>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  {order.orderNumber}
                </h3>
                <p className="text-xs text-stone-500">
                  Placed on {formatDate(order.createdAt)} â€¢ Recipient: {order.customerInfo.firstName} {order.customerInfo.lastName}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-900 text-white">
                  {order.orderStatus}
                </span>
                <div className="text-xs text-stone-500 mt-1">
                  Payment Status: <strong className="text-stone-800">{order.paymentStatus}</strong>
                </div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-6">
                Fulfillment Progress
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                    steps.isPending ? 'bg-black text-white' : 'bg-stone-200 text-stone-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-stone-900 text-[11px]">Placed</span>
                  <span className="text-[10px] text-stone-400">Pending Pay</span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                    steps.isProcessing ? 'bg-black text-white' : 'bg-stone-200 text-stone-400'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-stone-900 text-[11px]">Verified</span>
                  <span className="text-[10px] text-stone-400">Processing</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                    steps.isShipped ? 'bg-black text-white' : 'bg-stone-200 text-stone-400'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-stone-900 text-[11px]">Shipped</span>
                  <span className="text-[10px] text-stone-400">In Transit</span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                    steps.isCompleted ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-stone-900 text-[11px]">Delivered</span>
                  <span className="text-[10px] text-stone-400">Completed</span>
                </div>
              </div>
            </div>

            {/* Tracking Details if Shipped */}
            {order.trackingNumber && (
              <div className="p-4 bg-stone-100 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Courier Carrier</span>
                  <span className="font-bold text-stone-900">{order.shippingCarrier || 'Express Courier'}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">Tracking Number</span>
                  <span className="font-mono font-bold text-stone-900">{order.trackingNumber}</span>
                </div>
              </div>
            )}

            {/* Order Timeline Notes */}
            {order.notes && order.notes.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Concierge Status Updates
                </h4>
                <div className="space-y-2">
                  {order.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-stone-50 rounded border border-stone-200 text-xs">
                      <div className="flex justify-between items-center text-[10px] text-stone-400 mb-1">
                        <span className="font-semibold text-[#F5B016]">{note.author}</span>
                        <span>{formatDate(note.date)}</span>
                      </div>
                      <p className="text-stone-700">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Articles in this Package ({order.items.length})
              </h4>
              <div className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-14 object-cover rounded bg-stone-100" />
                      <div>
                        <span className="font-semibold text-stone-900 block truncate max-w-xs">{item.name}</span>
                        <span className="text-[11px] text-stone-400">Size: {item.size} â€¢ Color: {item.color} â€¢ Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-900">
                <span>Grand Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


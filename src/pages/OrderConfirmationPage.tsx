import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Printer,
  Clock,
  ArrowRight,
  Building2,
  Package,
  Loader2
} from 'lucide-react';
import { Order } from '../types/index.ts';
import { api } from '../services/api.ts';
import { formatPrice, formatDate } from '../utils/formatters.ts';
import { SEO } from '../components/common/SEO.tsx';
import { SKBrandLogo } from '../components/common/SKBrandLogo.tsx';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await api.getOrder(id);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Error fetching order confirmation:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5B016]" />
        <span className="text-xs uppercase font-semibold text-stone-500">Retrieving Order Invoice...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500">Could not locate order #{id}.</p>
        <Link to="/" className="px-6 py-2.5 bg-black text-white text-xs font-semibold rounded">
          Return Home
        </Link>
      </div>
    );
  }

  const bankDetails = {
    bankName: 'Meezan Bank Limited (Liaqat Bazaar Quetta Branch)',
    accountTitle: 'SK Brand Sami Khan',
    accountNumber: '02100109845678',
    iban: 'PK45MEZN0002100109845678',
    branchCode: '0210 - Liaqat Bazaar Quetta'
  };

  const whatsappMessage = encodeURIComponent(
    `*As-salamu alaykum SK Brand Sami Khan!*\nI have placed order: *${order.orderNumber}*\nTotal: *${formatPrice(order.total)}*\nCustomer: ${order.customerInfo.firstName} ${order.customerInfo.lastName}\nStore: Liaqat Bazaar Quetta\n\nPlease share payment confirmation or send card invoice. Thank you!`
  );

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-8 sm:py-16">
      <SEO title={`Order Confirmed: ${order.orderNumber} | SK Brand Sami Khan`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-10 shadow-sm text-center space-y-4">
          <div className="flex justify-center mb-1">
            <SKBrandLogo size="md" showTagline={true} />
          </div>

          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 mt-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 bg-[#F4ECE1] text-[#F5B016] text-xs font-bold tracking-widest uppercase rounded-full">
            Order Successfully Received
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-normal text-stone-950">
            Thank you, {order.customerInfo.firstName}!
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Your luxury fashion order <strong className="text-black font-mono font-bold">{order.orderNumber}</strong> has been created. A confirmation receipt has been logged for <span className="underline">{order.customerInfo.email}</span>.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Order Status: {order.orderStatus}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold">
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Payment Instructions Box (Manual Workflow) */}
        <div className="mt-8 bg-stone-900 text-white rounded-xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#F5B016]" />
              <h3 className="font-display text-lg font-bold text-white tracking-wider">
                PAYMENT INSTRUCTIONS
              </h3>
            </div>
            <span className="text-xs text-[#F5B016] font-mono font-semibold">
              Amount Due: {formatPrice(order.total)}
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Please transfer the exact amount of <strong>{formatPrice(order.total)}</strong> to our official business bank account below, or contact our WhatsApp styling concierge to receive a secure credit card payment link:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-stone-800/80 rounded-lg border border-stone-700">
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Bank Name</span>
              <span className="font-bold text-white text-sm">{bankDetails.bankName}</span>
            </div>

            <div className="p-3.5 bg-stone-800/80 rounded-lg border border-stone-700">
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Account Title</span>
              <span className="font-bold text-white text-sm">{bankDetails.accountTitle}</span>
            </div>

            <div className="p-3.5 bg-stone-800/80 rounded-lg border border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold">Account Number</span>
                <span className="font-mono font-bold text-white text-sm">{bankDetails.accountNumber}</span>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.accountNumber, 'acc')}
                className="p-1.5 hover:bg-stone-700 rounded text-stone-300"
                aria-label="Copy account number"
              >
                {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3.5 bg-stone-800/80 rounded-lg border border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-semibold">IBAN (International Transfer)</span>
                <span className="font-mono font-bold text-white text-xs truncate max-w-[180px] block">{bankDetails.iban}</span>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.iban, 'iban')}
                className="p-1.5 hover:bg-stone-700 rounded text-stone-300"
                aria-label="Copy IBAN"
              >
                {copiedField === 'iban' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={`https://wa.me/923160367456?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              Confirm Payment / Send Screenshot on WhatsApp (0316 0367456)
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors border border-stone-700"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="mt-8 bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h3 className="font-display text-lg font-bold text-stone-900">
              Purchased Items
            </h3>
            <span className="text-xs text-stone-500">
              Placed on {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {order.items.map((item, index) => (
              <div key={index} className="py-3 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-18 object-cover rounded bg-stone-100 shrink-0 border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-stone-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {item.color} â€¢ Size: {item.size} â€¢ Qty: {item.quantity}
                  </p>
                  <span className="text-xs font-mono text-stone-400">
                    SKU: {item.sku}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900 font-sans">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.coupon?.code})</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{order.shipping === 0 ? 'Free Worldwide' : formatPrice(order.shipping)}</span>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-stone-950">
              <span>Total Amount</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-black">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block mb-1">
                Shipping Address
              </span>
              <p className="text-stone-600 leading-relaxed">
                {order.customerInfo.firstName} {order.customerInfo.lastName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>

            <div>
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block mb-1">
                Customer Contact
              </span>
              <p className="text-stone-600 leading-relaxed">
                Email: {order.customerInfo.email}<br />
                Phone: {order.customerInfo.phone}<br />
                Payment: {order.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Action Link to Track Order */}
        <div className="mt-8 text-center">
          <Link
            to="/track-order"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#F5B016] hover:text-black uppercase tracking-widest transition-colors"
          >
            <Package className="w-4 h-4" />
            Check Live Delivery Status in Order Tracking
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};


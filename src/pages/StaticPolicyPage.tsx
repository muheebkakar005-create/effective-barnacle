import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, HelpCircle, FileText } from 'lucide-react';
import { SEO } from '../components/common/SEO.tsx';

export const StaticPolicyPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Policy';
  let icon = <FileText className="w-8 h-8 text-[#F5B016]" />;

  if (path.includes('faq')) {
    title = 'Frequently Asked Questions (FAQ)';
    icon = <HelpCircle className="w-8 h-8 text-[#F5B016]" />;
  } else if (path.includes('shipping')) {
    title = 'Worldwide Shipping Policy';
    icon = <Truck className="w-8 h-8 text-[#F5B016]" />;
  } else if (path.includes('return')) {
    title = 'Return & Refund Policy';
    icon = <RotateCcw className="w-8 h-8 text-[#F5B016]" />;
  } else if (path.includes('privacy')) {
    title = 'Privacy Policy';
    icon = <Shield className="w-8 h-8 text-[#F5B016]" />;
  } else if (path.includes('terms')) {
    title = 'Terms & Conditions';
    icon = <FileText className="w-8 h-8 text-[#F5B016]" />;
  }

  return (
    <div className="min-h-screen bg-[#FCFAF7] py-12 sm:py-20">
      <SEO title={`${title} | SK Brands`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 border border-stone-200">
            {icon}
          </div>
          <span className="text-xs font-semibold tracking-[0.25em] text-[#F5B016] uppercase">
            SK Brands Official Guidelines
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-stone-900">
            {title}
          </h1>
          <div className="w-12 h-0.5 bg-[#F5B016] mx-auto mt-2" />
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-8 sm:p-12 shadow-xs prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 space-y-6 leading-relaxed">
          {path.includes('faq') && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-stone-950 mb-1">
                  1. Do you ship to the United Kingdom, USA, and GCC countries?
                </h3>
                <p>
                  Yes, SK Brands delivers worldwide via DHL Express Worldwide and FedEx. Delivery takes 4-7 business days after order dispatch.
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-stone-950 mb-1">
                  2. What payment methods are accepted?
                </h3>
                <p>
                  We operate a verified manual payment request workflow. You can complete payment via Direct Bank Transfer (Meezan Bank, HBL, Raast), JazzCash / EasyPaisa, or request an international card invoice link directly from our concierge on WhatsApp.
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-stone-950 mb-1">
                  3. Are the suits stitched or unstitched?
                </h3>
                <p>
                  Our collection features both Ready-to-Wear stitched pret (available in sizes XS to XXL) and 3-piece unstitched luxury fabrics with embroidered patches. Check the product detail page for exact details.
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-stone-950 mb-1">
                  4. Can I order directly through WhatsApp?
                </h3>
                <p>
                  Yes! Every product page features an "Order via WhatsApp" button that pre-populates your selected size, color, and suit name for seamless concierge ordering.
                </p>
              </div>
            </div>
          )}

          {path.includes('shipping') && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-950">Domestic Shipping (Pakistan)</h3>
              <p>
                Standard delivery across major Pakistani cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta) takes 2-4 business days. Standard shipping fee is Rs. 350, with Free Shipping on all orders above Rs. 10,000.
              </p>

              <h3 className="font-display text-lg font-bold text-stone-950 pt-4">International Express Delivery</h3>
              <p>
                International parcels are dispatched within 48-72 hours of payment verification. Standard international courier fee is Rs. 3,500, with Free Worldwide Express Delivery for orders reaching or exceeding Rs. 10,000. Full track & trace numbers are provided.
              </p>
            </div>
          )}

          {path.includes('return') && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-950">7-Day Exchange Policy</h3>
              <p>
                Articles may be exchanged within 7 days of delivery provided they are unworn, unwashed, unaltered, and retained with all original brand tags, laces, and packaging intact.
              </p>
              <h3 className="font-display text-lg font-bold text-stone-950 pt-4">Custom Stitched & Sale Items</h3>
              <p>
                Custom bespoke-tailored articles altered to specific custom dimensions cannot be returned unless a manufacturing defect is present upon delivery.
              </p>
            </div>
          )}

          {path.includes('privacy') && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-950">Data Protection & Privacy</h3>
              <p>
                SK Brands respects your privacy. Personal data including name, shipping address, telephone number, and email collected during checkout is utilized strictly for processing and delivering your orders.
              </p>
              <p>
                We never sell, rent, or disclose client data to third-party marketing entities.
              </p>
            </div>
          )}

          {path.includes('terms') && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-950">Terms & Conditions</h3>
              <p>
                By placing an order on SK Brands, you agree to our terms of service, payment request verification procedures, and dispatch schedules. Product colors may slightly vary due to studio photographic lighting or monitor calibrations.
              </p>
            </div>
          )}

          <div className="pt-6 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
            <span>Questions regarding this policy?</span>
            <Link to="/contact" className="font-semibold text-black underline">
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


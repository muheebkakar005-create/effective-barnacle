import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Mail, MapPin, Phone, ShieldCheck, Check } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../../utils/formatters.ts';
import { SKBrandLogo } from '../common/SKBrandLogo.tsx';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#1A365D] text-[#EFF6FF] border-t border-[#10243E] pt-16 pb-12 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block group">
              <SKBrandLogo size="md" light={true} showTagline={false} />
            </Link>
            <p className="text-stone-300 text-sm leading-relaxed max-w-md pt-1">
              Curated by <strong className="text-white">Sami Khan</strong>. Authentic hand-made Balochi Doch dresses, fine machine embroidery suits, and royal pret crafted in Quetta and delivered to discerning patrons worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href={generateGeneralWhatsAppUrl('+923160367456')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-bold bg-[#FFCC00] text-[#000000] hover:bg-[#E6B800] transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                WhatsApp: 0316 0367456
              </a>
              <Link
                to="/track-order"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20"
              >
                Track Your Order
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#10243E]/80 p-6 md:p-8 rounded-xl border border-white/10 shadow-lg">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#FFCC00] block mb-2 font-heading">
              Privilege Club
            </span>
            <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2">
              Receive 10% Off Your First Order
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm mb-6">
              Subscribe for exclusive previews of upcoming festive Balochi Doch collections, private sales, and sartorial inspirations.
            </p>

            {subscribed ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded text-sm text-emerald-300 flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Welcome to the SK Brands circle! Use promo code <strong className="text-white underline">WELCOME10</strong> at checkout for 10% discount.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#FFCC00] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#FFCC00] hover:bg-[#E6B800] text-[#000000] font-bold px-6 py-3 text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 rounded-lg shrink-0 shadow-md hover:scale-[1.02]"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-xs sm:text-sm">
          {/* Shop */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold tracking-widest uppercase text-xs text-[#FFCC00]">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link to="/shop?category=balochi-dress" className="hover:text-[#FFCC00] transition-colors font-semibold text-white">Balochi Doch Hand-Made</Link></li>
              <li><Link to="/shop?category=new-arrivals" className="hover:text-[#FFCC00] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?category=formal-wear" className="hover:text-[#FFCC00] transition-colors">Formal Wear</Link></li>
              <li><Link to="/shop?category=casual-wear" className="hover:text-[#FFCC00] transition-colors">Casual Lawn</Link></li>
              <li><Link to="/shop?category=party-wear" className="hover:text-[#FFCC00] transition-colors">Party Wear</Link></li>
              <li><Link to="/shop?category=bridal-couture" className="hover:text-[#FFCC00] transition-colors">Bridal Couture</Link></li>
            </ul>
          </div>

          {/* Shop by Fabric */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold tracking-widest uppercase text-xs text-[#FFCC00]">
              Shop By Fabric
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link to="/shop?fabric=Chiffon" className="hover:text-[#FFCC00] transition-colors">Pure Chiffon</Link></li>
              <li><Link to="/shop?fabric=Lawn" className="hover:text-[#FFCC00] transition-colors">Festive Lawn</Link></li>
              <li><Link to="/shop?fabric=Organza" className="hover:text-[#FFCC00] transition-colors">Embroidered Organza</Link></li>
              <li><Link to="/shop?fabric=Silk" className="hover:text-[#FFCC00] transition-colors">Raw Silk</Link></li>
              <li><Link to="/shop?fabric=Velvet" className="hover:text-[#FFCC00] transition-colors">Royal Velvet</Link></li>
              <li><Link to="/shop?fabric=Cotton" className="hover:text-[#FFCC00] transition-colors">Cotton Silk</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold tracking-widest uppercase text-xs text-[#FFCC00]">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link to="/track-order" className="hover:text-[#FFCC00] transition-colors">Order Tracking</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-[#FFCC00] transition-colors">Worldwide Shipping</Link></li>
              <li><Link to="/return-policy" className="hover:text-[#FFCC00] transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-[#FFCC00] transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-[#FFCC00] transition-colors">Contact Concierge</Link></li>
              <li><Link to="/terms" className="hover:text-[#FFCC00] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold tracking-widest uppercase text-xs text-[#FFCC00]">
              Showroom & Concierge
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Bazaar, Liaqat Bazaar Naseem Fashion Mall Sk Brand, Shara Liaqat, Quetta, 87300, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFCC00] shrink-0" />
                <span>0314 0003801 / 0316 0367456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFCC00] shrink-0" />
                <span>samikhan@skbrand.pk</span>
              </li>
              <li className="pt-2 text-xs text-[#93C5FD]">
                Liaqat Bazaar Quetta • Mon - Sat: 11:00 AM - 9:30 PM PKT
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Notice & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-2 text-[#93C5FD]">
            <ShieldCheck className="w-4 h-4 text-[#FFCC00]" />
            <span>Meezan Bank Limited (Liaqat Bazaar Quetta Branch) • Worldwide Delivery by DHL & Express Post</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-[#FFCC00] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#FFCC00] transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="hover:text-[#FFCC00] transition-colors text-[#FFCC00] font-bold">Admin Portal</Link>
          </div>
        </div>

        <div className="text-center text-xs text-stone-400 pt-6">
          © {new Date().getFullYear()} SK BRAND SAMI KHAN • QUETTA • BALOCHI DOCH. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

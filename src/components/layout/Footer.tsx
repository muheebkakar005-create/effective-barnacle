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
    <footer className="bg-[#14213D] text-[#FFFFFF] font-body pt-16 pb-8 border-t-[4px] border-[#F2B705]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-16 border-b border-[#1D3557]">
          
          {/* Brand Info */}
          <div className="lg:w-5/12 space-y-6">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <SKBrandLogo size="md" light={true} showTagline={false} />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md font-body">
              SK Brand by Sami Khan brings you the finest handcrafted Balochi Doch dresses, premium machine embroidery suits, and royal pret wear directly from our showroom in Liaqat Bazaar, Quetta to your doorstep worldwide.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={generateGeneralWhatsAppUrl('+923160367456')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded text-[13px] font-bold bg-[#25D366] text-[#FFFFFF] hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
              <Link
                to="/track-order"
                className="inline-flex items-center gap-2 px-5 py-3 rounded text-[13px] font-bold bg-[#1D3557] text-[#FFFFFF] hover:bg-[#F2B705] hover:text-[#14213D] transition-colors border border-[#1D3557] hover:border-[#F2B705]"
              >
                Track Order
              </Link>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:w-6/12 bg-[#1D3557] p-8 rounded-lg border border-[#F2B705]/20 shadow-lg w-full">
            <h3 className="font-heading text-xl font-bold text-[#F2B705] mb-3">
              Join the SK Privilege Club
            </h3>
            <p className="text-gray-300 text-sm mb-6 font-body">
              Subscribe for early access to new Balochi Doch collections, exclusive sales, and a 10% discount on your first order.
            </p>

            {subscribed ? (
              <div className="bg-[#25D366]/10 border border-[#25D366] p-4 rounded text-sm text-[#FFFFFF] flex items-center gap-3">
                <Check className="w-5 h-5 text-[#25D366] flex-shrink-0" />
                <span>
                  Welcome to SK Brand! Use promo code <strong className="text-[#F2B705]">WELCOME10</strong> at checkout.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-[#14213D] border border-gray-600 rounded px-4 py-3 text-sm text-[#FFFFFF] placeholder-gray-400 focus:outline-none focus:border-[#F2B705] flex-1 font-body"
                />
                <button
                  type="submit"
                  className="bg-[#F2B705] hover:bg-[#FFFFFF] text-[#14213D] font-bold px-6 py-3 text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2 rounded flex-shrink-0 font-heading"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16 border-b border-[#1D3557]">
          
          <div className="space-y-4">
            <h4 className="font-heading font-bold tracking-widest uppercase text-[13px] text-[#F2B705]">
              Shop Collections
            </h4>
            <ul className="space-y-3 font-body text-[14px]">
              <li><Link to="/shop?category=balochi-dress" className="text-gray-300 hover:text-[#F2B705] transition-colors">Balochi Hand-Made</Link></li>
              <li><Link to="/shop?category=new-arrivals" className="text-gray-300 hover:text-[#F2B705] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?category=party-wear" className="text-gray-300 hover:text-[#F2B705] transition-colors">Party Wear</Link></li>
              <li><Link to="/shop?category=bridal-couture" className="text-gray-300 hover:text-[#F2B705] transition-colors">Bridal Couture</Link></li>
              <li><Link to="/shop?category=casual-wear" className="text-gray-300 hover:text-[#F2B705] transition-colors">Casual Wear</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-bold tracking-widest uppercase text-[13px] text-[#F2B705]">
              Shop By Fabric
            </h4>
            <ul className="space-y-3 font-body text-[14px]">
              <li><Link to="/shop?fabric=Chiffon" className="text-gray-300 hover:text-[#F2B705] transition-colors">Pure Chiffon</Link></li>
              <li><Link to="/shop?fabric=Lawn" className="text-gray-300 hover:text-[#F2B705] transition-colors">Festive Lawn</Link></li>
              <li><Link to="/shop?fabric=Organza" className="text-gray-300 hover:text-[#F2B705] transition-colors">Organza</Link></li>
              <li><Link to="/shop?fabric=Silk" className="text-gray-300 hover:text-[#F2B705] transition-colors">Raw Silk</Link></li>
              <li><Link to="/shop?fabric=Velvet" className="text-gray-300 hover:text-[#F2B705] transition-colors">Velvet</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-bold tracking-widest uppercase text-[13px] text-[#F2B705]">
              Customer Care
            </h4>
            <ul className="space-y-3 font-body text-[14px]">
              <li><Link to="/track-order" className="text-gray-300 hover:text-[#F2B705] transition-colors">Track Your Order</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-300 hover:text-[#F2B705] transition-colors">Shipping Information</Link></li>
              <li><Link to="/return-policy" className="text-gray-300 hover:text-[#F2B705] transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-[#F2B705] transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-[#F2B705] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-bold tracking-widest uppercase text-[13px] text-[#F2B705]">
              Showroom & Contact
            </h4>
            <ul className="space-y-4 font-body text-[14px] text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F2B705] flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Naseem Fashion Mall, SK Brand, Liaqat Bazaar, Quetta, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F2B705] flex-shrink-0" />
                <span>0314 0003801 <br/> 0316 0367456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F2B705] flex-shrink-0" />
                <a href="mailto:samikhan@skbrand.pk" className="hover:text-[#F2B705] transition-colors">samikhan@skbrand.pk</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 font-body text-[13px]">
          
          <div className="flex items-center gap-2 text-gray-400">
            <ShieldCheck className="w-5 h-5 text-[#F2B705]" />
            <span>Secure Checkout • Worldwide Express Delivery via DHL/FedEx</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-[#F2B705] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#F2B705] transition-colors">Terms of Service</Link>
            <Link to="/admin" className="text-[#F2B705] font-bold hover:text-[#FFFFFF] transition-colors">Admin Portal</Link>
          </div>

        </div>
        
        <div className="text-center text-gray-500 text-xs mt-8 font-body">
          © {new Date().getFullYear()} SK BRAND SAMI KHAN • QUETTA • BALOCHI DRESSES. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

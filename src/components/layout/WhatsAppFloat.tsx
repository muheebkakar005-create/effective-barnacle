import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Home, ShoppingBag, Heart, Sparkles, X } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../../utils/formatters.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useWishlist } from '../../context/WishlistContext.tsx';

export const WhatsAppFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const isStoreRoute = !location.pathname.startsWith('/admin');

  if (!isStoreRoute) return null;

  return (
    <>
      {/* 1. Floating Green "Chat with Stylist" Pill (Bottom-Left) */}
      <div className="fixed bottom-24 sm:bottom-8 left-4 sm:left-8 z-50 flex flex-col items-start font-body animate-slideUp">
        {isOpen && (
          <div className="mb-4 w-72 bg-white rounded-2xl shadow-2xl border border-stone-100 p-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-xs font-bold text-[#14213D] tracking-wider font-heading">
                  SK STYLIST CONCIERGE
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#3D3D3D] mt-3 leading-relaxed font-medium">
              As-salamu alaykum! Need assistance with sizing, custom stitching, or order tracking?
            </p>
            <a
              href={generateGeneralWhatsAppUrl('+923160367456', 'As-salamu alaykum SK Brand! I would like styling and order assistance.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md font-heading uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              Chat with Stylist
            </a>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/90 animate-pulse"
          aria-label="Chat with Stylist"
        >
          <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-sm tracking-wider uppercase font-heading font-black">
            {isOpen ? 'Close' : 'Chat with Stylist'}
          </span>
        </button>
      </div>

      {/* 2. Floating WhatsApp Quick Button (Bottom-Right) */}
      <div className="fixed bottom-24 sm:bottom-8 right-4 sm:right-8 z-50 hidden sm:block animate-slideUp">
        <a
          href={generateGeneralWhatsAppUrl('+923160367456', 'As-salamu alaykum SK Brand! I am browsing your online store.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-8 h-8 fill-white text-white" />
        </a>
      </div>

      {/* 3. Sticky Mobile Bottom Bar (Mobile viewports only) */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 py-2 px-4 z-50 sm:hidden flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-slideUp">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            location.pathname === '/' ? 'text-[#F2B705]' : 'text-[#14213D]'
          }`}
        >
          <Home className="w-6 h-6" />
          <span>Home</span>
        </Link>

        <Link
          to="/shop"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            location.pathname === '/shop' ? 'text-[#F2B705]' : 'text-[#14213D]'
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span>Shop</span>
        </Link>

        <a
          href={generateGeneralWhatsAppUrl('+923160367456')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center -mt-8 bg-[#25D366] text-white p-3 rounded-full shadow-xl border-4 border-white hover:scale-105 transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white text-white" />
        </a>

        <Link
          to="/wishlist"
          className={`relative flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
            location.pathname === '/wishlist' ? 'text-[#F2B705]' : 'text-[#14213D]'
          }`}
        >
          <Heart className="w-6 h-6" />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-1 bg-[#F2B705] text-[#14213D] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-sm">
              {wishlistCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[11px] font-bold text-[#14213D] transition-colors hover:text-[#F2B705]"
        >
          <ShoppingBag className="w-6 h-6" />
          <span>Bag</span>
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 right-1 bg-[#F2B705] text-[#14213D] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-sm">
              {totalItemsCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};

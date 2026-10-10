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
      <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start font-body">
        {isOpen && (
          <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-xs font-bold text-[#14213D] tracking-wider font-heading">
                  SAMI KHAN STYLIST CONCIERGE
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#3D3D3D] mt-2 leading-relaxed font-medium">
              As-salamu alaykum! Need assistance with Balochi Doch sizing, custom stitching, or international order tracking?
            </p>
            <a
              href={generateGeneralWhatsAppUrl('+923160367456', 'As-salamu alaykum SK Brand! I would like styling and order assistance.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm font-heading uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              Chat with Stylist Now
            </a>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-extrabold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-white/80"
          aria-label="Chat with Stylist"
        >
          <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs tracking-wider uppercase font-heading font-black">
            {isOpen ? 'Close' : 'Chat with Stylist'}
          </span>
        </button>
      </div>

      {/* 2. Floating WhatsApp Quick Button (Bottom-Right) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 hidden sm:block">
        <a
          href={generateGeneralWhatsAppUrl('+923160367456', 'As-salamu alaykum SK Brand! I am browsing your online store.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-black shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-black" />
        </a>
      </div>

      {/* 3. Sticky Mobile Bottom Bar (Mobile viewports only) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 py-2 px-4 z-40 sm:hidden flex items-center justify-around shadow-2xl">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/' ? 'text-[#F2B705]' : 'text-[#14213D]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/shop"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/shop' ? 'text-[#F2B705]' : 'text-[#14213D]'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Shop</span>
        </Link>

        <a
          href={generateGeneralWhatsAppUrl('+923160367456')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center -mt-4 bg-[#25D366] text-black p-2.5 rounded-full shadow-lg border-2 border-white"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-black" />
        </a>

        <Link
          to="/wishlist"
          className={`relative flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/wishlist' ? 'text-[#F2B705]' : 'text-[#14213D]'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-1 bg-[#F2B705] text-[#14213D] text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black">
              {wishlistCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 text-[10px] font-bold text-[#14213D]"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Bag</span>
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 right-1 bg-[#F2B705] text-[#14213D] text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black">
              {totalItemsCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../../utils/formatters.ts';

export const WhatsAppFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start font-sans">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-xl shadow-2xl border border-stone-200 p-4 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-stone-900 tracking-wider">SK BRANDS CONCIERGE</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            As-salamu alaykum! Need assistance with sizing, custom stitching, or international order payment? Chat directly with our head stylist on WhatsApp.
          </p>
          <a
            href={generateGeneralWhatsAppUrl('+923001234567', 'As-salamu alaykum SK Brands! I would like styling assistance.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-black" />
        <span className="text-xs font-bold tracking-wider hidden sm:inline">
          {isOpen ? 'Close' : 'Chat with Stylist'}
        </span>
      </button>
    </div>
  );
};

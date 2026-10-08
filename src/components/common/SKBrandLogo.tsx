import React, { useState } from 'react';

interface SKBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  light?: boolean;
  stacked?: boolean;
  variant?: 'board' | 'crest' | 'auto';
}

export const SKBrandLogo: React.FC<SKBrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  light = false,
  stacked = false,
  variant = 'auto'
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
    '2xl': 'h-28 sm:h-32'
  };

  const badgeSizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  if (stacked) {
    return (
      <div className={`flex flex-col items-center text-center gap-2.5 ${className}`}>
        {/* Authentic SK Brand Signboard / Badge Logo */}
        <div className="relative group flex items-center justify-center">
          {!imgError ? (
            <div className="rounded-lg p-1 bg-gradient-to-br from-[#F5B016] via-[#FFD25A] to-[#E5A00D] shadow-md border border-[#F5B016]/40 hover:scale-105 transition-transform duration-300">
              <img
                src="/images/sk-logo.png"
                alt="SK Brand Sami Khan Quetta"
                onError={() => setImgError(true)}
                className={`object-contain rounded-md ${sizeMap[size]}`}
              />
            </div>
          ) : (
            <div className={`relative shrink-0 ${badgeSizeMap[size]}`}>
              <img
                src="/sk-brand-logo.svg"
                alt="SK Brand Sami Khan"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
          )}
        </div>

        {showText && (
          <div className="flex flex-col items-center">
            <span
              className={`font-display tracking-[0.25em] text-2xl font-bold uppercase transition-colors ${
                light ? 'text-white' : 'text-[#18181A]'
              }`}
            >
              SK BRAND
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#F5B016]">
                SAMI KHAN
              </span>
              <span className={`text-[10px] tracking-widest ${light ? 'text-stone-300' : 'text-stone-600'}`}>
                • QUETTA • BALOCHI DOCH
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Signboard Logo Badge */}
      {!imgError ? (
        <div className="rounded-md p-0.5 bg-gradient-to-r from-[#F5B016] via-[#FFC738] to-[#1E2B8F] shadow-sm border border-[#F5B016]/30 shrink-0 hover:shadow-md transition-all duration-300">
          <img
            src="/images/sk-logo.png"
            alt="SK Brand Sami Khan - Quetta"
            onError={() => setImgError(true)}
            className={`object-contain rounded ${sizeMap[size]}`}
          />
        </div>
      ) : (
        <div className={`relative shrink-0 ${badgeSizeMap[size]}`}>
          <img
            src="/sk-brand-logo.svg"
            alt="SK Brand - Sami Khan"
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        </div>
      )}

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display tracking-[0.22em] text-xl sm:text-2xl font-black uppercase transition-colors ${
                light ? 'text-white' : 'text-[#18181A]'
              }`}
            >
              SK BRAND
            </span>
          </div>
          <div className="flex items-center gap-1.5 -mt-0.5">
            <span className="text-[11px] tracking-[0.28em] uppercase font-extrabold text-[#F5B016] drop-shadow-sm">
              SAMI KHAN
            </span>
            <span className={`text-[9.5px] font-semibold tracking-wider hidden sm:inline ${light ? 'text-stone-300' : 'text-[#1E2B8F]'}`}>
              • LIAQAT BAZAAR QUETTA
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

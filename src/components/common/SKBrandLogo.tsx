import React, { useState } from 'react';

interface SKBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  light?: boolean;
  stacked?: boolean;
  variant?: 'desktop' | 'mobile' | 'auto';
  showTagline?: boolean;
}

export const SKBrandLogo: React.FC<SKBrandLogoProps> = ({
  className = '',
  size = 'md',
  light = false,
  showTagline = true
}) => {
  const [imgError, setImgError] = useState(false);

  // Height mappings for image logo to fit headers & footers perfectly
  const imageHeights = {
    sm: 'h-9 sm:h-10 max-h-10',
    md: 'h-11 sm:h-12 max-h-12',
    lg: 'h-14 sm:h-16 max-h-16',
    xl: 'h-18 sm:h-20',
    '2xl': 'h-24'
  };

  // Preferred image paths
  const logoImageSrc = light ? '/sk-brand-logo-desktop.png' : '/images/sk-logo-desktop.png';

  if (!imgError) {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src={logoImageSrc}
          alt="SK Brand Sami Khan"
          onError={() => setImgError(true)}
          className={`${imageHeights[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
        />
      </div>
    );
  }

  // Compact fallback CSS pill badge (guaranteed no overflow)
  const pillPadding = {
    sm: 'px-2.5 py-1 rounded-lg',
    md: 'px-3 py-1.5 rounded-xl',
    lg: 'px-4 py-2 rounded-xl',
    xl: 'px-5 py-3 rounded-2xl',
    '2xl': 'px-7 py-4 rounded-3xl'
  };

  const skTextSize = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl'
  };

  const brandTextSize = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl'
  };

  const taglineSize = {
    sm: 'text-[7px] tracking-[0.16em]',
    md: 'text-[8px] tracking-[0.18em]',
    lg: 'text-[10px] tracking-[0.22em]',
    xl: 'text-xs tracking-[0.25em]',
    '2xl': 'text-sm tracking-[0.28em]'
  };

  const isDark = light;
  const bgClass = isDark
    ? 'bg-[#14213D] border border-[#F2B705]/60 shadow-md'
    : 'bg-[#F2B705] border border-[#14213D]/20 shadow-sm hover:shadow-md';

  const textColor = isDark ? 'text-[#F2B705]' : 'text-[#14213D]';
  const tagColor = isDark ? 'text-white/90' : 'text-[#14213D]/90';

  return (
    <div
      className={`inline-flex flex-col items-center justify-center transition-all duration-200 select-none shrink-0 ${bgClass} ${pillPadding[size]} ${className}`}
    >
      <div className={`flex items-baseline gap-1 leading-none ${textColor}`}>
        <span
          className={`font-serif italic font-black ${skTextSize[size]}`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          SK
        </span>
        <span
          className={`font-heading font-black ${brandTextSize[size]}`}
          style={{ fontFamily: "'Montserrat', 'Poppins', sans-serif" }}
        >
          Brand
        </span>
      </div>

      {showTagline && (
        <span
          className={`uppercase font-bold pt-0.5 ${taglineSize[size]} ${tagColor} text-center whitespace-nowrap`}
          style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
        >
          SAMI KHAN • BALOCHI COUTURE
        </span>
      )}
    </div>
  );
};


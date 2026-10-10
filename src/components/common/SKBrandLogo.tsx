import React from 'react';

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
  stacked = false,
  showTagline = true
}) => {
  const pillPadding = {
    sm: 'px-3 py-1.5 rounded-lg',
    md: 'px-4 py-2 rounded-xl',
    lg: 'px-5 py-2.5 rounded-2xl',
    xl: 'px-6 py-3.5 rounded-2xl',
    '2xl': 'px-8 py-4.5 rounded-3xl'
  };

  const skTextSize = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl'
  };

  const brandTextSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl'
  };

  const taglineSize = {
    sm: 'text-[8px] tracking-[0.2em]',
    md: 'text-[9px] tracking-[0.22em]',
    lg: 'text-[11px] tracking-[0.25em]',
    xl: 'text-xs tracking-[0.28em]',
    '2xl': 'text-sm tracking-[0.3em]'
  };

  // Header (light version): Yellow pill #F2B705 + navy text #14213D
  // Footer (dark version): Inverted: navy pill #14213D + gold text #F2B705
  const isDark = light; // when light=true (e.g. inside dark footer/hero), use the dark/inverted pill
  const bgClass = isDark
    ? 'bg-[#14213D] border-2 border-[#F2B705]/60 shadow-lg'
    : 'bg-[#F2B705] border-2 border-[#14213D]/10 shadow-md hover:shadow-lg';

  const textColor = isDark ? 'text-[#F2B705]' : 'text-[#14213D]';
  const tagColor = isDark ? 'text-white/90' : 'text-[#14213D]/90';

  return (
    <div
      className={`inline-flex flex-col items-center justify-center transition-all duration-300 select-none ${bgClass} ${pillPadding[size]} ${className}`}
      style={{
        borderRadius: size === 'sm' ? '12px' : size === 'md' ? '14px' : '16px'
      }}
    >
      {/* Main Logo Text: "SK" (bold brush/italic script style) + "Brand" (heavy geometric sans-serif) */}
      <div className={`flex items-baseline gap-1.5 leading-none ${textColor}`}>
        <span
          className={`font-serif italic font-black tracking-tighter ${skTextSize[size]}`}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            letterSpacing: '-0.04em',
            transform: 'skewX(-4deg)'
          }}
        >
          SK
        </span>
        <span
          className={`font-heading font-black tracking-tight ${brandTextSize[size]}`}
          style={{
            fontFamily: "'Montserrat', 'Poppins', sans-serif"
          }}
        >
          Brand
        </span>
      </div>

      {/* Small Letter-Spaced Tagline: SAMI KHAN • BALOCHI COUTURE */}
      {showTagline && (
        <span
          className={`uppercase font-bold pt-1 ${taglineSize[size]} ${tagColor} text-center whitespace-nowrap`}
          style={{
            fontFamily: "'Inter', 'Poppins', sans-serif"
          }}
        >
          SAMI KHAN • BALOCHI COUTURE
        </span>
      )}
    </div>
  );
};

import React from 'react';

interface ShayakLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  className?: string;
}

export const ShayakLogo: React.FC<ShayakLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: { w: 24, h: 28, text: 'text-xs', space: 'gap-1.5' },
    md: { w: 32, h: 38, text: 'text-sm font-bold tracking-widest', space: 'gap-2' },
    lg: { w: 48, h: 56, text: 'text-lg font-extrabold tracking-widest', space: 'gap-3' },
    xl: { w: 72, h: 84, text: 'text-2xl font-black tracking-widest', space: 'gap-4' },
    hero: { w: 110, h: 130, text: 'text-4xl font-black tracking-[0.25em]', space: 'gap-6' },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className={`flex flex-col items-center ${iconDimensions.space}`}>
        {/* Exact SHAYAK Geometric S+H Monogram SVG */}
        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_4px_12px_rgba(0,255,102,0.25)] transition-transform duration-300 hover:scale-105"
        >
          {/* S Ribbon Outer Hexagonal Loop - Bright Emerald Green */}
          <path
            d="M 50 5 L 90 28 L 90 50 L 50 28 L 22 44 L 22 68 L 50 84 L 78 68 L 78 52 L 94 61 L 94 78 L 50 105 L 6 78 L 6 38 Z"
            fill="url(#emeraldGradient)"
          />
          {/* Inner Shadow / Facet overlay for S depth */}
          <path
            d="M 50 5 L 90 28 L 50 28 L 22 44 L 6 38 Z"
            fill="#00CC52"
            opacity="0.85"
          />
          <path
            d="M 50 84 L 78 68 L 78 52 L 94 61 L 50 105 Z"
            fill="#00993D"
            opacity="0.9"
          />

          {/* H Monogram Overlaid - Pure Crisp White Geometric Interlock */}
          <path
            d="M 42 22 L 76 42 L 76 82 L 60 72 L 60 52 L 42 42 Z"
            fill="#FFFFFF"
          />
          <path
            d="M 42 42 L 60 52 L 60 92 L 42 82 Z"
            fill="#E2E8F0"
          />

          {/* Emerald Gradient Definition */}
          <defs>
            <linearGradient id="emeraldGradient" x1="6" y1="5" x2="94" y2="105" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FF66" />
              <stop offset="0.5" stopColor="#00E5FF" />
              <stop offset="1" stopColor="#00B341" />
            </linearGradient>
          </defs>
        </svg>

        {/* SHAYAK Typography & Accent Line */}
        {showText && (
          <div className="flex flex-col items-center">
            <span className={`${iconDimensions.text} uppercase font-mono tracking-[0.2em] text-current`}>
              SHAYAK
            </span>
            <div className="w-8 h-[3px] bg-gradient-to-r from-[#00FF66] to-[#00E5FF] rounded-full mt-1 shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  subtitle = 'Smart Finance for India',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm font-extrabold',
    md: 'text-lg font-black',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black'
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Custom Geometric Fintech Monogram SVG */}
      <div className={`${iconSizes[size]} relative shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs transition-transform duration-200"
        >
          {/* Rounded Modern Squircle Background */}
          <rect width="48" height="48" rx="12" fill="url(#monetra_bg_grad)" />
          
          {/* Subtle Inner Glow Border */}
          <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="11.25" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />

          {/* Stylized Interconnected 'M' with Ascending Growth Peak */}
          <path
            d="M12 34V16L20 25.5L24 20L28 25.5L36 16V34"
            stroke="white"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Upward Apex Wealth Node */}
          <circle cx="24" cy="13.5" r="2.75" fill="#F59E0B" />

          {/* Gradients */}
          <defs>
            <linearGradient id="monetra_bg_grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3F6863" />
              <stop offset="1" stopColor="#1E3E3A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col justify-center text-left">
          <span className={`${textSizes[size]} text-charcoal tracking-tight leading-none`}>
            Monetra
          </span>
          {subtitle && (
            <span className={`${subSizes[size]} font-medium text-charcoal-muted tracking-tight mt-1 leading-none`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

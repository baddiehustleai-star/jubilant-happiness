// src/components/branding/BrandTypography.jsx
import React from 'react';

// Brand Heading Components
export const BrandHeading = ({ 
  level = 1, 
  children, 
  variant = 'default',
  className = '',
  gradient = false,
  ...props 
}) => {
  const Tag = `h${level}`;
  
  const baseClasses = "font-brand";
  
  const levelClasses = {
    1: 'text-5xl md:text-6xl lg:text-7xl font-bold leading-tight',
    2: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
    3: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight',
    4: 'text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight',
    5: 'text-xl md:text-2xl lg:text-3xl font-semibold leading-tight',
    6: 'text-lg md:text-xl lg:text-2xl font-semibold leading-tight'
  };
  
  const variantClasses = {
    default: 'text-dark',
    primary: 'text-rose-700',
    gold: 'text-gold-600',
    white: 'text-white',
    light: 'text-gray-600'
  };
  
  const gradientClasses = gradient ? 'bg-brand-gradient bg-clip-text text-transparent' : '';
  
  return (
    <Tag 
      className={`${baseClasses} ${levelClasses[level]} ${gradient ? gradientClasses : variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

// Brand Text Components
export const BrandText = ({ 
  children, 
  size = 'default',
  variant = 'default',
  weight = 'normal',
  className = '',
  ...props 
}) => {
  const baseClasses = "font-sans";
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };
  
  const variantClasses = {
    default: 'text-dark',
    primary: 'text-rose-600',
    secondary: 'text-gray-600',
    light: 'text-gray-500',
    white: 'text-white',
    gold: 'text-gold-600'
  };
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };
  
  return (
    <p 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${weightClasses[weight]} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

// Brand Link Components
export const BrandLink = ({ 
  children, 
  variant = 'default',
  underline = 'hover',
  className = '',
  ...props 
}) => {
  const baseClasses = "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 rounded";
  
  const variantClasses = {
    default: 'text-rose-600 hover:text-rose-700',
    gold: 'text-gold-600 hover:text-gold-700',
    white: 'text-white hover:text-rose-200',
    dark: 'text-dark hover:text-rose-600',
    gradient: 'bg-brand-gradient bg-clip-text text-transparent hover:opacity-80'
  };
  
  const underlineClasses = {
    none: '',
    always: 'underline',
    hover: 'hover:underline'
  };
  
  return (
    <a 
      className={`${baseClasses} ${variantClasses[variant]} ${underlineClasses[underline]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};

// Brand Quote Components
export const BrandQuote = ({ 
  children, 
  author,
  role,
  variant = 'default',
  className = '' 
}) => {
  const variantClasses = {
    default: 'border-l-4 border-rose-500 bg-rose-50',
    gold: 'border-l-4 border-gold-500 bg-gold-50',
    minimal: 'border-l-2 border-gray-300 bg-gray-50'
  };
  
  return (
    <blockquote className={`pl-6 py-4 ${variantClasses[variant]} ${className}`}>
      <BrandText className="italic text-lg mb-3">
        "{children}"
      </BrandText>
      {author && (
        <footer>
          <BrandText weight="semibold" className="mb-1">
            — {author}
          </BrandText>
          {role && (
            <BrandText size="sm" variant="secondary">
              {role}
            </BrandText>
          )}
        </footer>
      )}
    </blockquote>
  );
};

// Brand List Components
export const BrandList = ({ 
  children, 
  variant = 'default',
  spacing = 'default',
  className = '' 
}) => {
  const baseClasses = "space-y-2";
  
  const spacingClasses = {
    tight: 'space-y-1',
    default: 'space-y-2',
    loose: 'space-y-4'
  };
  
  const variantClasses = {
    default: '[&>li]:flex [&>li]:items-start [&>li]:space-x-3',
    simple: '',
    checkmark: '[&>li]:flex [&>li]:items-start [&>li]:space-x-3 [&>li::before]:content-["✓"] [&>li::before]:text-green-500 [&>li::before]:font-bold [&>li::before]:mr-2',
    bullet: '[&>li]:flex [&>li]:items-start [&>li]:space-x-3 [&>li::before]:content-["•"] [&>li::before]:text-rose-500 [&>li::before]:font-bold [&>li::before]:mr-2'
  };
  
  return (
    <ul className={`${baseClasses} ${spacingClasses[spacing]} ${variantClasses[variant]} ${className}`}>
      {children}
    </ul>
  );
};

export const BrandListItem = ({ children, className = '' }) => {
  return (
    <li className={className}>
      <BrandText>{children}</BrandText>
    </li>
  );
};
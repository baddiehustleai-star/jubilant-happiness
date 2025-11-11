// src/components/branding/Logo.jsx
import React from 'react';

export const Logo = ({ size = 'default', variant = 'default', className = '' }) => {
  const sizeClasses = {
    xs: 'text-lg',
    sm: 'text-xl',
    default: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
  };

  const variantClasses = {
    default: 'text-rose-dark',
    white: 'text-white',
    gradient: 'text-brand-gradient',
    gold: 'text-gold-700',
  };

  return (
    <h1
      className={`font-diamond font-bold tracking-wide ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      PHOTO2PROFIT
    </h1>
  );
};

export const LogoWithIcon = ({ size = 'default', variant = 'default', className = '' }) => {
  const iconSizes = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    default: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className={`${iconSizes[size]} bg-brand-gradient rounded-lg flex items-center justify-center shadow-brand`}
      >
        <span className="text-white font-bold text-xs">P2P</span>
      </div>
      <Logo size={size} variant={variant} />
    </div>
  );
};

export const LogoMark = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    default: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-brand-gradient rounded-xl flex items-center justify-center shadow-brand-lg ${className}`}
    >
      <span className="font-diamond font-bold text-white">P2P</span>
    </div>
  );
};

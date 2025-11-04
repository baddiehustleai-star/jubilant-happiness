// src/components/branding/BrandElements.jsx
import React from 'react';

// Brand Button Components
export const BrandButton = ({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-4";
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const variantClasses = {
    primary: 'bg-brand-gradient text-white shadow-brand hover:scale-105 hover:shadow-brand-lg focus:ring-rose-200',
    secondary: 'bg-white text-rose-600 border-2 border-rose-500 hover:bg-rose-50 hover:scale-105 focus:ring-rose-200',
    gold: 'bg-gold-gradient text-white shadow-gold hover:scale-105 hover:shadow-gold-lg focus:ring-gold-200',
    outline: 'border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white hover:scale-105 focus:ring-rose-200',
    ghost: 'text-rose-600 hover:bg-rose-50 hover:text-rose-700',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 focus:ring-red-200'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed transform-none' : '';
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Brand Card Components
export const BrandCard = ({ 
  children, 
  variant = 'default', 
  padding = 'default',
  hover = false,
  className = '' 
}) => {
  const baseClasses = "rounded-2xl overflow-hidden";
  
  const variantClasses = {
    default: 'bg-white shadow-lg border border-rose-100',
    luxury: 'bg-luxury-gradient shadow-brand-xl border border-gold-200',
    glass: 'bg-white/80 backdrop-blur-lg border border-rose-200/50',
    minimal: 'bg-white border border-gray-200'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const hoverClasses = hover ? 'card-hover' : '';
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

// Brand Badge Components
export const BrandBadge = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '' 
}) => {
  const baseClasses = "inline-flex items-center rounded-full font-medium";
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const variantClasses = {
    primary: 'bg-rose-100 text-rose-700',
    gold: 'bg-gold-100 text-gold-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    gradient: 'bg-brand-gradient text-white'
  };
  
  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Brand Input Components
export const BrandInput = ({ 
  label, 
  error, 
  helper,
  className = '',
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <input 
        className={`input-brand ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-600">{helper}</p>
      )}
    </div>
  );
};

// Brand Loading Components
export const BrandSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-b-2 border-rose-500"></div>
    </div>
  );
};

// Brand Container Components
export const BrandContainer = ({ 
  children, 
  size = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    lg: 'max-w-none',
    fluid: 'w-full'
  };
  
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

// Brand Section Components
export const BrandSection = ({ 
  children, 
  background = 'default',
  padding = 'default',
  className = '' 
}) => {
  const backgroundClasses = {
    default: 'bg-blush',
    white: 'bg-white',
    rose: 'bg-rose-50',
    gold: 'bg-gold-50',
    gradient: 'bg-luxury-gradient',
    cream: 'bg-cream'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    default: 'py-16',
    lg: 'py-24',
    xl: 'py-32'
  };
  
  return (
    <section className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </section>
  );
};
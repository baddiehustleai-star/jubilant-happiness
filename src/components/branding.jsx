import React from 'react';

// Logo Component
export function Logo({ size = 'md', variant = 'default', className = '' }) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  const variantClasses = {
    default: 'text-rose-600',
    white: 'text-white',
    dark: 'text-gray-900',
    gradient: 'bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent',
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      Photo2Profit
    </div>
  );
}

// Brand Container
export function BrandContainer({ children, size = 'full', className = '' }) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Brand Section
export function BrandSection({ children, background = 'white', padding = 'md', className = '' }) {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700',
    'luxury-gradient': 'bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700',
  };

  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  return (
    <section className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </section>
  );
}

// Brand Heading
export function BrandHeading({
  children,
  level = 1,
  variant = 'default',
  gradient = false,
  className = '',
}) {
  const variantClasses = {
    default: 'text-gray-900',
    white: 'text-white',
    dark: 'text-gray-900',
    muted: 'text-gray-600',
  };

  const gradientClass = gradient
    ? 'bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent'
    : '';

  const Component = `h${level}`;
  const sizeClasses = {
    1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    2: 'text-3xl md:text-4xl font-bold',
    3: 'text-2xl md:text-3xl font-semibold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-medium',
    6: 'text-base md:text-lg font-medium',
  };

  return React.createElement(
    Component,
    {
      className: `${sizeClasses[level]} ${gradient ? gradientClass : variantClasses[variant]} ${className}`,
    },
    children
  );
}

// Brand Text
export function BrandText({ children, size = 'md', variant = 'default', className = '' }) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const variantClasses = {
    default: 'text-gray-600',
    white: 'text-white',
    dark: 'text-gray-900',
    muted: 'text-gray-500',
    light: 'text-gray-300',
  };

  return (
    <p className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>{children}</p>
  );
}

// Brand Button
export function BrandButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:from-rose-600 hover:to-purple-700 focus:ring-rose-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline:
      'border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:ring-rose-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    white: 'bg-white text-rose-600 hover:bg-gray-50 focus:ring-rose-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// Brand Card
export function BrandCard({ children, variant = 'default', padding = 'md', className = '' }) {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg border border-gray-200',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl',
    dark: 'bg-gray-800 border border-gray-700 shadow-sm',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div
      className={`rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

// Brand Input
export function BrandInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors ${className}`}
      />
    </div>
  );
}

// Brand Badge
export function BrandBadge({ children, variant = 'default', size = 'md', className = '' }) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-rose-100 text-rose-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

// Brand Navigation
export function BrandNavigation({ actions = [] }) {
  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <BrandContainer>
        <div className="flex justify-between items-center py-4">
          <Logo variant="white" size="md" />

          <div className="flex space-x-4">
            {actions.map((action, index) => (
              <BrandButton
                key={index}
                variant={action.variant || 'ghost'}
                size="sm"
                onClick={action.onClick}
                className="text-white hover:bg-white/10"
              >
                {action.label}
              </BrandButton>
            ))}
          </div>
        </div>
      </BrandContainer>
    </nav>
  );
}

// Brand Footer
export function BrandFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <BrandContainer>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Logo variant="white" size="lg" className="mb-4" />
              <BrandText variant="light" className="max-w-md">
                Transform your thrift finds into profitable reselling opportunities with AI-powered
                insights.
              </BrandText>
            </div>

            <div>
              <BrandHeading level={5} variant="white" className="mb-4">
                Features
              </BrandHeading>
              <ul className="space-y-2">
                <li>
                  <BrandText variant="light" size="sm">
                    AI Price Analysis
                  </BrandText>
                </li>
                <li>
                  <BrandText variant="light" size="sm">
                    Market Research
                  </BrandText>
                </li>
                <li>
                  <BrandText variant="light" size="sm">
                    Profit Calculator
                  </BrandText>
                </li>
                <li>
                  <BrandText variant="light" size="sm">
                    Listing Optimization
                  </BrandText>
                </li>
              </ul>
            </div>

            <div>
              <BrandHeading level={5} variant="white" className="mb-4">
                Company
              </BrandHeading>
              <ul className="space-y-2">
                <li>
                  <BrandText variant="light" size="sm">
                    About Us
                  </BrandText>
                </li>
                <li>
                  <BrandText variant="light" size="sm">
                    Contact
                  </BrandText>
                </li>
                <li>
                  <BrandText variant="light" size="sm">
                    Privacy Policy
                  </BrandText>
                </li>
                <li>
                  <BrandText variant="light" size="sm">
                    Terms of Service
                  </BrandText>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <BrandText variant="light" size="sm">
              © 2024 Photo2Profit. All rights reserved.
            </BrandText>
          </div>
        </div>
      </BrandContainer>
    </footer>
  );
}

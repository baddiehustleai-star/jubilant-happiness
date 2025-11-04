// src/components/branding/BrandNavigation.jsx
import React, { useState } from 'react';
import { BrandButton } from './BrandElements';
import { Logo, LogoMark } from './Logo';

// Brand Navigation Header
export const BrandNavigation = ({ 
  logo = true,
  navigation = [],
  actions = [],
  variant = 'default',
  fixed = false,
  className = ''
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const baseClasses = "w-full transition-all duration-300";
  const variantClasses = {
    default: 'bg-white/95 backdrop-blur-lg border-b border-rose-100 shadow-sm',
    transparent: 'bg-transparent',
    solid: 'bg-white border-b border-rose-100 shadow-sm',
    dark: 'bg-dark/95 backdrop-blur-lg border-b border-rose-800'
  };
  
  const fixedClasses = fixed ? 'fixed top-0 left-0 right-0 z-50' : '';
  
  return (
    <nav className={`${baseClasses} ${variantClasses[variant]} ${fixedClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0">
              <div className="block lg:hidden">
                <LogoMark size="sm" />
              </div>
              <div className="hidden lg:block">
                <Logo size="sm" />
              </div>
            </div>
          )}
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-dark hover:text-rose-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {actions.map((action, index) => (
              <BrandButton
                key={index}
                variant={action.variant || 'primary'}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </BrandButton>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark hover:text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-dark hover:text-rose-600 hover:bg-rose-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                {actions.map((action, index) => (
                  <BrandButton
                    key={index}
                    variant={action.variant || 'primary'}
                    size="sm"
                    className="w-full"
                    onClick={action.onClick}
                  >
                    {action.label}
                  </BrandButton>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Brand Footer
export const BrandFooter = ({ 
  logo = true,
  links = [],
  social = [],
  copyright,
  className = ''
}) => {
  return (
    <footer className={`bg-dark text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          {logo && (
            <div className="md:col-span-2">
              <Logo variant="white" size="sm" className="mb-4" />
              <p className="text-gray-300 max-w-md">
                Transform your photos into profitable listings with AI-powered optimization and cross-platform posting.
              </p>
            </div>
          )}
          
          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {links.map((section, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm">
            {copyright || `© ${new Date().getFullYear()} Photo2Profit. All rights reserved.`}
          </div>
          
          {/* Social Links */}
          {social.length > 0 && (
            <div className="flex space-x-4 mt-4 md:mt-0">
              {social.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

// Brand Breadcrumb
export const BrandBreadcrumb = ({ 
  items = [],
  className = ''
}) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-gray-500 hover:text-rose-600 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ) : (
              <span className="text-rose-600 text-sm font-medium">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
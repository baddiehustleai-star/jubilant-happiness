import React from 'react';

const Loading = ({ message = 'Loading...', size = 'large' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        {/* Outer spinning ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-blush/20 border-t-rose rounded-full animate-spin`}
        ></div>

        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-gradient-to-r from-rose to-gold rounded-full animate-pulse"></div>
        </div>
      </div>

      <p className="text-dark/60 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

// Full screen loading overlay
export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl border border-rose/10 p-8">
        <Loading message={message} />
      </div>
    </div>
  );
};

// Inline loading spinner
export const LoadingSpinner = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-current border-t-transparent rounded-full animate-spin ${className}`}
    ></div>
  );
};

export default Loading;

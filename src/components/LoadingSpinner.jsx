import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-blush flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Rose-gold themed spinner */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-rose-light border-t-rose animate-spin"></div>
        </div>

        <p className="text-rose-dark font-diamond text-lg">Loading Photo2Profit...</p>
      </div>
    </div>
  );
}

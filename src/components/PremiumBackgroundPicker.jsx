import { useState } from 'react';

const BACKGROUNDS = [
  { name: 'White', url: '/backgrounds/white.jpg', color: '#FFFFFF' },
  { name: 'Pink', url: '/backgrounds/pink.jpg', color: '#FFE4E1' },
  { name: 'Granite', url: '/backgrounds/granite.jpg', color: '#8B8B8B' },
  { name: 'Marble', url: '/backgrounds/marble.jpg', color: '#F5F5F5' },
  { name: 'Studio Gray', url: '/backgrounds/studio-gray.jpg', color: '#D3D3D3' },
  { name: 'Textured Beige', url: '/backgrounds/beige.jpg', color: '#F5F5DC' },
];

export default function PremiumBackgroundPicker({ onSelect, currentBackground }) {
  const [selected, setSelected] = useState(currentBackground || null);

  const handleSelect = (bg) => {
    setSelected(bg.name);
    if (onSelect) {
      onSelect(bg.url);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl border border-rose-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">⭐ Premium Backgrounds</h2>
        <span className="text-xs text-rose-600 font-medium bg-rose-100 px-2 py-1 rounded-full">
          Premium Only
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Replace your product background with professional studio backdrops
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.name}
            className={`group relative p-1 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              selected === bg.name
                ? 'border-rose-500 shadow-lg ring-2 ring-rose-300'
                : 'border-gray-200 hover:border-rose-300'
            }`}
            onClick={() => handleSelect(bg)}
            title={`Select ${bg.name} background`}
          >
            {/* Preview with fallback color */}
            <div
              className="rounded-md w-full h-14 object-cover"
              style={{
                backgroundColor: bg.color,
                backgroundImage: `url(${bg.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Checkmark for selected */}
              {selected === bg.name && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-rose-500 rounded-full p-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Background name */}
            <div
              className={`text-xs mt-1 text-center font-medium transition-colors ${
                selected === bg.name ? 'text-rose-600' : 'text-gray-700 group-hover:text-rose-500'
              }`}
            >
              {bg.name}
            </div>
          </button>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded-lg">
        <svg
          className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          Click a background to instantly preview it on your product photo. Changes apply in
          real-time.
        </span>
      </div>
    </div>
  );
}

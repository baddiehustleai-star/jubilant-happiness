/* eslint-env node */
/* eslint-disable no-undef */
/** CommonJS tailwind config for compatibility (includes TS/TSX content and common plugins) */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        // Static fallback colors (Photo2Profit rose-gold theme)
        blush: '#F5E6D3',
        rose: {
          light: '#FCE9E9',
          DEFAULT: '#E8B4B8',
          dark: '#B76E79',
        },
        gold: {
          soft: '#FBE8C4',
          DEFAULT: '#D4A574',
        },
        dark: '#2D3748',

        // Dynamic CSS custom property colors for branding API
        'brand-primary': 'var(--color-primary, #E8B4B8)',
        'brand-secondary': 'var(--color-secondary, #F5E6D3)',
        'brand-accent': 'var(--color-accent, #D4A574)',
        'brand-dark': 'var(--color-dark, #2D3748)',
        'brand-light': 'var(--color-light, #FFFFFF)',
      },
      fontFamily: {
        diamond: ["'Playfair Display'", 'serif'],
        sans: ["'Inter'", 'sans-serif'],

        // Dynamic font families from branding API
        'brand-heading': 'var(--font-heading, "Playfair Display", serif)',
        'brand-body': 'var(--font-body, "Inter", sans-serif)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

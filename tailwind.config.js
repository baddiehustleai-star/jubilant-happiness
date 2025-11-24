/* eslint-env node */
/* eslint-disable no-undef */
/** CommonJS tailwind config for compatibility (includes TS/TSX content and common plugins) */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        // Static fallback colors (Photo2Profit peachy blush theme)
        blush: '#FFFBF8',
        rose: {
          light: '#F5EAE6',
          DEFAULT: '#E8C4B8',
          dark: '#D4A89E',
        },
        gold: {
          soft: '#FBE8C4',
          DEFAULT: '#F5C78E',
        },
        dark: '#6B4E4A',

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

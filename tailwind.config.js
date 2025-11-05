/* eslint-env node */
/* eslint-disable no-undef */
/** CommonJS tailwind config for compatibility (includes TS/TSX content and common plugins) */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        blush: '#FAF6F2',
        rose: {
          light: '#FCE9E9',
          DEFAULT: '#E6A4A4',
          dark: '#B76E79',
        },
        gold: {
          soft: '#FBE8C4',
          DEFAULT: '#F5C26B',
        },
        dark: '#3D2B2B',
      },
      fontFamily: {
        diamond: ["'Cinzel Decorative'", 'serif'],
        sans: ["'Montserrat'", 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

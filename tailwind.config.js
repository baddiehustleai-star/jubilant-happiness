export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
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
  plugins: [],
};

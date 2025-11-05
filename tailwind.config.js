export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Photo2Profit Brand Colors
        blush: '#FAF6F2',
        rose: {
          50: '#FDF4F4',
          100: '#FCE9E9',
          200: '#F8D1D1',
          300: '#F4B8B8',
          400: '#ED9090',
          500: '#E6A4A4', // Main brand rose
          600: '#D67979',
          700: '#B76E79', // Dark rose
          800: '#8A5259',
          900: '#5D383C',
          light: '#FCE9E9',
          DEFAULT: '#E6A4A4',
          dark: '#B76E79',
        },
        gold: {
          50: '#FEFCF3',
          100: '#FEF7E0',
          200: '#FCEFC0',
          300: '#FBE8C4', // Soft gold
          400: '#F8D882',
          500: '#F5C26B', // Main brand gold
          600: '#E8A93D',
          700: '#D18F1A',
          800: '#A16F0F',
          900: '#6B4A0A',
          soft: '#FBE8C4',
          DEFAULT: '#F5C26B',
          dark: '#D18F1A',
        },
        dark: '#3D2B2B',
        // Additional brand variations
        cream: '#F9F5F1',
        bronze: '#CD7F32',
        champagne: '#F7E7CE',
        // Status colors that match brand
        success: '#4ADE80',
        warning: '#F5C26B', // Using brand gold
        error: '#EF4444',
        info: '#E6A4A4', // Using brand rose
      },
      fontFamily: {
        diamond: ["'Cinzel Decorative'", 'serif'],
        sans: ["'Montserrat'", 'sans-serif'],
        display: ["'Cinzel Decorative'", 'serif'],
        body: ["'Montserrat'", 'sans-serif'],
      },
      fontSize: {
        'brand-xs': ['0.75rem', { lineHeight: '1rem' }],
        'brand-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'brand-base': ['1rem', { lineHeight: '1.5rem' }],
        'brand-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'brand-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'brand-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'brand-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'brand-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        'brand-5xl': ['3rem', { lineHeight: '1' }],
        'brand-6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      boxShadow: {
        brand: '0 4px 15px rgba(183, 110, 121, 0.4)',
        'brand-lg': '0 6px 20px rgba(183, 110, 121, 0.5)',
        'brand-xl': '0 10px 30px rgba(183, 110, 121, 0.3)',
        gold: '0 4px 15px rgba(245, 194, 107, 0.4)',
        'gold-lg': '0 6px 20px rgba(245, 194, 107, 0.5)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #E6A4A4, #F5C26B)',
        'brand-gradient-r': 'linear-gradient(270deg, #E6A4A4, #F5C26B)',
        'brand-gradient-vertical': 'linear-gradient(180deg, #E6A4A4, #F5C26B)',
        'rose-gradient': 'linear-gradient(90deg, #FCE9E9, #E6A4A4)',
        'gold-gradient': 'linear-gradient(90deg, #FBE8C4, #F5C26B)',
        'luxury-gradient':
          'linear-gradient(135deg, #FCE9E9 0%, #E6A4A4 25%, #F5C26B 75%, #FBE8C4 100%)',
      },
      animation: {
        'brand-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'brand-bounce': 'bounce 1s infinite',
        'brand-float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        diamond: ['"Cinzel Decorative"', 'serif'], // Diamond-style font
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        // ✨ Core Luxe Palette
        rosegold: {
          DEFAULT: '#B76E79', // Metallic Rose Gold
          light: '#E9CBA7',   // Champagne highlight
          dark: '#8C4F58',    // Deep rose tone
        },
        blush: {
          DEFAULT: '#F8E0E7', // Soft blush pink
          light: '#FFF5F8',
        },
        diamond: '#E0E0E0',     // Silver sparkle accent
        money: '#8DD3B1',       // Profit highlight green
        softwhite: '#FFF9F9',   // Background white
        
        // Enhanced brand colors for compatibility
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        cream: '#FEF7CD',
        dark: '#1F2937',
      },
      backgroundImage: {
        // 💎 Metallic gradient backgrounds
        'luxe-gradient': 'linear-gradient(135deg, #F8E0E7 0%, #B76E79 45%, #E9CBA7 100%)',
        'diamond-glow': 'radial-gradient(circle at 30% 30%, #FFF5F8 0%, #F8E0E7 50%, #B76E79 100%)',
        // Additional gradients for compatibility
        'brand-gradient': 'linear-gradient(135deg, #E11D48 0%, #F59E0B 100%)',
        'luxury-gradient': 'linear-gradient(135deg, #FDF2F4 0%, #FCE7EA 25%, #F9D1D8 50%, #F4A5B3 75%, #ED7287 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 100%)',
      },
      boxShadow: {
        'soft-glow': '0 4px 10px rgba(183, 110, 121, 0.3)',
        'inner-glow': 'inset 0 0 8px rgba(233, 203, 167, 0.4)',
        // Additional shadows for compatibility
        'brand': '0 4px 14px 0 rgba(225, 29, 72, 0.25)',
        'brand-lg': '0 10px 25px -3px rgba(225, 29, 72, 0.3)',
        'brand-xl': '0 25px 50px -12px rgba(225, 29, 72, 0.4)',
        'gold': '0 4px 14px 0 rgba(245, 158, 11, 0.25)',
        'gold-lg': '0 10px 25px -3px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

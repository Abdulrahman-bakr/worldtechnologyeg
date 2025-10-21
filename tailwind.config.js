/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Handles .dark class on html for Tailwind's dark variants
  theme: {
    extend: {
      colors: {
        primary: '#10B981', // Emerald-500
        'primary-hover': '#059669', // Emerald-600
        secondary: '#3B82F6', // Blue-500
        'secondary-hover': '#2563EB', // Blue-600
        light: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          900: '#1F2937',
          750: '#ffffffb2',
        },
        dark: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          650: '#e47c0d',
          750: '#ffffffb2',
        },
        orange: {
          100: '#FFEDD5',
          300: '#FDBA74',
          700: '#C2410C',
          750: '#ffffffb2',
        },
        skeleton: '#E5E7EB'
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out forwards',
        'subtle-pulse': 'subtlePulse 2s infinite ease-in-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-out-right': 'slideOutRight 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-out': 'fadeOut 0.3s ease-out forwards',
        'fade-out-up': 'fadeOutUp 0.3s ease-out forwards',
        'badge-pulse': 'badgePulse 1.8s infinite ease-in-out',
        'toast-in': 'toastIn 0.3s ease-out forwards',
        'toast-out': 'toastOut 0.3s ease-in forwards',
        'cart-shake': 'cartShake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0.9' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeOutUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        badgePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
        },
        toastIn: {
            '0%': { opacity: 0, transform: 'translateY(20px) scale(0.9)' },
            '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
            '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
            '100%': { opacity: 0, transform: 'translateY(20px) scale(0.9)' },
        },
        cartShake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      }
    }
  },
  plugins: [],
}
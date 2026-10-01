/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d5ff',
          300: '#a3b8ff',
          400: '#7690fb',
          500: '#4f6ef5',
          600: '#3d57e0',
          700: '#3244b8',
          800: '#2b3a94',
          900: '#283475',
        },
        surface: {
          rail: '#eef1fb',
          panel: '#f7f8fd',
          main: '#f4f6fc',
          card: '#ffffff',
        },
        online: '#3fd67e',
        missed: '#f04f5c',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(43, 58, 148, 0.15)',
        modal: '0 24px 60px -12px rgba(20, 24, 60, 0.35)',
      },
    },
  },
  plugins: [],
}

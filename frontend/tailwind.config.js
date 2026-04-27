/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f5f7fb',
          100: '#e8edf5',
          200: '#cbd6e6',
          300: '#9fb1ca',
          400: '#6d87a7',
          500: '#4b6685',
          600: '#38506a',
          700: '#2b3c50',
          800: '#1b2535',
          900: '#0f1624',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(148, 163, 184, 0.12), 0 24px 60px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'portal-gradient': 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.04) 35%, rgba(15, 23, 42, 0.96) 100%)',
      },
    },
  },
  plugins: [],
};

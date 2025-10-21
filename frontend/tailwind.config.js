/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#8B5CF6',
          400: '#A78BFA',
          300: '#C4B5FD',
        },
        pink: {
          500: '#EC4899',
        },
        green: {
          500: '#10B981',
        },
        slate: {
          900: '#111827',
          800: '#1F2937',
        },
      },
    },
  },
  plugins: [],
};

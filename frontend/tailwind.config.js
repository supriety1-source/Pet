/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Supriety brand colors
        primary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          lighter: '#C4B5FD',
        },
        accent: {
          pink: '#EC4899',
          green: '#10B981',
        },
        dark: {
          DEFAULT: '#1F2937',
          darker: '#111827',
        },
        light: {
          DEFAULT: '#F9FAFB',
          white: '#FFFFFF',
        },
        gray: {
          dark: '#374151',
          medium: '#6B7280',
          light: '#9CA3AF',
        }
      },
    },
  },
  plugins: [],
}

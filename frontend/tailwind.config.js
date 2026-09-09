/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF0F5',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FCA5A5',
          400: '#F9A8C9',
          500: '#E879A0',
          600: '#D85D8B',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        brand: {
          bg: '#FFFFFF',
          softBg: '#FFF5F8',
          card: '#FFFFFF',
          border: '#F3E2EA',
          text: '#1A1A2E',
          subtext: '#64748B',
          pink: '#E879A0',
          darkPink: '#C04870'
        }
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}

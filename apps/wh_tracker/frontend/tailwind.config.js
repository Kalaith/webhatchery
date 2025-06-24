/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9fa',
          100: '#d9eff1',
          200: '#b6dfe4',
          300: '#84c9d1',
          400: '#4badbb',
          500: '#32808d',
          600: '#2b6d77',
          700: '#275a63',
          800: '#264a52',
          900: '#233e46',
          950: '#13262e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

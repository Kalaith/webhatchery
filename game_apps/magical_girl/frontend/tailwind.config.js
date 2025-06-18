/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        magical: {
          50: '#fef7ff',
          100: '#feeeff',
          200: '#fedcff',
          300: '#fdb9ff',
          400: '#fa86ff',
          500: '#f253ff',
          600: '#e931ff',
          700: '#d018e7',
          800: '#ab15bb',
          900: '#8c1497',
        },
        sparkle: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      fontFamily: {
        'magical': ['Quicksand', 'sans-serif'],
        'display': ['Comfortaa', 'cursive'],
      },
      animation: {
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'magical': 'magical 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.8' },
        },
        magical: {
          '0%': { transform: 'translateY(0px)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'translateY(-10px)', filter: 'hue-rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #f253ff, 0 0 10px #f253ff, 0 0 15px #f253ff' },
          '100%': { boxShadow: '0 0 10px #f253ff, 0 0 20px #f253ff, 0 0 30px #f253ff' },
        },
      },
      backgroundImage: {
        'magical-gradient': 'linear-gradient(135deg, #feeeff 0%, #fedcff 50%, #fdb9ff 100%)',
        'sparkle-gradient': 'linear-gradient(45deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%)',
      }
    },
  },
  plugins: [],
}

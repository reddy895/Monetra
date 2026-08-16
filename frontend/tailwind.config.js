/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F6F3',
        surface: '#FFFFFF',
        border: '#E8E4E0',
        charcoal: {
          DEFAULT: '#2C2C2C',
          muted: '#5A5A5A',
          light: '#8E8E8E'
        },
        slate: {
          warm: '#4A4A4A',
          light: '#6E6E6E',
          subtle: '#F0EEEA'
        },
        teal: {
          muted: '#5B7F7A',
          hover: '#4A6B66',
          subtle: '#EDF3F2',
          light: '#E1EBEA'
        },
        amber: {
          soft: '#D4A373',
          hover: '#C28F5E',
          subtle: '#FAF4ED'
        },
        success: {
          DEFAULT: '#7D9B7A',
          subtle: '#F0F5F0',
          dark: '#587355'
        },
        warning: {
          DEFAULT: '#D4A373',
          subtle: '#FAF4ED',
          dark: '#B07E4C'
        },
        danger: {
          DEFAULT: '#C47A7A',
          subtle: '#FBF1F1',
          dark: '#9E5252'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        subtle: '0 2px 8px rgba(0, 0, 0, 0.04)'
      },
      borderRadius: {
        card: '8px'
      }
    },
  },
  plugins: [],
}

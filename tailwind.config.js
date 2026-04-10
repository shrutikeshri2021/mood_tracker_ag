/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-blush': '#F6C4DA',
        'pink-mist': '#FBE7F1',
        'aqua': '#BEF1EC',
        'sky': '#B7DEFF',
        'lavender': '#C8B8F5',
        'peach': '#F7C8BD',
        'cream': '#FFF9FC',
        'accent-mint': '#64D7BE',
        'accent-coral': '#FF8EA6',
        'accent-lilac': '#9C7CF3',
        'accent-sky': '#67B9FF',
        'text-primary': '#261A3C',
        'text-secondary': '#5C4D76',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#246CA0',
          orange: '#F89D42',
          red: '#E74930',
          green: '#056D41',
          purple: '#903B91',
        }
      }
    },
  },
  plugins: [],
}
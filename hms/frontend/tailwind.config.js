/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Sets Inter as the default sans-serif font
      },
      // You might need to extend colors if you have custom shades
      colors: {
        rose: { // Ensure 'rose' color is defined if not in default Tailwind palette
          500: '#f43f5e',
          600: '#e11d48',
        },
        fuchsia: { // Ensure 'fuchsia' color is defined
          500: '#d946ef',
          600: '#c026d3',
        },
        amber: { // Ensure 'amber' color is defined
          500: '#f59e0b',
          600: '#d97706',
        },
        lime: { // Ensure 'lime' color is defined
          500: '#84cc16',
          600: '#65a30d',
        },
        cyan: { // Ensure 'cyan' color is defined
          500: '#06b6d4',
          600: '#0891b2',
        },
      }
    },
  },
  plugins: [],
}
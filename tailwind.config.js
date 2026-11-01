/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        autism: {
          blue: '#1e40af',
          sky: '#38bdf8',
          calm: '#e0f2fe',
          mint: '#10b981',
          softamber: '#f59e0b',
          lavender: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

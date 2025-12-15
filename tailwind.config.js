/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e23e44',     // Main button red
          redHover: '#c13238',// Darker red for hover states
          dark: '#333538',    // Page background grey
          card: '#111111',    // Input container background
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Professional clean font
      }
    },
  },
  plugins: [],
}
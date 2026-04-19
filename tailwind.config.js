/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
      },
      colors: {
        navy: {
          800: '#0a1628',
          700: '#162040',
          600: '#1e3a5f',
          500: '#2563a8',
        },
        brand: '#f97316',
      }
    },
  },
  plugins: [],
}
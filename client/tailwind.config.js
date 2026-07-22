/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enabling support for dark mode toggle
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae2fd',
          300: '#7cc8fc',
          400: '#38abf8',
          500: '#0e91eb',
          600: '#0273ca',
          700: '#035ca4',
          800: '#074f87',
          900: '#0c4270',
          950: '#082a4a',
        },
        accent: {
          50: '#fffcf0',
          100: '#fef7db',
          200: '#fdedaf',
          300: '#fbdb75',
          400: '#f9c33d',
          500: '#f6a715',
          600: '#da840b',
          700: '#b55f0b',
          800: '#924a0e',
          900: '#783e10',
          950: '#462005',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

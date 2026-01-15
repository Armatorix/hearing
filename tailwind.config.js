/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebefff',
          200: '#d6dfff',
          300: '#b8c7ff',
          400: '#99aeff',
          500: '#667eea',
          600: '#5568d3',
          700: '#4451b8',
          800: '#343b9c',
          900: '#252681',
        },
        secondary: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f6d1d7',
          300: '#f1bac3',
          400: '#eca3af',
          500: '#764ba2',
          600: '#5f3c82',
          700: '#482d62',
          800: '#311e42',
          900: '#1a0f22',
        },
      },
    },
  },
  plugins: [],
};

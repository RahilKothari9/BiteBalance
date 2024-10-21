// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#333333', // Dark gray for text
        },
        secondary: {
          DEFAULT: '#666666', // Lighter gray for secondary text
        },
        accent: {
          DEFAULT: '#4CAF50', // Green color from the logo
        },
        background: {
          DEFAULT: '#F5F5F5', // Light gray background
        },
      },
    },
    fontFamily: {
      'sans': ['Mulish', 'sans-serif'],
      'body': ['Mulish', 'sans-serif'],
    },
  },
  plugins: [],
};
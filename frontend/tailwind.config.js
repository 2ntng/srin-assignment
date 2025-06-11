/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-from-bottom-4': 'slide-in-from-bottom-4 0.2s ease-out',
      }
    },
  },
  plugins: [],
}

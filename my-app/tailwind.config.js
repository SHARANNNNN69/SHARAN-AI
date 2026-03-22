/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // THIS LINE IS THE KEY
  ],
  theme: {
    extend: {
      // If you want custom "Stark" colors, add them here
      colors: {
        chatBg: '#0f172a',
        sidebarBg: '#1e293b',
      }
    },
  },
  plugins: [],
}
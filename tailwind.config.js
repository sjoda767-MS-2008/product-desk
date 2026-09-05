/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // لدعم الوضع الليلي مستقبلاً بناءً على Class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'Inter', 'sans-serif'], // خطوط تناسب العربية والإنجليزية
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
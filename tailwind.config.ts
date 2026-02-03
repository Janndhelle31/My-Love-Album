// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'romantic-cream': '#FFFBF0',
        'love-pink': '#FF85A1',
        'soft-rose': '#FCE4EC',
      },
      fontFamily: {
        serif: ['var(--font-playfair)'], // We will set this up next
        handwriting: ['var(--font-caveat)'],
      },
    },
  },
  plugins: [],
}
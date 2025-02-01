/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        pressStart: ["Press Start 2P", "cursive"],
      },
    },
  },
  plugins: [],
}
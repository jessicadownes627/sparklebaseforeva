/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "bg-[#1e2746]",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#1e2746",
      }
    },
  },
  plugins: [],
};

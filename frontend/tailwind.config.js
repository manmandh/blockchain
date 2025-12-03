/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF8142",
          green: "#1FAA59",
          dark: "#0F1C2E",
        },
      },
    },
  },
  plugins: [],
}


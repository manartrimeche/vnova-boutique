/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // SF Pro Display devient la police "sans" par défaut
        sans: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "ui-sans-serif",
          "system-ui"
        ],
      },
      letterSpacing: {
        // bonus pour tes titres style maquette
        wider2: "0.18em",
      },
    },
  },
  plugins: [],
};

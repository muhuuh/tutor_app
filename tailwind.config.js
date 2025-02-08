/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "gradient-pulse": {
          "0%, 100%": { "background-size": "200% 200%" },
          "50%": { "background-size": "400% 400%" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["developer", "sans"],
      },
      screens: {
        phn: { max: "1194px" },
      },
    },
  },
  plugins: [],
};

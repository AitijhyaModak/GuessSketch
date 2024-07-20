/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["developer", "sans"],
      },
      keyframes: {
        enter: {
          "0%": { transform: "translateY(-40px)", opacity: 0 },
          "100%": { transform: "translateY(0px)", opacity: 100 },
        },
        exit: {
          "0%": { transform: "translateY(0px)", opacity: 100 },
          "100%": { transform: "translateY(-40px)", opacity: 0 },
        },
        notif: {
          "0%": { transform: "translateX(-40px)", opacity: 0 },
          "100%": { transform: "translateX(0px)", opacity: 100 },
        },
      },
      animation: {
        enter: "enter .5s ease-in-out forwards",
        exit: "exit .5s ease-in-out forwards",
        notif: "notif .2s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};

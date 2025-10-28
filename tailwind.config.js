/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "10%, 30%": { transform: "rotate(-10deg)" },
          "20%, 40%": { transform: "rotate(10deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
        swing: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(-15deg)" },
          "30%": { transform: "rotate(15deg)" },
          "45%": { transform: "rotate(-10deg)" },
          "60%": { transform: "rotate(10deg)" },
          "75%": { transform: "rotate(-5deg)" },
        },
      },
      animation: {
        ticker: "ticker 20s linear infinite",
        "slide-up": "slide-up 0.3s ease-out",
        wiggle: "wiggle 1s ease-in-out infinite",
        swing: "swing 0.6s ease-in-out",
      },
    },
  },
};

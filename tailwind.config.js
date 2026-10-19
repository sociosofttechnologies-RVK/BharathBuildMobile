/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0D2B45", orange: "#F97316", slate: "#60707F", lightgrey: "#E6E9EE",
        offwhite: "#F8F9FB", destructive: "#DC2626", success: "#16A34A",
      },
      fontFamily: { sans: ["Inter"], display: ["Montserrat"] },
    },
  },
  plugins: [],
};

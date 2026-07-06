/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        brand: {
          50: "#EAF8F2",
          100: "#C9F0DF",
          500: "#10B981",
          700: "#0F8A62",
          900: "#0D1B2A"
        }
      }
    }
  },
  plugins: []
};

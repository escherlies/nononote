/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef

const colors = {
  primary: "#001AFF",
  secondary: {
    100: "#DBDBDB",
    200: "#D6D6D6",
  },
}

module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: colors,
      boxShadow: {
        DEFAULT: `${colors.primary} 4px 4px`,
        hover: `${colors.primary} 3px 3px`,
        down: `${colors.primary} 0px 0px`,
      },
    },
  },
  plugins: [],
}

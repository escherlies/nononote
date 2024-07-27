/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef

module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "color-primary": "var(--color-primary)",
        "background-primary": "var(--background-primary)",
      },
      boxShadow: {
        DEFAULT: `var(--color-primary) 4px 4px`,
        hover: `var(--color-primary) 3px 3px`,
        down: `var(--color-primary) 0px 0px`,
      },
    },
  },
  plugins: [],
}

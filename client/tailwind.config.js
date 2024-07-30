/** @type {import('tailwindcss').Config} */

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
      fontFamily: {
        sans: [
          '"Inter var", sans-serif',
          {
            fontFeatureSettings: '"cv11", "ss01"',
            fontVariationSettings: '"opsz" 32',
          },
        ],
      },
    },
  },
  plugins: [],
}

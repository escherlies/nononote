/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "color-accent": "var(--color-accent)",
        "color-text-primary": "var(--color-text-primary)",
        "background-primary": "var(--background-primary)",
        "background-secondary": "var(--background-secondary)",
        "background-tertiary": "var(--background-tertiary)",
      },
      boxShadow: {
        DEFAULT: `var(--color-accent) 4px 4px`,
        hover: `var(--color-accent) 2px 2px`,
        down: `var(--color-accent) 0px 0px`,
        active: `var(--color-accent) 1px 1px`,
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
      borderRadius: {
        // TODO: make this configurable for the different themes
        DEFAULT: "10px",
        lg: "14px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

export default [
  {
    rules: {
      // "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      // Comma dangle
      "comma-dangle": [
        "error",
        {
          functions: "never",
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
        },
      ],
      // No console
      "no-console": "error",
      // Always double quotes
      quotes: ["error", "double"],
      // No semi
      semi: ["error", "never"],
      // Newline at end of file
      "eol-last": ["error", "always"],
      // Switch exhaustiveness check
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
  },
];

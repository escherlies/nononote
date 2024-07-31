import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"

import projectRules from "../shared/eslint.config.mjs"

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...projectRules,
]

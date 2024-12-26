import tseslint, { type Config } from "typescript-eslint";

import { typescriptRules } from "../rules/typescript.js";

export const tseslintConfig: Config = tseslint.config(
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: typescriptRules,
  },
  {
    extends: [tseslint.configs.disableTypeChecked],
    // disable type-aware linting on JS files
    files: ["**/*.js"],
  },
);

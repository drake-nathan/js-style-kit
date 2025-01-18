import tseslint, { type Config } from "typescript-eslint";

import { configNames } from "../constants.js";
import { tseslintRules } from "./rules.js";

export const tseslintConfig: Config = tseslint.config(
  {
    files: ["**/*.{js,cjs,mjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    name: configNames.typescript,
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: tseslintRules,
  },
  {
    // disable type-aware linting on JS files
    extends: [tseslint.configs.disableTypeChecked],
    files: ["**/*.js"],
  },
);

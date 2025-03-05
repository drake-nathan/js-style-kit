import importPlugin from "eslint-plugin-import";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { importRules } from "./rules.js";

/**
 * Creates an ESLint configuration for Import.
 *
 * @param typescript - Whether TypeScript is being used in the project. When true, some rules are adjusted to be more TypeScript-friendly.
 * @returns ESLint configuration object for Import
 */
export const importConfig = (typescript: boolean): EslintConfigObject => ({
  name: configNames.import,
  plugins: {
    import: importPlugin,
  },
  rules: importRules(typescript),
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
});

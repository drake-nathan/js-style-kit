import type { ESLint } from "eslint";

import tsParser from "@typescript-eslint/parser";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import importXPlugin from "eslint-plugin-import-x";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { importRules } from "./rules.js";

/**
 * Creates an ESLint configuration for Import.
 *
 * @param typescript - Whether TypeScript is being used in the project. When true, some rules are adjusted to be more TypeScript-friendly.
 * @param customRules - Optional object containing custom rules to override or add to the Import configuration.
 * @returns ESLint configuration object for Import
 */
export const importConfig = (
  typescript: boolean,
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  languageOptions: {
    ecmaVersion: "latest",
    parser: tsParser,
    sourceType: "module",
  },
  name: configNames.import,
  plugins: {
    "import-x": importXPlugin as unknown as ESLint.Plugin,
  },
  rules: {
    ...importRules(typescript),
    ...(customRules ?? {}),
  },
  settings: {
    "import-x/resolver": {
      node: true,
      typescript,
    },
    "import-x/resolver-next": [
      createTypeScriptImportResolver({
        alwaysTryTypes: true,
        bun: true,
      }),
    ],
  },
});

import type { ESLint } from "eslint";

import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";

import type { EslintConfigObject } from "../types.js";
import type { PreferArrowFunctionsRules } from "./types.js";

import { configNames } from "../constants.js";

/**
 * Creates an ESLint configuration for Prefer Arrow Functions.
 *
 * @returns ESLint configuration object for Prefer Arrow Functions
 */
export const preferArrowFunctionConfig = (): EslintConfigObject => ({
  name: configNames.preferArrowFunction,
  plugins: {
    "prefer-arrow-functions": preferArrowFunctions as ESLint.Plugin,
  },
  rules: {
    "prefer-arrow-functions/prefer-arrow-functions": [
      "warn",
      {
        returnStyle: "unchanged",
      },
    ],
  } satisfies PreferArrowFunctionsRules,
});

import type { ESLint } from "eslint";

import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";
import type { PreferArrowFunctionsRules } from "./types.js";

import { configNames } from "../constants.js";

/**
 * Creates an ESLint configuration for Prefer Arrow Functions.
 *
 * @param customRules - Optional object containing custom rules to override or add to the configuration.
 * @returns ESLint configuration object for Prefer Arrow Functions
 */
export const preferArrowFunctionConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  name: configNames.preferArrowFunction,
  plugins: {
    "prefer-arrow-functions": preferArrowFunctions as ESLint.Plugin,
  },
  rules: {
    "prefer-arrow-functions/prefer-arrow-functions": [
      "warn",
      {
        returnStyle: "unchanged",
        singleReturnOnly: false,
      },
    ],
    ...(customRules ?? {}),
  } satisfies PreferArrowFunctionsRules,
});

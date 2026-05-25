import perfectionist from "eslint-plugin-perfectionist";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { perfectionistRules } from "./rules.js";

/**
 * Creates an ESLint configuration for Perfectionist.
 *
 * @param customRules - Optional object containing custom rules to override or add to the Perfectionist configuration.
 * @returns ESLint configuration object for Perfectionist
 */
export const perfectionistConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  name: configNames.perfectionist,
  plugins: {
    perfectionist,
  },
  rules: {
    ...perfectionistRules,
    ...(customRules ?? {}),
  },
});

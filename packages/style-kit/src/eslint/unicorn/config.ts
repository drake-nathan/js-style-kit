import unicorn from "eslint-plugin-unicorn";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { rules } from "./rules.js";

/**
 * ESLint configuration for unicorn plugin.
 * This plugin provides a set of rules to enforce consistent code style and catch common errors.
 *
 * @param customRules - Optional custom rules to merge with the default Unicorn rules.
 * @returns ESLint configuration object for Unicorn.
 */
export const unicornConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  name: configNames.unicorn,
  plugins: {
    unicorn,
  },
  rules: {
    ...rules,
    ...(customRules ?? {}),
  },
});

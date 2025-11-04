import expo from "eslint-plugin-expo";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { expoRules } from "./rules.js";

/**
 * Creates an ESLint configuration for Expo.
 *
 * @param customRules - Optional object containing custom rules to override or add to the Expo configuration.
 * @returns ESLint configuration object for Expo
 */
export const expoConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  name: configNames.expo,
  plugins: {
    expo,
  },
  rules: {
    ...expoRules,
    ...(customRules ?? {}),
  },
});

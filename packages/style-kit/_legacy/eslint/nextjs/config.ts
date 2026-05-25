import nextjs from "eslint-plugin-nextjs";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { nextjsRules } from "./rules.js";

/**
 * Creates an ESLint configuration for Next.js.
 *
 * @param customRules - Optional object containing custom rules to override or add to the Next.js configuration.
 * @returns ESLint configuration object for Next.js
 */
export const nextjsConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  name: configNames.nextjs,
  plugins: {
    nextjs,
  },
  rules: {
    ...nextjsRules,
    ...(customRules ?? {}),
  },
});

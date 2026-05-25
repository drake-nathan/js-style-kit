import jsdoc from "eslint-plugin-jsdoc";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { jsdocRules } from "./rules.js";

/**
 * Generates ESLint configuration for JSDoc comments.
 *
 * @param requireJsdoc - Whether to enforce JSDoc comments on functions and classes. Defaults to false.
 * @param customRules - Optional object containing custom rules to override or add to the JSDoc configuration.
 * @returns An ESLint configuration object for JSDoc comments.
 */
export const jsdocConfig = (
  requireJsdoc = false,
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  files: ["**/*.{js,jsx,ts,tsx,cjs,mjs}"],
  ignores: ["**/*.{test,spec}.{js,jsx,ts,tsx,cjs,mjs}"],
  name: configNames.jsdoc,
  plugins: {
    jsdoc,
  },
  rules: {
    ...jsdocRules(requireJsdoc),
    ...(customRules ?? {}),
  },
});

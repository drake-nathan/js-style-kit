import unicorn from "eslint-plugin-unicorn";

import type {
  EslintConfigObject,
  EslintRuleConfig,
  FilenameCase,
} from "../types.js";

import { configNames } from "../constants.js";
import { rules } from "./rules.js";

/**
 * ESLint configuration for unicorn plugin.
 * This plugin provides a set of rules to enforce consistent code style and catch common errors.
 *
 * @param options - Configuration options for Unicorn.
 * @param options.customRules - Optional custom rules to merge with the default Unicorn rules.
 * @param options.filenameCase - Optional filename case to enforce. Defaults to "kebabCase".
 * @returns ESLint configuration object for Unicorn.
 */
export const unicornConfig = ({
  customRules,
  filenameCase = "kebabCase",
}: {
  customRules?: Record<string, EslintRuleConfig>;
  filenameCase?: FilenameCase;
}): EslintConfigObject => ({
  name: configNames.unicorn,
  plugins: {
    unicorn,
  },
  rules: {
    ...rules(filenameCase),
    ...(customRules ?? {}),
  },
});

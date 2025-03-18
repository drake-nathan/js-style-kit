import unicorn from "eslint-plugin-unicorn";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { rules } from "./rules.js";

/**
 * ESLint configuration for unicorn plugin.
 * This plugin provides a set of rules to enforce consistent code style and catch common errors.
 */
export const unicornConfig: EslintConfigObject = {
  name: configNames.unicorn,
  plugins: {
    unicorn,
  },
  rules,
};

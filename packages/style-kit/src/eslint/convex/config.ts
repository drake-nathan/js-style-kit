import type { ESLint } from "eslint";

import { createRequire } from "node:module";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { convexRules } from "./rules.js";

// Have to do this for now because their export is wrong
const require = createRequire(import.meta.url);

const convexPlugin = require("@convex-dev/eslint-plugin");

/**
 * Creates an ESLint configuration for Convex.
 *
 * @param customRules - Optional object containing custom rules to override or add to the Convex configuration.
 * @returns ESLint configuration object for Convex
 */
export const convexConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  files: ["**/convex/**/*.ts"],
  name: configNames.convex,
  plugins: {
    "@convex-dev": convexPlugin as unknown as ESLint.Plugin,
  },
  rules: {
    ...convexRules,
    ...(customRules ?? {}),
  },
});

import type { ESLint } from "eslint";

import { createRequire } from "node:module";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { convexRules } from "./rules.js";

// TODO: Replace with ESM import once @convex-dev/eslint-plugin stabilizes
// The plugin doesn't have proper ESM exports yet
const require = createRequire(import.meta.url);

const convexPlugin = require("@convex-dev/eslint-plugin");

/**
 * Creates an ESLint configuration for Convex.
 *
 * @param customRules - Optional object containing custom rules to override or add to the Convex configuration.
 * @param unicorn - Whether the config uses unicorn rules.
 * @returns ESLint configuration object for Convex
 */
export const convexConfig = (
  customRules?: Record<string, EslintRuleConfig>,
  unicorn?: boolean,
): EslintConfigObject => ({
  files: ["**/convex/**/*.{ts,js}"],
  name: configNames.convex,
  plugins: {
    "@convex-dev": convexPlugin as unknown as ESLint.Plugin,
  },
  rules: {
    ...convexRules,
    ...(customRules ?? {}),
    // Convex files must be camelCase
    ...(unicorn ?
      {
        "unicorn/filename-case": [
          "warn",
          {
            case: "camelCase",
          },
        ],
      }
    : {}),
  },
});

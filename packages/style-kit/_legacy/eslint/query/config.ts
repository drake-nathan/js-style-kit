import type { ESLint } from "eslint";

import queryPlugin from "@tanstack/eslint-plugin-query";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { queryRules } from "./rules.js";

/**
 * Creates an ESLint configuration for TanStack Query.
 *
 * @param customRules - Optional object containing custom rules to override or add to the Query configuration.
 * @returns ESLint configuration object for TanStack Query
 */
export const queryConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  name: configNames.query,
  plugins: {
    "@tanstack/query": queryPlugin as unknown as ESLint.Plugin,
  },
  rules: {
    ...queryRules,
    ...(customRules ?? {}),
  },
});

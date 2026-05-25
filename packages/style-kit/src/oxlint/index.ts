import { type OxlintConfig, defineConfig } from "oxlint";

import type { OxlintOptions, RulesRecord } from "../types.js";

import { buildBaseRules } from "./base-rules.js";

/**
 * Always-on ignore patterns. User-supplied `ignores` are appended.
 */
const DEFAULT_IGNORES = ["**/node_modules/**", "**/dist/**", "**/build/**"];

/**
 * Build an oxlint configuration object suitable for spreading into
 * `defineConfig(...)` in an `oxlint.config.ts`, or passing inline to Vite+.
 *
 * This is the T05 scaffold: ignore patterns, the base ESLint correctness
 * ruleset, and empty `plugins` / `jsPlugins` / `overrides` arrays that
 * T06–T09 populate.
 */
export const oxlintConfig = (options: OxlintOptions = {}): OxlintConfig => {
  const { functionStyle = "arrow", ignores = [], rules: userRules, typescript = true } =
    options;

  const ignorePatterns = [...DEFAULT_IGNORES, ...ignores];

  const baseRules = buildBaseRules(functionStyle, Boolean(typescript));

  const mergedRules: RulesRecord = userRules
    ? { ...baseRules, ...userRules }
    : baseRules;

  return defineConfig({
    ignorePatterns,
    jsPlugins: [],
    overrides: [],
    plugins: ["eslint"],
    rules: mergedRules,
  });
};

import type {
  RuleOverride,
  RulesRecord,
  TailwindOptions,
} from "../../types.js";

/**
 * Default rule sets for opt-in JS plugins are intentionally minimal —
 * we register the plugin but don't pin specific rules so we don't
 * have to chase rule-name drift across the upstream alpha plugins.
 * Users opt in via the `rules` override.
 *
 * Exception: `tailwindcss` has a couple of high-value built-in rules
 * we can name reliably.
 */

export const buildTailwindLintRules = (
  _tailwind: TailwindOptions | true,
): RulesRecord => ({
  "tailwindcss/classnames-order": "warn",
  "tailwindcss/no-contradicting-classname": "warn",
});

export const buildQueryRules = (): RulesRecord => ({});

export const buildConvexRules = (): RulesRecord => ({});

export const buildTurboRules = (): RulesRecord => ({});

/**
 * Storybook still gets a scoped override so the plugin's rules apply
 * only to `*.stories.*` and `.storybook/`. No specific rules pinned —
 * users opt in via overrides[*].rules.
 */
export const buildStorybookOverride = (): RuleOverride => ({
  files: ["**/*.stories.@(js|jsx|ts|tsx|mjs|cjs)", "**/.storybook/**"],
  rules: {},
});

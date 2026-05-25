import type {
  RuleOverride,
  RulesRecord,
  TailwindOptions,
} from "../../types.js";

/**
 * `oxlint-tailwindcss` JS plugin. Minimal default rule set; users can
 * extend via the `rules` override.
 */
export const buildTailwindLintRules = (
  _tailwind: TailwindOptions | true,
): RulesRecord => ({
  "tailwindcss/classnames-order": "warn",
  "tailwindcss/no-contradicting-classname": "warn",
});

/**
 * `@tanstack/eslint-plugin-query`.
 */
export const buildQueryRules = (): RulesRecord => ({
  "query/exhaustive-deps": "warn",
  "query/no-rest-destructuring": "warn",
});

/**
 * `@convex-dev/eslint-plugin`.
 */
export const buildConvexRules = (): RulesRecord => ({
  "convex/no-args-without-validator": "warn",
  "convex/no-old-registered-function-syntax": "warn",
});

/**
 * `eslint-plugin-turbo`.
 */
export const buildTurboRules = (): RulesRecord => ({
  "turbo/no-undeclared-env-vars": "warn",
});

/**
 * `eslint-plugin-storybook` — scoped via overrides to `*.stories.*` and
 * `.storybook/` files.
 */
export const buildStorybookOverride = (): RuleOverride => ({
  files: ["**/*.stories.@(js|jsx|ts|tsx|mjs|cjs)", "**/.storybook/**"],
  rules: {
    "storybook/await-interactions": "warn",
    "storybook/csf-component": "warn",
    "storybook/default-exports": "warn",
    "storybook/hierarchy-separator": "warn",
    "storybook/no-redundant-story-name": "warn",
    "storybook/prefer-pascal-case": "warn",
    "storybook/story-exports": "warn",
    "storybook/use-storybook-expect": "warn",
    "storybook/use-storybook-testing-library": "warn",
  },
});

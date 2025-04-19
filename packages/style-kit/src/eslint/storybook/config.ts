import type { ESLint } from "eslint";

import storybookPlugin from "eslint-plugin-storybook";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";

/**
 * ESLint configuration for Storybook.
 * Contains rules for best practices when working with Storybook.
 *
 * @param customRules - Optional custom rules to merge into the Storybook config.
 * @returns Storybook ESLint config array.
 */
export const storybookConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject[] => [
  {
    files: [
      "**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
      "**/*.story.@(ts|tsx|js|jsx|mjs|cjs)",
    ],
    name: configNames.storybook,
    plugins: {
      storybook: storybookPlugin as unknown as ESLint.Plugin,
    },
    rules: {
      // Default Storybook rules
      "import/no-anonymous-default-export": "off",
      "react-hooks/rules-of-hooks": "off",
      "storybook/await-interactions": "warn",
      "storybook/context-in-play-function": "warn",
      "storybook/csf-component": "warn",
      "storybook/default-exports": "warn",
      "storybook/hierarchy-separator": "warn",
      "storybook/meta-inline-properties": "warn",
      "storybook/no-redundant-story-name": "warn",
      "storybook/prefer-pascal-case": "warn",
      "storybook/story-exports": "warn",
      "storybook/use-storybook-expect": "warn",
      "storybook/use-storybook-testing-library": "warn",
      // Merge custom rules
      ...(customRules ?? {}),
    },
  },
  {
    files: [".storybook/main.@(js|cjs|mjs|ts)"],
    name: configNames.storybookConfig,
    plugins: {
      storybook: storybookPlugin as unknown as ESLint.Plugin,
    },
    rules: {
      "storybook/no-uninstalled-addons": "warn",
    },
  },
];

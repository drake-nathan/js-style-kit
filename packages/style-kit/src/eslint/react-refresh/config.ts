import reactRefresh from "eslint-plugin-react-refresh";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { reactRefreshRules } from "./rules.js";

/**
 * Generates ESLint configuration for React Refresh.
 *
 * This plugin validates that components can safely be updated with Fast Refresh.
 * It enforces that components are structured in a way that integrations like
 * react-refresh expect.
 *
 * @returns An ESLint configuration object for React Refresh.
 */
export const reactRefreshEslintConfig = (): EslintConfigObject => {
  return {
    name: configNames.reactRefresh,
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: reactRefreshRules,
  };
};

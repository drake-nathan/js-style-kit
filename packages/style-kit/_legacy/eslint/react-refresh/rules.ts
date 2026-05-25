import type { EslintRuleConfig } from "../types.js";

export type ReactRefreshRules = Record<string, EslintRuleConfig> & {
  "react-refresh/only-export-components"?: EslintRuleConfig<{
    /**
     * Don't warn when a constant (string, number, boolean, templateLiteral)
     * is exported aside one or more components.
     */
    allowConstantExport?: boolean;
    /**
     * If you use a framework that handles HMR of some specific exports,
     * you can use this option to avoid warning for them.
     */
    allowExportNames?: string[];
    /**
     * If you're using JSX inside .js files, you can enable this option.
     * To reduce false positives, only files importing 'react' are checked.
     */
    checkJS?: boolean;
    /**
     * If you're exporting a component wrapped in a custom HOC,
     * you can use this option to avoid false positives.
     */
    customHOCs?: string[];
  }>;
};

/**
 * Generates ESLint rules configuration for React Refresh.
 *
 * This plugin validates that components can safely be updated with Fast Refresh.
 *
 * @returns Configuration object containing ESLint rules for React Refresh
 */
export const reactRefreshRules: ReactRefreshRules = {
  /**
   * Validate that your components can safely be updated with Fast Refresh.
   *
   * This rule enforces that components are structured in a way that integrations
   * like react-refresh expect.
   *
   * 🚫 Not fixable - https://github.com/ArnaudBarre/eslint-plugin-react-refresh
   */
  "react-refresh/only-export-components": [
    "warn",
    { allowConstantExport: true },
  ],
};

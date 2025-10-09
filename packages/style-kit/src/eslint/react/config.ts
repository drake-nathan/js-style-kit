import react from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import type {
  EslintConfigObject,
  EslintRuleConfig,
  FunctionStyle,
} from "../types.js";

import { configNames } from "../constants.js";
import { reactRules } from "./rules.js";

/**
 * Generates ESLint configuration for React.
 *
 * @param functionStyle - Controls how functions (components) should be written. Can be:
 *   - "off": Disables function style enforcement
 *   - "arrow": Enforces arrow function expressions
 *   - "declaration": Enforces function declarations
 *   - "expression": Enforces function expressions
 * @param reactCompiler - Whether to use the React compiler rules from `eslint-plugin-react-hooks`.
 * @param typescript - Whether TypeScript is being used in the project. When true, some rules are adjusted to be more TypeScript-friendly.
 * @param customRules - Optional object containing custom rules to override or add to the React configuration.
 * @returns An ESLint configuration object for React.
 */
export const reactEslintConfig = (
  functionStyle: "off" | FunctionStyle,
  reactCompiler: boolean,
  typescript: boolean,
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => {
  return {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    name: configNames.react,
    plugins: {
      react,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...reactRules(functionStyle, reactCompiler, typescript),
      ...(customRules ?? {}),
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
};

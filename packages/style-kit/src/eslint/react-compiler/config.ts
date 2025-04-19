import reactCompiler from "eslint-plugin-react-compiler";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";

/**
 * Creates an ESLint configuration for React Compiler.
 *
 * @param customRules - Optional object containing custom rules to override or add to the React Compiler configuration.
 * @returns ESLint configuration object for React Compiler
 */
export const reactCompilerEslintConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  name: configNames.reactCompiler,
  plugins: {
    "react-compiler": reactCompiler,
  },
  rules: customRules ?? {
    "react-compiler/react-compiler": "warn",
  },
});

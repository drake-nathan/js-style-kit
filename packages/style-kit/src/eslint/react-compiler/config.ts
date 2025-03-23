import reactCompiler from "eslint-plugin-react-compiler";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";

/**
 * Creates an ESLint configuration for React Compiler.
 *
 * @returns ESLint configuration object for React Compiler
 */
export const reactCompilerEslintConfig: EslintConfigObject = {
  name: configNames.reactCompiler,
  plugins: {
    "react-compiler": reactCompiler,
  },
  rules: {
    "react-compiler/react-compiler": "warn",
  },
};

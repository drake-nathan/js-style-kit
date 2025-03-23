import jsdoc from "eslint-plugin-jsdoc";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { jsdocRules } from "./rules.js";

/**
 * Generates ESLint configuration for JSDoc comments.
 *
 * @param requireJsdoc - Whether to enforce JSDoc comments on functions and classes. Defaults to false.
 * @param typescript - Whether TypeScript is being used in the project. When true, some rules are adjusted to be more TypeScript-friendly. Defaults to true.
 * @returns An ESLint configuration object for JSDoc comments.
 */
export const jsdocConfig = (
  requireJsdoc = false,
  typescript = true,
): EslintConfigObject => ({
  files: ["**/*.{js,jsx,ts,tsx,cjs,mjs}"],
  ignores: ["**/*.{test,spec}.{js,jsx,ts,tsx,cjs,mjs}"],
  name: configNames.jsdoc,
  plugins: {
    jsdoc,
  },
  rules: jsdocRules(requireJsdoc, typescript),
});

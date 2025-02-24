import type { EslintConfigObject, FunctionStyle } from "../types.js";

import { configNames } from "../constants.js";
import { baseEslintRules } from "./rules.js";

/**
 * Creates a base ESLint configuration object with specified function style rules.
 *
 * @param functionStyle - Controls how functions should be written. Can be:
 *   - "off": Disables function style enforcement
 *   - "arrow": Enforces arrow function expressions
 *   - "declaration": Enforces function declarations
 *   - "expression": Enforces function expressions
 * @returns ESLint configuration object
 */
export const baseEslintConfig = (
  functionStyle: "off" | FunctionStyle,
): EslintConfigObject => ({
  languageOptions: {
    ecmaVersion: 2022,
  },
  linterOptions: { reportUnusedDisableDirectives: true },
  name: configNames.base,
  rules: baseEslintRules(functionStyle),
});

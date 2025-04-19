import type {
  EslintConfigObject,
  EslintRuleConfig,
  FunctionStyle,
} from "../types.js";

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
 * @param typescript - Whether TypeScript is being used in the project. When true, some rules are adjusted to be more TypeScript-friendly.
 * @param customRules - Optional object containing custom rules to override or add to the base configuration.
 * @returns ESLint configuration object
 */
export const baseEslintConfig = (
  functionStyle: "off" | FunctionStyle,
  typescript: boolean,
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  linterOptions: { reportUnusedDisableDirectives: true },
  name: configNames.base,
  rules: {
    ...baseEslintRules(functionStyle, typescript),
    ...(customRules ?? {}),
  },
});

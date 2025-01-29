import type { Linter } from "eslint";

import type { FunctionStyle } from "../../types.js";

import { configNames } from "../constants.js";
import { baseEslintRules } from "./rules.js";

export const baseEslintConfig = (
  functionStyle: "off" | FunctionStyle,
): Linter.Config => ({
  languageOptions: {
    ecmaVersion: 2022,
  },
  linterOptions: { reportUnusedDisableDirectives: true },
  name: configNames.base,
  rules: baseEslintRules(functionStyle),
});

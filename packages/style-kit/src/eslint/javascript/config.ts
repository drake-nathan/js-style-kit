import type { EslintConfigObject, FunctionStyle } from "../types.js";

import { configNames } from "../constants.js";
import { baseEslintRules } from "./rules.js";

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

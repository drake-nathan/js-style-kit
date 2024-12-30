import type { Linter } from "eslint";

import globals from "globals";

import type { FunctionStyle } from "../../types.js";

import { baseEslintRules } from "./rules.js";

export const baseEslintConfig = (
  functionStyle: FunctionStyle,
): Linter.Config => ({
  languageOptions: {
    ecmaVersion: 2022,
    globals: {
      ...globals.node,
      ...globals.es2022,
    },
  },
  linterOptions: { reportUnusedDisableDirectives: true },
  name: "base-eslint-config",
  rules: baseEslintRules(functionStyle),
});

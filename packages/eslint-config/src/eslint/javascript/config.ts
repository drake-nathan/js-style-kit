import type { Linter } from "eslint";

import type { FunctionStyle } from "../../types.js";

import { baseEslintRules } from "./rules.js";

export const baseEslintConfig = (
  functionStyle: FunctionStyle,
): Linter.Config => ({
  linterOptions: { reportUnusedDisableDirectives: true },
  name: "base-eslint-config",
  rules: baseEslintRules(functionStyle),
});

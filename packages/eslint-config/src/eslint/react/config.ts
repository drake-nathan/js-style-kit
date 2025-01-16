import type { Linter } from "eslint";

import react from "eslint-plugin-react";

import type { FunctionStyle } from "../../types.js";

import { configNames } from "../constants.js";
import { reactRules } from "./rules.js";

export const reactEslintConfig = (
  functionStyle: FunctionStyle,
  typescript: boolean,
): Linter.Config => {
  return {
    name: configNames.react,
    plugins: {
      react,
    },
    rules: reactRules(functionStyle, typescript),
  };
};

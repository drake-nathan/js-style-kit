import react from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import type { EslintConfigObject, FunctionStyle } from "../types.js";

import { configNames } from "../constants.js";
import { reactRules } from "./rules.js";

export const reactEslintConfig = (
  functionStyle: "off" | FunctionStyle,
  typescript: boolean,
): EslintConfigObject => {
  return {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    name: configNames.react,
    plugins: {
      react,
      "react-hooks": pluginReactHooks,
    },
    rules: reactRules(functionStyle, typescript),
    settings: {
      react: {
        version: "detect",
      },
    },
  };
};

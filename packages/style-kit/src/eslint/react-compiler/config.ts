import type { Linter } from "eslint";

import reactCompiler from "eslint-plugin-react-compiler";

import { configNames } from "../constants.js";

export const reactCompilerEslintConfig: Linter.Config = {
  name: configNames.reactCompiler,
  plugins: {
    "react-compiler": reactCompiler,
  },
  rules: {
    "react-compiler/react-compiler": "error",
  },
};

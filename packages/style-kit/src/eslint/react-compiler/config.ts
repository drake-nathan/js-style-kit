import reactCompiler from "eslint-plugin-react-compiler";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";

export const reactCompilerEslintConfig: EslintConfigObject = {
  name: configNames.reactCompiler,
  plugins: {
    "react-compiler": reactCompiler,
  },
  rules: {
    "react-compiler/react-compiler": "error",
  },
};

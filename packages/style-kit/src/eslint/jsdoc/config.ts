import type { Linter } from "eslint";

import jsdoc from "eslint-plugin-jsdoc";

import { configNames } from "../constants.js";
import { jsdocRules } from "./rules.js";

export const jsdocConfig = (requireJsdoc = false): Linter.Config => ({
  name: configNames.base,
  plugins: {
    jsdoc,
  },
  rules: jsdocRules(requireJsdoc),
});

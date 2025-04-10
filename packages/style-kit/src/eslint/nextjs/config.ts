import nextjs from "eslint-plugin-nextjs";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { nextjsRules } from "./rules.js";

/**
 * Creates an ESLint configuration for Next.js.
 *
 * @returns ESLint configuration object for Next.js
 */
export const nextjsConfig = (): EslintConfigObject => ({
  name: configNames.nextjs,
  plugins: {
    nextjs,
  },
  rules: nextjsRules,
});

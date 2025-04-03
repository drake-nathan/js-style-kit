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
    // TODO: will fix on next bump
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nextjs: nextjs as any,
  },
  rules: nextjsRules,
});

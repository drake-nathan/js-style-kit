import type { Linter } from "eslint";

import { configNames } from "./constants.js";

/**
 * Creates an ESLint configuration for file and directory ignores.
 * By default, ignores node_modules, dist directories, and .git directories.
 *
 * @param userIgnores - Additional glob patterns to ignore in ESLint checks
 * @returns ESLint configuration object with ignore patterns
 */
export const ignoresConfig = (userIgnores: string[]): Linter.Config => ({
  ignores: ["**/node_modules/", "**/dist/", ".git/", ...userIgnores],
  name: configNames.ignores,
});

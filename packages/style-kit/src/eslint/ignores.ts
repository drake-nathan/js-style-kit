import type { Linter } from "eslint";

import { configNames } from "./constants.js";

/**
 * Creates an ESLint configuration for file and directory ignores.
 * By default, ignores node_modules, dist directories, and .git directories.
 *
 * @param options - Object with options to control the ignores configuration
 * @param options.userIgnores - Additional glob patterns to ignore in ESLint checks
 * @param options.next - Whether to include .next directory in ignores
 * @returns ESLint configuration object with ignore patterns
 */
export const ignoresConfig = ({
  next = false,
  userIgnores = [],
}: {
  next?: boolean;
  userIgnores?: string[];
} = {}): Linter.Config => ({
  ignores: [
    "**/node_modules/",
    "**/dist/",
    ".git/",
    ...(next ? [".next"] : []),
    ...userIgnores,
  ],
  name: configNames.ignores,
});

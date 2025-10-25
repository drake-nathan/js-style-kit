import type { Linter } from "eslint";

import type { ReactFramework } from "./types.js";

import { configNames } from "./constants.js";

/**
 * Creates an ESLint configuration for file and directory ignores.
 * By default, ignores node_modules, dist directories, and .git directories.
 *
 * @param options - Object with options to control the ignores configuration
 * @param options.reactFramework - The React framework being used
 * @param options.storybook - Whether to include .storybook directory in ignores
 * @param options.userIgnores - Additional glob patterns to ignore in ESLint checks
 * @returns ESLint configuration object with ignore patterns
 */
export const ignoresConfig = ({
  reactFramework,
  storybook,
  userIgnores,
}: {
  reactFramework: ReactFramework;
  storybook: boolean;
  userIgnores: string[];
}): Linter.Config => ({
  ignores: [
    "**/dist/",
    "**/build/",
    ...(reactFramework === "next" ? [".next"] : []),
    ...(reactFramework === "react-router" ? [".react-router"] : []),
    ...(storybook ? ["!.storybook"] : []),
    ...userIgnores,
  ],
  name: configNames.ignores,
});

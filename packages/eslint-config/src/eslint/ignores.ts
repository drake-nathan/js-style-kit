import type { Linter } from "eslint";

import { configNames } from "./constants.js";

export const ignoresConfig = (userIgnores: string[]): Linter.Config => ({
  ignores: ["**/node_modules/", "**/dist/", ".git/", ...userIgnores],
  name: configNames.ignores,
});

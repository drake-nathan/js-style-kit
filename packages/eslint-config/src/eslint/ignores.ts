import type { Linter } from "eslint";

export const ignoresConfig = (userIgnores: string[]): Linter.Config => ({
  ignores: ["**/node_modules/", "**/dist/", ".git/", ...userIgnores],
});

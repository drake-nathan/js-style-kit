import type { Linter } from "eslint";

export const ignores = {
  ignores: ["**/node_modules/", "**/dist/", ".git/"],
} satisfies Linter.Config;

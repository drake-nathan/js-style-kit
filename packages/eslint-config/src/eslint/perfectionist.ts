import type { Linter } from "eslint";

import perfectionistPlugin from "eslint-plugin-perfectionist";

export const perfectionist = [
  perfectionistPlugin.configs["recommended-natural"],
] satisfies Linter.Config[];

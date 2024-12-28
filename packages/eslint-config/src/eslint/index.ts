import type { Linter } from "eslint";

import { ignores } from "./ignores.js";
import { baseEslintConfig } from "./javascript/config.js";
import { perfectionistConfig } from "./perfectionist/config.js";
import { tseslintConfig } from "./typescript/config.js";

export const eslintBase = [
  ignores,
  baseEslintConfig,
  perfectionistConfig,
] satisfies Linter.Config[];

export const eslintTypescript = [
  ignores,
  baseEslintConfig,
  ...(tseslintConfig as Linter.Config[]),
  perfectionistConfig,
] satisfies Linter.Config[];

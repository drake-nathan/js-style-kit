import type { Linter } from "eslint";

import { ignores } from "./ignores.js";
import { javascriptEslintObj } from "./javascript/config.js";
import { perfectionist } from "./perfectionist.js";
import { tseslintConfig } from "./typescript.js";

export const javascriptConfig = [
  ignores,
  javascriptEslintObj,
  ...perfectionist,
] satisfies Linter.Config[];

export const typescriptConfig = [
  ignores,
  javascriptEslintObj,
  ...(tseslintConfig as Linter.Config[]),
  ...perfectionist,
] satisfies Linter.Config[];

export { javascriptEslintRules } from "./javascript/rules.js";

/**
 * Debug names for ESLint configuration objects.
 * These names help identify different configuration sections in ESLint's debug output
 * and error messages, making it easier to track which rules come from which config.
 */
export const configNames = {
  base: "base-config",
  disableTypeChecked: "typescript-eslint/disable-type-checked",
  ignores: "ignores-config",
  jsdoc: "jsdoc-config",
  markdown: "markdown-config",
  perfectionist: "perfectionist-config",
  preferArrowFunction: "prefer-arrow-function-config",
  react: "react-config",
  reactCompiler: "react-compiler-config",
  testing: "testing-config",
  turbo: "turbo-config",
  typescript: "tseslint-config",
  unicorn: "unicorn-config",
} as const;

export type ConfigName = (typeof configNames)[keyof typeof configNames];

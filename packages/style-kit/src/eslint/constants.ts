export const configNames = {
  base: "base-config",
  disableTypeChecked: "typescript-eslint/disable-type-checked",
  ignores: "ignores-config",
  jsdoc: "jsdoc-config",
  perfectionist: "perfectionist-config",
  react: "react-config",
  reactCompiler: "react-compiler-config",
  typescript: "tseslint-config",
} as const;

export type ConfigName = (typeof configNames)[keyof typeof configNames];

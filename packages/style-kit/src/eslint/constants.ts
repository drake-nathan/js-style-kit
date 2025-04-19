/**
 * Debug names for ESLint configuration objects.
 * These names help identify different configuration sections in ESLint's debug output
 * and error messages, making it easier to track which rules come from which config.
 */
export const configNames = {
  base: "base",
  disableTypeChecked: "typescript-eslint/disable-type-checked",
  ignores: "ignores",
  import: "import",
  jsdoc: "jsdoc",
  markdown: "markdown",
  nextjs: "nextjs",
  perfectionist: "perfectionist",
  preferArrowFunction: "prefer-arrow-function",
  react: "react",
  reactCompiler: "react-compiler",
  reactRefresh: "react-refresh",
  storybook: "storybook:stories",
  storybookConfig: "storybook:config",
  testing: "testing",
  turbo: "turbo",
  typescript: "tseslint",
  typescriptTesting: "tseslint-testing",
  unicorn: "unicorn",
} as const;

export type ConfigName = (typeof configNames)[keyof typeof configNames];

export const pluginPrefixes = [
  "@typescript-eslint",
  "import",
  "import-x",
  "jsdoc",
  "nextjs",
  "perfectionist",
  "react",
  "react-compiler",
  "react-hooks",
  "react-refresh",
  "jest",
  "vitest",
  "storybook",
  "turbo",
  "unicorn",
];

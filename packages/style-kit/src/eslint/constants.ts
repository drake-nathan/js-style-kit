/**
 * Debug names for ESLint configuration objects.
 * These names help identify different configuration sections in ESLint's debug output
 * and error messages, making it easier to track which rules come from which config.
 */
export const configNames = {
  base: "base",
  disableTypeChecked: "UserConfig[1] > typescript-eslint/disable-type-checked",
  ignores: "ignores",
  import: "import",
  jsdoc: "jsdoc",
  markdown: "markdown",
  nextjs: "nextjs",
  perfectionist: "perfectionist",
  preferArrowFunction: "prefer-arrow-function",
  query: "@tanstack/query",
  react: "react",
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

/**
 * Maps plugin prefixes to their corresponding config names.
 * This is the single source of truth for categorizing rules by plugin.
 */
export const pluginPrefixMap = new Map<string, ConfigName>([
  ["@tanstack/query", configNames.query],
  ["@typescript-eslint", configNames.typescript],
  ["import", configNames.import],
  ["import-x", configNames.import],
  ["jest", configNames.testing],
  ["jsdoc", configNames.jsdoc],
  ["nextjs", configNames.nextjs],
  ["perfectionist", configNames.perfectionist],
  ["react", configNames.react],
  ["react-hooks", configNames.react],
  ["react-refresh", configNames.reactRefresh],
  ["storybook", configNames.storybook],
  ["turbo", configNames.turbo],
  ["unicorn", configNames.unicorn],
  ["vitest", configNames.testing],
]);

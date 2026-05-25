/**
 * Returns the list of dependencies the user is likely to have from
 * a previous prettier/eslint setup AND from older versions of
 * `js-style-kit`. These get uninstalled during `js-style-kit init`.
 *
 * The list intentionally over-removes — every package here was a
 * dependency or popular plugin in the v1 toolchain.
 */
export const getDependencies = (): string[] => [
  "@prettier/plugin-oxc",
  "@typescript-eslint/parser",
  "eslint",
  "eslint-import-resolver-typescript",
  "eslint-plugin-import-x",
  "eslint-plugin-jest",
  "eslint-plugin-jsdoc",
  "eslint-plugin-perfectionist",
  "eslint-plugin-prefer-arrow-functions",
  "eslint-plugin-react",
  "eslint-plugin-react-hooks",
  "eslint-plugin-react-refresh",
  "eslint-plugin-storybook",
  "eslint-plugin-turbo",
  "eslint-plugin-unicorn",
  "eslint-plugin-vitest",
  "globals",
  "prettier",
  "prettier-plugin-css-order",
  "prettier-plugin-curly",
  "prettier-plugin-packagejson",
  "prettier-plugin-sort-json",
  "prettier-plugin-tailwindcss",
  "typescript-eslint",
];

/**
 * Packages to install. Always installs the two oxc tools and
 * `js-style-kit` itself.
 */
export const getInstallDependencies = (): string[] => [
  "js-style-kit",
  "oxfmt",
  "oxlint",
];

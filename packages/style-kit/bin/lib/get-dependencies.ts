import fs from "node:fs";
import path from "node:path";

/**
 * Gets the list of dependencies that js-style-kit provides
 *
 * @returns Array of dependency names that should be removed from user's package.json
 */
export const getDependencies = (): string[] => {
  // Try to read from node_modules first (after installation)
  const nodeModulesPath = path.join(
    process.cwd(),
    "node_modules",
    "js-style-kit",
    "package.json",
  );

  try {
    if (fs.existsSync(nodeModulesPath)) {
      const jsStyleKitPackageJson = JSON.parse(
        fs.readFileSync(nodeModulesPath, "utf8"),
      );
      const dependencies = Object.keys(
        jsStyleKitPackageJson.dependencies || {},
      );
      console.info(
        `Found ${dependencies.length} dependencies in js-style-kit to remove`,
      );
      return dependencies;
    }
  } catch {
    console.warn(
      "Could not read js-style-kit package.json from node_modules, using fallback list",
    );
  }

  // Fallback to a comprehensive list of known dependencies
  // This list should be kept in sync with js-style-kit's dependencies
  return [
    "eslint",
    "prettier",
    "@prettier/plugin-oxc",
    "@typescript-eslint/parser",
    "eslint-import-resolver-typescript",
    "eslint-plugin-import-x",
    "eslint-plugin-jest",
    "eslint-plugin-jsdoc",
    "eslint-plugin-nextjs",
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
    "prettier-plugin-css-order",
    "prettier-plugin-curly",
    "prettier-plugin-packagejson",
    "prettier-plugin-sort-json",
    "prettier-plugin-tailwindcss",
    "typescript-eslint",
  ];
};

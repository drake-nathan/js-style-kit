import fs from "node:fs";

/**
 * Updates package.json scripts
 */
export const setupScripts = (): void => {
  console.info("Setting up package.json scripts...");

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    // Add or update scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      format: "prettier . --write --cache",
      "format:check": "prettier . --check --cache",
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
    };

    fs.writeFileSync(
      "package.json",
      JSON.stringify(packageJson, null, 2).concat("\n"),
    );
    console.info("Scripts added to package.json");
  } catch (error) {
    console.error("Failed to update package.json scripts:", error);
    process.exit(1);
  }
};

import fs from "node:fs";

/**
 * Updates package.json scripts to call oxlint / oxfmt.
 */
export const setupScripts = (): void => {
  console.info("Setting up package.json scripts...");

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    packageJson.scripts = {
      ...packageJson.scripts,
      format: "oxfmt .",
      "format:check": "oxfmt --check .",
      lint: "oxlint --deny-warnings",
      "lint:fix": "oxlint --fix --deny-warnings",
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

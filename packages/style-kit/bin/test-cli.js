#!/usr/bin/env node

// This is a simple test script to verify that our CLI tool works correctly
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get current file directory with ESM compatibility
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a temporary test directory adjacent to the bin directory
const testDir = path.join(__dirname, `temp-test`);

// Remove existing temp directory if it exists
if (fs.existsSync(testDir)) {
  console.info(`Removing existing test directory: ${testDir}`);
  fs.rmSync(testDir, { force: true, recursive: true });
}

console.info(`Creating test directory: ${testDir}`);
fs.mkdirSync(testDir, { recursive: true });

// Change to test directory
process.chdir(testDir);

try {
  // Initialize a basic package.json
  console.info("Initializing test package.json...");
  fs.writeFileSync(
    path.join(testDir, "package.json"),
    JSON.stringify(
      {
        dependencies: {
          eslint: "^9.19.0",
          "eslint-plugin-import-x": "^1.0.0",
          "eslint-something-else": "^1.0.0",
          prettier: "^3.4.2",
          "prettier-plugin-tailwindcss": "^0.6.11",
        },
        description: "Test project for js-style-kit CLI",
        devDependencies: {},
        main: "index.js",
        name: "test-project",
        scripts: {},
        version: "1.0.0",
      },
      null,
      2,
    ),
  );

  // Run our CLI tool in dry run mode
  console.info("Running js-style-kit init --dry-run...");
  // Note: Replace with the actual path to the compiled CLI
  execSync(
    `node ${path.join(__dirname, "../dist/bin/index.cjs")} init --dry-run`,
    {
      stdio: "inherit",
    },
  );

  // Verify that configuration files were created
  console.info("\nVerifying configuration files:");
  ["eslint.config.mjs", "prettier.config.mjs", ".vscode/settings.json"].forEach(
    (file) => {
      const filePath = path.join(testDir, file);
      if (fs.existsSync(filePath)) {
        console.info(`✅ ${file} was created successfully`);
      } else {
        console.info(`❌ ${file} was NOT created`);
      }
    },
  );

  // Verify package.json updates
  console.info("\nVerifying package.json updates:");
  const updatedPackage = JSON.parse(
    fs.readFileSync(path.join(testDir, "package.json"), "utf8"),
  );

  // Check if scripts were added
  const hasScripts =
    updatedPackage.scripts &&
    updatedPackage.scripts.lint &&
    updatedPackage.scripts.format;

  console.info(`✅ Scripts added: ${hasScripts ? "Yes" : "No"}`);

  // Check if js-style-kit was NOT added as a dependency (dry run behavior)
  const hasStyleKit =
    updatedPackage.devDependencies &&
    updatedPackage.devDependencies["js-style-kit"];

  console.info(
    `✅ js-style-kit not installed (dry run): ${!hasStyleKit ? "Yes" : "No"}`,
  );
} catch (error) {
  console.error("Error during test:", error);
} finally {
  // Clean up the test directory
  console.info(`\nTest complete. Test directory: ${testDir}`);
  // Uncomment to automatically clean up the test directory
  // fs.rmSync(testDir, { force: true, recursive: true });
}

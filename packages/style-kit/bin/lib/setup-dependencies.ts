import { execSync } from "node:child_process";
import fs from "node:fs";

import type { PackageManager } from "./types.js";

import { getDependencies } from "./get-dependencies.js";

/**
 * Installs js-style-kit and removes overlapping dependencies
 *
 * @param packageManager The package manager to use
 * @param dryRun Whether to skip actual installation
 */
export const setupDependencies = (
  packageManager: PackageManager,
  dryRun = false,
): void => {
  console.info(`Using package manager: ${packageManager}`);

  // Install js-style-kit
  if (dryRun) {
    console.info("Would install js-style-kit (dry run)");
  } else {
    console.info("Installing js-style-kit...");

    const installCommands = {
      bun: "bun add --dev js-style-kit",
      npm: "npm install --save-dev js-style-kit",
      pnpm: "pnpm add --save-dev js-style-kit",
      yarn: "yarn add --dev js-style-kit",
    } as const;

    // Get installation command for the detected package manager
    const installCmd = installCommands[packageManager];
    execSync(installCmd, { stdio: "inherit" });
  }

  try {
    // Remove overlapping dependencies
    const overlappingDeps = getDependencies();
    console.info("Removing overlapping dependencies...");

    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    // Ensure dependencies and devDependencies exist
    packageJson.dependencies = packageJson.dependencies ?? {};
    packageJson.devDependencies = packageJson.devDependencies ?? {};

    // Create new objects to avoid direct manipulation
    const newDeps = { ...packageJson.dependencies };
    const newDevDeps = { ...packageJson.devDependencies };
    let hasChanges = false;

    overlappingDeps.forEach((dep) => {
      // Check and remove from dependencies
      if (Object.prototype.hasOwnProperty.call(newDeps, dep)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newDeps[dep];
        hasChanges = true;
        console.info(`Removed ${dep} from dependencies`);
      }

      // Check and remove from devDependencies
      if (Object.prototype.hasOwnProperty.call(newDevDeps, dep)) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newDevDeps[dep];
        hasChanges = true;
        console.info(`Removed ${dep} from devDependencies`);
      }
    });

    // Only update if changes were made
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (hasChanges) {
      packageJson.dependencies = newDeps;
      packageJson.devDependencies = newDevDeps;
      fs.writeFileSync(
        "package.json",
        JSON.stringify(packageJson, null, 2).concat("\n"),
      );
    }
  } catch (error) {
    console.error("Failed to install dependencies:", error);
    process.exit(1);
  }
};

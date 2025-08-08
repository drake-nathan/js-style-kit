import { Command } from "commander";
import fs from "node:fs";

import type { PackageManager } from "./lib/types.js";

import { detectPackageManager } from "./lib/detect-package-manager.js";
import { setupConfigFiles } from "./lib/setup-config-files.js";
import { setupDependencies } from "./lib/setup-dependencies.js";
import { setupScripts } from "./lib/setup-scripts.js";
import { setupVSCodeSettings } from "./lib/setup-vscode-settings.js";

const program = new Command();

// Define CLI version and description
program
  .name("js-style-kit")
  .description(
    "Initialize JavaScript/TypeScript project with style configurations",
  )
  .version("1.0.0");

// Main init command
program
  .command("init")
  .description("Initialize project with js-style-kit configurations")
  .option(
    "--dry-run",
    "Create configuration files but skip dependency installation",
  )
  .action((options) => {
    const dryRun = options.dryRun ?? false;

    if (dryRun) {
      console.info("Initializing js-style-kit (dry run mode)...");
    } else {
      console.info("Initializing js-style-kit...");
    }

    try {
      const packageManager = detectPackageManager();

      // Check if package.json exists
      if (!fs.existsSync("package.json")) {
        console.error(
          "package.json not found. Please initialize your project first.",
        );
        process.exit(1);
      }

      setupDependencies(packageManager, dryRun);
      setupScripts();
      setupConfigFiles();
      setupVSCodeSettings();

      const runCmd: Record<PackageManager, string> = {
        bun: "bun run",
        npm: "npm run",
        pnpm: "pnpm run",
        yarn: "yarn",
      };

      if (dryRun) {
        console.info("\n✅ js-style-kit dry run completed successfully!");
        console.info(
          "Configuration files created, but dependencies were not installed.",
        );
      } else {
        console.info("\n✅ js-style-kit initialized successfully!");
        console.info("\nYou can now use the following npm scripts:");
        console.info(
          `  - ${runCmd[packageManager]} lint - Check code for linting issues`,
        );
        console.info(
          `  - ${runCmd[packageManager]} lint:fix - Automatically fix linting issues`,
        );
        console.info(
          `  - ${runCmd[packageManager]} format - Format code with Prettier`,
        );
        console.info(
          `  - ${runCmd[packageManager]} format:check - Check if code is properly formatted`,
        );
      }
    } catch (error) {
      console.error("Failed to initialize js-style-kit:", { cause: error });
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

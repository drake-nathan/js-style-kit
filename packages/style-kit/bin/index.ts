import { Command } from "commander";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

type PackageManager = "bun" | "npm" | "pnpm" | "yarn";
type Extension = ".js" | ".mjs";

const program = new Command();

// Define CLI version and description
program
  .name("js-style-kit")
  .description(
    "Initialize JavaScript/TypeScript project with style configurations",
  )
  .version("1.0.0");

/**
 * Detects the package manager being used in the project
 *
 * @returns The detected package manager or fallback to npm
 */
const detectPackageManager = (): PackageManager => {
  // Check for lockfiles to determine package manager
  if (fs.existsSync("bun.lock") || fs.existsSync("bun.lockb")) return "bun";
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";
  // Default to npm for package.json or if no lockfile found
  return "npm";
};

/**
 * Installs js-style-kit and removes overlapping dependencies
 *
 * @param packageManager The package manager to use
 */
const setupDependencies = (packageManager: PackageManager): void => {
  console.info(`Using package manager: ${packageManager}`);

  // Install js-style-kit
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

  try {
    // Remove overlapping dependencies
    const overlappingDeps = ["eslint", "prettier"];
    console.info("Removing overlapping dependencies...");

    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    // Ensure devDependencies exists
    packageJson.devDependencies = packageJson.devDependencies ?? {};

    // Create a new object to avoid direct manipulation
    const newDevDeps = { ...packageJson.devDependencies };
    let hasChanges = false;

    overlappingDeps.forEach((dep) => {
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

/**
 * Updates package.json scripts
 */
const setupScripts = (): void => {
  console.info("Setting up package.json scripts...");

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    // Add or update scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      format: "prettier format",
      "format:check": "prettier format --check",
      lint: "eslint lint",
      "lint:fix": "eslint lint --fix",
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

/**
 * Creates configuration files based on whether the project uses ESM
 *
 * @returns The file extension used for configuration files
 */
const setupConfigFiles = (): Extension => {
  console.info("Creating configuration files...");

  let extension: Extension = ".js";

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const isEsm = packageJson.type === "module";
    extension = isEsm ? ".js" : ".mjs";

    // Create style-kit.config.js/mjs
    const styleConfigContent = `import { eslintConfig, prettierConfig } from "js-style-kit";

export const eslint = eslintConfig({});

export const prettier = prettierConfig({});
`;

    // Create prettier.config.js/mjs
    const prettierConfigContent = `export { prettier as default } from "./style-kit.config${extension}";
`;

    // Create eslint.config.js/mjs
    const eslintConfigContent = `export { eslint as default } from "./style-kit.config${extension}";
`;

    fs.writeFileSync(`style-kit.config${extension}`, styleConfigContent);
    fs.writeFileSync(`prettier.config${extension}`, prettierConfigContent);
    fs.writeFileSync(`eslint.config${extension}`, eslintConfigContent);

    console.info(`Created configuration files with ${extension} extension`);
  } catch (error) {
    console.error("Failed to create configuration files:", error);
    process.exit(1);
  }

  return extension;
};

/**
 * Sets up VS Code settings
 *
 * @param extension - The file extension to use for configuration files
 */
const setupVSCodeSettings = (extension: Extension): void => {
  console.info("Setting up VS Code settings...");

  try {
    const vscodeDir = path.join(process.cwd(), ".vscode");
    const settingsPath = path.join(vscodeDir, "settings.json");

    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir);
    }

    // Read existing settings or create new ones
    let settings: Record<string, unknown> = {};
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    }

    // Update settings
    settings = {
      ...settings,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
      },
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "eslint.runtime": "node",
      "explorer.fileNesting.enabled": true,
    };

    // Add or update file nesting patterns
    if (!settings["explorer.fileNesting.patterns"]) {
      settings["explorer.fileNesting.patterns"] = {};
    }

    // Type assertion to handle the nesting patterns
    const nestingPatterns = settings["explorer.fileNesting.patterns"] as Record<
      string,
      string
    >;
    nestingPatterns[`style-kit.config${extension}`] =
      `eslint.config${extension}, prettier.config${extension}`;

    fs.writeFileSync(
      settingsPath,
      JSON.stringify(settings, null, 2).concat("\n"),
    );
    console.info("VS Code settings updated");
  } catch (error) {
    console.error("Failed to set up VS Code settings:", error);
    process.exit(1);
  }
};

// Main init command
program
  .command("init")
  .description("Initialize project with js-style-kit configurations")
  .action(() => {
    console.info("Initializing js-style-kit...");

    try {
      const packageManager = detectPackageManager();

      // Check if package.json exists
      if (!fs.existsSync("package.json")) {
        console.error(
          "package.json not found. Please initialize your project first.",
        );
        process.exit(1);
      }

      setupDependencies(packageManager);
      setupScripts();
      const extension = setupConfigFiles();
      setupVSCodeSettings(extension);

      const runCmd: Record<PackageManager, string> = {
        bun: "bun run",
        npm: "npm run",
        pnpm: "pnpm run",
        yarn: "yarn",
      };

      console.info("\n✅ js-style-kit initialized successfully!");
      console.info("\nYou can now use the following npm scripts:");
      console.info(
        `  - ${runCmd[packageManager]} lint: Check code for linting issues`,
      );
      console.info(
        `  - ${runCmd[packageManager]} lint:fix: Automatically fix linting issues`,
      );
      console.info(
        `  - ${runCmd[packageManager]} format: Format code with Prettier`,
      );
      console.info(
        `  - ${runCmd[packageManager]} format:check: Check if code is properly formatted`,
      );
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

import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Patch the declaration file of prettier-plugin-tailwindcss to remove the unsafe declare statement
 */
const patchPrettierPluginTailwindcss = () => {
  try {
    console.info("js-style-kit: Starting postinstall patch...");

    // Find the location of prettier-plugin-tailwindcss
    // This will work regardless of where js-style-kit is installed
    let pluginPath;

    // First try from the project root
    const rootPath = path.join(
      "node_modules",
      "prettier-plugin-tailwindcss",
      "dist",
      "index.d.ts",
    );

    // Then try from js-style-kit's directory
    const packagePath = path.join(
      __dirname,
      "..",
      "..",
      "prettier-plugin-tailwindcss",
      "dist",
      "index.d.ts",
    );

    // Choose the path that exists
    if (fs.existsSync(rootPath)) {
      pluginPath = rootPath;
    } else if (fs.existsSync(packagePath)) {
      pluginPath = packagePath;
    } else {
      console.warn(
        "js-style-kit: prettier-plugin-tailwindcss not found, skipping patch",
      );
      return;
    }

    console.info(`js-style-kit: Found plugin at ${pluginPath}`);

    // Create backup of original file if it doesn't exist already
    const backupPath = `${pluginPath}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, fs.readFileSync(pluginPath, "utf8"));
      console.info("js-style-kit: Created backup of original declaration file");
    }

    // Read the file
    const content = fs.readFileSync(pluginPath, "utf8");

    // The exact declare statement to remove
    const declareBlock = `declare module 'prettier' {
    interface RequiredOptions extends PluginOptions {
    }
    interface ParserOptions extends PluginOptions {
    }
}`;

    // Replace the declare block with a comment
    const patchedContent = content.replace(
      declareBlock,
      "// Removed unsafe declare module statement",
    );

    // Only write if content has changed
    if (content !== patchedContent) {
      // Write the patched file back
      fs.writeFileSync(pluginPath, patchedContent);
      console.info(
        "js-style-kit: Successfully patched prettier-plugin-tailwindcss declaration file",
      );
    } else {
      console.info(
        "js-style-kit: No patching needed, declaration block not found or already patched",
      );
    }
  } catch (error) {
    console.error(
      "js-style-kit: Error patching prettier-plugin-tailwindcss:",
      error,
    );
  }
};

// Run the patch function
patchPrettierPluginTailwindcss();

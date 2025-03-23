import * as fs from "node:fs";
import * as path from "node:path";

/**
 * The exact declare statement to remove from the prettier-plugin-tailwindcss declaration file
 * This statement causes conflicts with other Prettier plugins
 */
const DECLARE_BLOCK = `declare module 'prettier' {
    interface RequiredOptions extends PluginOptions {
    }
    interface ParserOptions extends PluginOptions {
    }
}`;

/**
 * Patches the declaration file of prettier-plugin-tailwindcss to remove the unsafe declare statement
 * that can cause conflicts with other Prettier plugins.
 *
 * @returns True if the patch was applied or already in place, false if plugin was not found or error occurred
 */
export const patchTailwindPlugin = (): boolean => {
  try {
    console.info(
      "js-style-kit: Patching prettier-plugin-tailwindcss declaration file...",
    );

    // Find the location of prettier-plugin-tailwindcss
    // This will work regardless of where js-style-kit is installed
    let pluginPath: string | undefined;

    // First try from the project root
    const rootPath = path.join(
      "node_modules",
      "prettier-plugin-tailwindcss",
      "dist",
      "index.d.ts",
    );

    // Then try from js-style-kit's directory
    const packagePath = path.join(
      process.cwd(),
      "node_modules",
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
      return false;
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

    // Check if already patched
    if (!content.includes(DECLARE_BLOCK)) {
      console.info(
        "js-style-kit: No patching needed, declaration block not found or already patched",
      );
      return true;
    }

    // Replace the declare block with a comment
    const patchedContent = content.replace(
      DECLARE_BLOCK,
      "// Removed unsafe declare module statement",
    );

    // Write the patched file back
    fs.writeFileSync(pluginPath, patchedContent);
    console.info(
      "js-style-kit: Successfully patched prettier-plugin-tailwindcss declaration file",
    );

    return true;
  } catch (error) {
    console.error(
      "js-style-kit: Error patching prettier-plugin-tailwindcss:",
      error,
    );
    return false;
  }
};

patchTailwindPlugin();

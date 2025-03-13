import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Patch the declaration file of prettier-plugin-tailwindcss to remove the unsafe declare statement
 */
const patchPrettierPluginTailwindcss = () => {
  try {
    // Path to the declaration file with the unsafe declare statement
    const pluginPath = path.join(
      process.cwd(),
      "node_modules/prettier-plugin-tailwindcss/dist/index.d.ts",
    );

    if (!fs.existsSync(pluginPath)) {
      console.warn("prettier-plugin-tailwindcss not found, skipping patch");
      return;
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

    // Write the patched file back
    fs.writeFileSync(pluginPath, patchedContent);
    console.info(
      "js-style-kit: Successfully patched prettier-plugin-tailwindcss declaration file",
    );
  } catch (error) {
    console.error(
      "js-style-kit: Error patching prettier-plugin-tailwindcss:",
      error,
    );
  }
};

patchPrettierPluginTailwindcss();

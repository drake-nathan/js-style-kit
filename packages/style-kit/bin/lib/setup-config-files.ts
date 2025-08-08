import fs from "node:fs";

import type { Extension } from "./types.js";

/**
 * Creates configuration files based on whether the project uses ESM
 *
 * @returns The file extension used for configuration files
 */
export const setupConfigFiles = (): Extension => {
  console.info("Creating configuration files...");

  let extension: Extension = ".js";

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const isEsm = packageJson.type === "module";
    extension = isEsm ? ".js" : ".mjs";

    // Create prettier.config.js/mjs
    const prettierConfigContent = `//@ts-check
import { prettierConfig } from "js-style-kit";

export default prettierConfig({});
    `;

    // Create eslint.config.js/mjs
    const eslintConfigContent = `//@ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig({});
    `;

    fs.writeFileSync(`prettier.config${extension}`, prettierConfigContent);
    fs.writeFileSync(`eslint.config${extension}`, eslintConfigContent);
    console.info(`Created configuration files with ${extension} extension`);
  } catch (error) {
    console.error("Failed to create configuration files:", error);
    process.exit(1);
  }

  return extension;
};

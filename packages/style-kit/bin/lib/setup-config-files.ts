import fs from "node:fs";

import type { Extension } from "./types.js";

import { detectVitePlus } from "./detect-vite-plus.js";

const OXLINT_CONFIG = `import { styleKit } from "js-style-kit";

export default styleKit({}).oxlint;
`;

const OXFMT_CONFIG = `import { styleKit } from "js-style-kit";

export default styleKit({}).oxfmt;
`;

const VITE_PLUS_INSTRUCTIONS = `
Vite+ detected — skipping standalone config files.

Add this to your vite.config.ts:

  import { defineConfig } from "vite-plus";
  import { styleKit } from "js-style-kit";

  const { oxlint, oxfmt } = styleKit({});

  export default defineConfig({
    lint: oxlint,
    format: oxfmt,
  });
`;

/**
 * Writes oxlint.config.ts and oxfmt.config.ts in the cwd, or — when
 * Vite+ is detected — prints instructions for adding the inline
 * styleKit() call to the user's vite.config.ts.
 *
 * @returns The file extension used for written config files, or
 *   `null` when nothing was written (Vite+ path).
 */
export const setupConfigFiles = (): Extension | null => {
  if (detectVitePlus()) {
    console.info(VITE_PLUS_INSTRUCTIONS);
    return null;
  }

  console.info("Creating configuration files...");

  try {
    fs.writeFileSync("oxlint.config.ts", OXLINT_CONFIG);
    fs.writeFileSync("oxfmt.config.ts", OXFMT_CONFIG);
    console.info("Created oxlint.config.ts and oxfmt.config.ts");
    return ".ts";
  } catch (error) {
    console.error("Failed to create configuration files:", error);
    process.exit(1);
  }
};

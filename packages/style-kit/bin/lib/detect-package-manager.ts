import fs from "node:fs";

import type { PackageManager } from "./types.js";

/**
 * Detects the package manager being used in the project
 *
 * @returns The detected package manager or fallback to npm
 */
export const detectPackageManager = (): PackageManager => {
  try {
    // Check for lockfiles to determine package manager
    if (fs.existsSync("bun.lock") || fs.existsSync("bun.lockb")) {
      return "bun";
    }
    if (fs.existsSync("pnpm-lock.yaml")) {
      return "pnpm";
    }
    if (fs.existsSync("yarn.lock")) {
      return "yarn";
    }
  } catch {
    // If file system access fails, fall through to default
  }

  // Default to npm for package.json or if no lockfile found
  return "npm";
};

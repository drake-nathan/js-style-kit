import fs from "node:fs";

/**
 * Detect whether the current project is using Vite+. We look for any
 * known Vite+ package in the project's `dependencies` or
 * `devDependencies`. If found, the CLI emits inline-instruction output
 * instead of writing standalone `oxlint.config.ts` / `oxfmt.config.ts`
 * files.
 */
export const detectVitePlus = (): boolean => {
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    };
    return (
      "vite-plus" in allDeps ||
      Object.keys(allDeps).some((d) => d.startsWith("@viteplus/"))
    );
  } catch {
    return false;
  }
};

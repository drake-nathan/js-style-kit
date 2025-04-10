import type { Rule } from "eslint";

import fastGlob from "fast-glob";

/**
 * Process a Next.js root directory glob.
 */
const processRootDir = (rootDir: string): string[] => {
  return fastGlob.globSync(rootDir.replaceAll("\\", "/"), {
    onlyDirectories: true,
  });
};

/**
 * Gets one or more Root, returns an array of root directories.
 */
export const getRootDirs = (context: Rule.RuleContext) => {
  let rootDirs = [context.cwd];

  const nextSettings: { rootDir?: string | string[] } =
    context.settings.next || {};
  const rootDir = nextSettings.rootDir;

  if (typeof rootDir === "string") {
    rootDirs = processRootDir(rootDir);
  } else if (Array.isArray(rootDir)) {
    rootDirs = rootDir
      .map((dir) => (typeof dir === "string" ? processRootDir(dir) : []))
      .flat();
  }

  return rootDirs;
};

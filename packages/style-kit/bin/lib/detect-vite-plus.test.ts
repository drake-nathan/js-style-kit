import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { detectVitePlus } from "./detect-vite-plus.js";

const fixture = (pkg: object): string => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stylekit-vp-"));
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));
  return dir;
};

describe("detectVitePlus", () => {
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("false when no Vite+ packages are present", () => {
    process.chdir(fixture({ name: "test", devDependencies: { vite: "*" } }));
    expect(detectVitePlus()).toBe(false);
  });

  it("true when vite-plus is in devDependencies", () => {
    process.chdir(
      fixture({ name: "test", devDependencies: { "vite-plus": "*" } }),
    );
    expect(detectVitePlus()).toBe(true);
  });

  it("true when @viteplus/* package is present", () => {
    process.chdir(
      fixture({
        name: "test",
        dependencies: { "@viteplus/core": "*" },
      }),
    );
    expect(detectVitePlus()).toBe(true);
  });

  it("false when no package.json exists", () => {
    process.chdir(fs.mkdtempSync(path.join(os.tmpdir(), "stylekit-empty-")));
    expect(detectVitePlus()).toBe(false);
  });
});

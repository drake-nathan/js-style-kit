import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { setupConfigFiles } from "./setup-config-files.js";

const fixture = (pkg: object): string => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stylekit-cfg-"));
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));
  return dir;
};

describe("setupConfigFiles", () => {
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("writes oxlint.config.ts and oxfmt.config.ts in a non-Vite+ project", () => {
    const dir = fixture({ name: "test" });
    process.chdir(dir);

    const ext = setupConfigFiles();

    expect(ext).toBe(".ts");
    const oxlint = fs.readFileSync(path.join(dir, "oxlint.config.ts"), "utf8");
    const oxfmt = fs.readFileSync(path.join(dir, "oxfmt.config.ts"), "utf8");
    expect(oxlint).toContain("styleKit");
    expect(oxlint).toContain(".oxlint");
    expect(oxfmt).toContain(".oxfmt");
  });

  it("skips writing files when Vite+ is detected", () => {
    const dir = fixture({
      name: "test",
      devDependencies: { "vite-plus": "*" },
    });
    process.chdir(dir);

    const ext = setupConfigFiles();

    expect(ext).toBe(null);
    expect(fs.existsSync(path.join(dir, "oxlint.config.ts"))).toBe(false);
    expect(fs.existsSync(path.join(dir, "oxfmt.config.ts"))).toBe(false);
  });
});

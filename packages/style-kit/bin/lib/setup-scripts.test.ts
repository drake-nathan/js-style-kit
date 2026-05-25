import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { setupScripts } from "./setup-scripts.js";

describe("setupScripts", () => {
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("writes oxlint and oxfmt scripts to package.json", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stylekit-scripts-"));
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({ name: "test", scripts: { dev: "vite" } }),
    );
    process.chdir(dir);

    setupScripts();

    const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    expect(pkg.scripts.lint).toContain("oxlint");
    expect(pkg.scripts["lint:fix"]).toContain("oxlint");
    expect(pkg.scripts.format).toContain("oxfmt");
    expect(pkg.scripts["format:check"]).toContain("oxfmt");
    // existing scripts are preserved
    expect(pkg.scripts.dev).toBe("vite");
  });
});

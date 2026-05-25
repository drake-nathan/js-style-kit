import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { setupVSCodeSettings } from "./setup-vscode-settings.js";

describe("setupVSCodeSettings", () => {
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("creates .vscode/settings.json with oxc actions when nothing exists", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stylekit-vscode-"));
    process.chdir(dir);

    setupVSCodeSettings();

    const settings = JSON.parse(
      fs.readFileSync(path.join(dir, ".vscode/settings.json"), "utf8"),
    );
    expect(
      (settings["editor.codeActionsOnSave"] as Record<string, string>)[
        "source.fixAll.oxc"
      ],
    ).toBe("explicit");
    expect(settings["oxc.enable"]).toBe(true);
    expect(settings["editor.formatOnSave"]).toBe(true);
  });

  it("drops the legacy source.fixAll.eslint action on migration", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stylekit-vscode-"));
    fs.mkdirSync(path.join(dir, ".vscode"));
    fs.writeFileSync(
      path.join(dir, ".vscode/settings.json"),
      JSON.stringify({
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit",
          "source.organizeImports": "explicit",
        },
        existing: "keep me",
      }),
    );
    process.chdir(dir);

    setupVSCodeSettings();

    const settings = JSON.parse(
      fs.readFileSync(path.join(dir, ".vscode/settings.json"), "utf8"),
    );
    const actions = settings["editor.codeActionsOnSave"] as Record<
      string,
      string
    >;
    expect(actions["source.fixAll.eslint"]).toBeUndefined();
    expect(actions["source.fixAll.oxc"]).toBe("explicit");
    expect(actions["source.organizeImports"]).toBe("explicit");
    // unrelated existing settings are preserved
    expect(settings.existing).toBe("keep me");
  });
});

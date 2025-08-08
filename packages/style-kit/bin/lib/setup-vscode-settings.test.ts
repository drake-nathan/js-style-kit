/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable perfectionist/sort-objects */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import fs from "node:fs";
import path from "node:path";

import { setupVSCodeSettings } from "./setup-vscode-settings.js";

describe("setupVSCodeSettings", () => {
  // Store original implementations
  let originalCwd: () => string;
  let originalExit: (code?: number) => never;
  let originalConsoleInfo: (...args: any[]) => void;
  let originalConsoleError: (...args: any[]) => void;

  beforeEach(() => {
    // Store original implementations
    originalCwd = process.cwd;
    originalExit = process.exit;
    originalConsoleInfo = console.info;
    originalConsoleError = console.error;

    // Mock process methods
    process.cwd = mock(() => "/test/project");
    process.exit = mock(() => {
      throw new Error("process.exit called");
    }) as any;

    // Mock console methods
    console.info = mock();
    console.error = mock();
  });

  afterEach(() => {
    // Restore original implementations
    process.cwd = originalCwd;
    process.exit = originalExit;
    console.info = originalConsoleInfo;
    console.error = originalConsoleError;

    // Clear all mocks
    mock.restore();
  });

  it("should create .vscode directory and settings.json when they don't exist", () => {
    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);
    const mkdirSyncSpy = spyOn(fs, "mkdirSync").mockImplementation(() => {});
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupVSCodeSettings();

    expect(console.info).toHaveBeenCalledWith("Setting up VS Code settings...");
    expect(mkdirSyncSpy).toHaveBeenCalledWith("/test/project/.vscode");

    const expectedSettings = {
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
      },
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "eslint.runtime": "node",
      "tailwindCSS.classFunctions": ["cn", "cva", "clsx"],
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "/test/project/.vscode/settings.json",
      JSON.stringify(expectedSettings, null, 2).concat("\n"),
    );
    expect(console.info).toHaveBeenCalledWith("VS Code settings updated");
  });

  it("should skip directory creation when .vscode already exists", () => {
    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    const mkdirSyncSpy = spyOn(fs, "mkdirSync").mockImplementation(() => {});
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupVSCodeSettings();

    expect(mkdirSyncSpy).not.toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it("should merge with existing settings.json when it exists", () => {
    const existingSettings = {
      "custom.setting": "value",
      "editor.formatOnSave": false,
      "editor.tabSize": 2,
    };

    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(existingSettings),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupVSCodeSettings();

    const expectedSettings = {
      "custom.setting": "value",
      "editor.formatOnSave": true,
      "editor.tabSize": 2,
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
      },
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "eslint.runtime": "node",
      "tailwindCSS.classFunctions": ["cn", "cva", "clsx"],
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "/test/project/.vscode/settings.json",
      JSON.stringify(expectedSettings, null, 2).concat("\n"),
    );
  });

  it("should overwrite conflicting settings", () => {
    const existingSettings = {
      "editor.defaultFormatter": "other-formatter",
      "editor.formatOnSave": false,
      "eslint.runtime": "bun",
    };

    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(existingSettings),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupVSCodeSettings();

    const expectedSettings = {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "eslint.runtime": "node",
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
      },
      "tailwindCSS.classFunctions": ["cn", "cva", "clsx"],
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "/test/project/.vscode/settings.json",
      JSON.stringify(expectedSettings, null, 2).concat("\n"),
    );
  });

  it("should handle invalid JSON in existing settings.json", () => {
    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      "invalid json",
    );

    expect(() => {
      setupVSCodeSettings();
    }).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      "Failed to set up VS Code settings:",
      expect.any(Error),
    );
  });

  it("should handle file read error and exit process", () => {
    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("Permission denied");
    });

    expect(() => {
      setupVSCodeSettings();
    }).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      "Failed to set up VS Code settings:",
      expect.any(Error),
    );
  });

  it("should handle directory creation error and exit process", () => {
    const existsSyncSpy = spyOn(fs, "existsSync").mockReturnValueOnce(false);
    const mkdirSyncSpy = spyOn(fs, "mkdirSync").mockImplementation(() => {
      throw new Error("Permission denied");
    });

    expect(() => {
      setupVSCodeSettings();
    }).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      "Failed to set up VS Code settings:",
      expect.any(Error),
    );
  });

  it("should handle file write error and exit process", () => {
    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);
    const mkdirSyncSpy = spyOn(fs, "mkdirSync").mockImplementation(() => {});
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {
        throw new Error("Disk full");
      },
    );

    expect(() => {
      setupVSCodeSettings();
    }).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      "Failed to set up VS Code settings:",
      expect.any(Error),
    );
  });

  it("should handle empty existing settings.json", () => {
    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue("{}");
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupVSCodeSettings();

    const expectedSettings = {
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
      },
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "eslint.runtime": "node",
      "tailwindCSS.classFunctions": ["cn", "cva", "clsx"],
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "/test/project/.vscode/settings.json",
      JSON.stringify(expectedSettings, null, 2).concat("\n"),
    );
  });

  it("should preserve nested objects in existing settings", () => {
    const existingSettings = {
      "editor.codeActionsOnSave": {
        "source.organizeImports": "explicit",
      },
      "other.nested.setting": {
        key: "value",
      },
    };

    const existsSyncSpy = spyOn(fs, "existsSync")
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(existingSettings),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupVSCodeSettings();

    const expectedSettings = {
      "editor.codeActionsOnSave": {
        "source.organizeImports": "explicit",
        "source.fixAll.eslint": "explicit",
      },
      "other.nested.setting": {
        key: "value",
      },
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "eslint.runtime": "node",
      "tailwindCSS.classFunctions": ["cn", "cva", "clsx"],
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "/test/project/.vscode/settings.json",
      JSON.stringify(expectedSettings, null, 2).concat("\n"),
    );
  });
});

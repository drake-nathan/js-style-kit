/* eslint-disable perfectionist/sort-objects */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
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

import { setupScripts } from "./setup-scripts.js";

describe("setupScripts", () => {
  // Store original implementations
  let originalExit: (code?: number) => never;
  let originalConsoleInfo: (...args: any[]) => void;
  let originalConsoleError: (...args: any[]) => void;

  beforeEach(() => {
    // Store original implementations
    originalExit = process.exit;
    originalConsoleInfo = console.info;
    originalConsoleError = console.error;

    // Mock process methods
    process.exit = mock(() => {
      throw new Error("process.exit called");
    }) as any;

    // Mock console methods
    console.info = mock();
    console.error = mock();
  });

  afterEach(() => {
    // Restore original implementations
    process.exit = originalExit;
    console.info = originalConsoleInfo;
    console.error = originalConsoleError;

    // Clean up mocks
    mock.restore();
  });

  it("should add scripts to package.json", () => {
    const mockPackageJson = {
      name: "test-package",
      scripts: {
        test: "echo test",
      },
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupScripts();

    const expectedPackageJson = {
      name: "test-package",
      scripts: {
        test: "echo test",
        format: "prettier . --write --cache",
        "format:check": "prettier . --check --cache",
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
      },
    };

    expect(console.info).toHaveBeenCalledWith(
      "Setting up package.json scripts...",
    );
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "package.json",
      JSON.stringify(expectedPackageJson, null, 2).concat("\n"),
    );
    expect(console.info).toHaveBeenCalledWith("Scripts added to package.json");
  });

  it("should handle package.json without existing scripts field", () => {
    const mockPackageJson = {
      name: "test-package",
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupScripts();

    const expectedPackageJson = {
      name: "test-package",
      scripts: {
        format: "prettier . --write --cache",
        "format:check": "prettier . --check --cache",
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
      },
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "package.json",
      JSON.stringify(expectedPackageJson, null, 2).concat("\n"),
    );
  });

  it("should overwrite existing scripts with same names", () => {
    const mockPackageJson = {
      name: "test-package",
      scripts: {
        format: "old-format-command",
        lint: "old-lint-command",
        test: "echo test",
      },
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupScripts();

    const expectedPackageJson = {
      name: "test-package",
      scripts: {
        format: "prettier . --write --cache",
        lint: "eslint .",
        test: "echo test",
        "format:check": "prettier . --check --cache",
        "lint:fix": "eslint . --fix",
      },
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "package.json",
      JSON.stringify(expectedPackageJson, null, 2).concat("\n"),
    );
  });

  it("should preserve other existing scripts", () => {
    const mockPackageJson = {
      name: "test-package",
      scripts: {
        build: "webpack",
        custom: "custom-command",
        start: "node server.js",
        test: "echo test",
      },
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupScripts();

    const expectedPackageJson = {
      name: "test-package",
      scripts: {
        build: "webpack",
        custom: "custom-command",
        start: "node server.js",
        test: "echo test",
        format: "prettier . --write --cache",
        "format:check": "prettier . --check --cache",
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
      },
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "package.json",
      JSON.stringify(expectedPackageJson, null, 2).concat("\n"),
    );
  });

  it("should handle file read error and exit process", () => {
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("Failed to read package.json");
    });

    expect(() => {
      setupScripts();
    }).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      "Failed to update package.json scripts:",
      expect.any(Error),
    );
  });

  it("should handle file write error and exit process", () => {
    const mockPackageJson = {
      name: "test-package",
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {
        throw new Error("Failed to write package.json");
      },
    );

    expect(() => {
      setupScripts();
    }).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      "Failed to update package.json scripts:",
      expect.any(Error),
    );
  });

  it("should handle invalid JSON in package.json and exit process", () => {
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      "invalid json",
    );

    expect(() => {
      setupScripts();
    }).toThrow("process.exit called");
    expect(console.error).toHaveBeenCalledWith(
      "Failed to update package.json scripts:",
      expect.any(Error),
    );
  });

  it("should handle empty package.json file", () => {
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue("{}");
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );

    setupScripts();

    const expectedPackageJson = {
      scripts: {
        format: "prettier . --write --cache",
        "format:check": "prettier . --check --cache",
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
      },
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "package.json",
      JSON.stringify(expectedPackageJson, null, 2).concat("\n"),
    );
  });
});

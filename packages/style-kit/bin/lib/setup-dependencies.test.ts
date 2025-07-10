import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { execSync } from "node:child_process";
import fs from "node:fs";

import { getDependencies } from "./get-dependencies.js";
import { setupDependencies } from "./setup-dependencies.js";

// Mock modules
const mockExecSync = mock();
const mockFsReadFileSync = mock();
const mockFsWriteFileSync = mock();
const mockGetDependencies = mock();
const mockConsoleInfo = mock();
const mockConsoleError = mock();
const mockProcessExit = mock();

// Mock the modules at the top level
mock.module("node:child_process", () => ({
  execSync: mockExecSync,
}));

mock.module("node:fs", () => ({
  default: {
    readFileSync: mockFsReadFileSync,
    writeFileSync: mockFsWriteFileSync,
  },
  readFileSync: mockFsReadFileSync,
  writeFileSync: mockFsWriteFileSync,
}));

mock.module("./get-dependencies.js", () => ({
  getDependencies: mockGetDependencies,
}));

const originalConsole = console;
const originalProcess = process;

describe("setupDependencies", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockExecSync.mockReset();
    mockFsReadFileSync.mockReset();
    mockFsWriteFileSync.mockReset();
    mockGetDependencies.mockReset();
    mockConsoleInfo.mockReset();
    mockConsoleError.mockReset();
    mockProcessExit.mockReset();

    // Mock console and process
    console.info = mockConsoleInfo;
    console.error = mockConsoleError;
    process.exit = mockProcessExit;
  });

  afterEach(() => {
    // Restore console and process
    console.info = originalConsole.info;
    console.error = originalConsole.error;
    process.exit = originalProcess.exit;
  });

  it("should install js-style-kit with bun when not in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGetDependencies.mockReturnValue([]);

    setupDependencies("bun", false);

    expect(mockConsole.info).toHaveBeenCalledWith("Using package manager: bun");
    expect(mockConsole.info).toHaveBeenCalledWith("Installing js-style-kit...");
    expect(mockExecSync).toHaveBeenCalledWith("bun add --dev js-style-kit", {
      stdio: "inherit",
    });
  });

  it("should install js-style-kit with npm when not in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGetDependencies.mockReturnValue([]);

    setupDependencies("npm", false);

    expect(mockExecSync).toHaveBeenCalledWith(
      "npm install --save-dev js-style-kit",
      { stdio: "inherit" },
    );
  });

  it("should install js-style-kit with pnpm when not in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGetDependencies.mockReturnValue([]);

    setupDependencies("pnpm", false);

    expect(mockExecSync).toHaveBeenCalledWith(
      "pnpm add --save-dev js-style-kit",
      {
        stdio: "inherit",
      },
    );
  });

  it("should install js-style-kit with yarn when not in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGetDependencies.mockReturnValue([]);

    setupDependencies("yarn", false);

    expect(mockExecSync).toHaveBeenCalledWith("yarn add --dev js-style-kit", {
      stdio: "inherit",
    });
  });

  it("should skip installation in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGetDependencies.mockReturnValue([]);

    setupDependencies("npm", true);

    expect(mockConsole.info).toHaveBeenCalledWith(
      "Would install js-style-kit (dry run)",
    );
    expect(mockExecSync).not.toHaveBeenCalled();
  });

  it("should remove overlapping dependencies from both dependencies and devDependencies", () => {
    const mockPackageJson = {
      dependencies: {
        eslint: "^8.0.0",
        "some-other-dep": "^1.0.0",
      },
      devDependencies: {
        prettier: "^3.0.0",
        "some-dev-dep": "^1.0.0",
      },
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGetDependencies.mockReturnValue(["eslint", "prettier"]);

    setupDependencies("npm", true);

    const expectedUpdatedPackageJson = {
      dependencies: {
        "some-other-dep": "^1.0.0",
      },
      devDependencies: {
        "some-dev-dep": "^1.0.0",
      },
    };

    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "package.json",
      JSON.stringify(expectedUpdatedPackageJson, null, 2).concat("\n"),
    );
    expect(mockConsole.info).toHaveBeenCalledWith(
      "Removed eslint from dependencies",
    );
    expect(mockConsole.info).toHaveBeenCalledWith(
      "Removed prettier from devDependencies",
    );
  });

  it("should handle missing dependencies and devDependencies fields in package.json", () => {
    const mockPackageJson = {};

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGetDependencies.mockReturnValue(["eslint"]);

    setupDependencies("npm", true);

    // Should not throw error and should not write file since no changes were made
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
  });

  it("should not write package.json if no overlapping dependencies are found", () => {
    const mockPackageJson = {
      dependencies: {
        "some-other-dep": "^1.0.0",
      },
      devDependencies: {
        "some-dev-dep": "^1.0.0",
      },
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockGetDependencies.mockReturnValue(["eslint", "prettier"]);

    setupDependencies("npm", true);

    // No overlapping dependencies, so no changes should be made
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
  });

  it("should handle getDependencies error and exit process", () => {
    mockGetDependencies.mockImplementation(() => {
      throw new Error("Failed to get dependencies");
    });

    setupDependencies("npm", true);

    expect(mockConsole.error).toHaveBeenCalledWith(
      "Failed to install dependencies:",
      expect.any(Error),
    );
    expect(mockProcess.exit).toHaveBeenCalledWith(1);
  });

  it("should handle package.json read error and exit process", () => {
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error("Failed to read package.json");
    });
    mockGetDependencies.mockReturnValue([]);

    setupDependencies("npm", true);

    expect(mockConsole.error).toHaveBeenCalledWith(
      "Failed to install dependencies:",
      expect.any(Error),
    );
    expect(mockProcess.exit).toHaveBeenCalledWith(1);
  });

  it("should handle package.json write error and exit process", () => {
    const mockPackageJson = {
      dependencies: {
        eslint: "^8.0.0",
      },
      devDependencies: {},
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockFs.writeFileSync.mockImplementation(() => {
      throw new Error("Failed to write package.json");
    });
    mockGetDependencies.mockReturnValue(["eslint"]);

    setupDependencies("npm", true);

    expect(mockConsole.error).toHaveBeenCalledWith(
      "Failed to install dependencies:",
      expect.any(Error),
    );
    expect(mockProcess.exit).toHaveBeenCalledWith(1);
  });

  it("should handle invalid JSON in package.json and exit process", () => {
    mockFs.readFileSync.mockReturnValue("invalid json");
    mockGetDependencies.mockReturnValue([]);

    setupDependencies("npm", true);

    expect(mockConsole.error).toHaveBeenCalledWith(
      "Failed to install dependencies:",
      expect.any(Error),
    );
    expect(mockProcess.exit).toHaveBeenCalledWith(1);
  });
});

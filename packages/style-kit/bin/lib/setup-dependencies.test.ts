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
import * as childProcess from "node:child_process";
import fs from "node:fs";

import * as getDependenciesModule from "./get-dependencies.js";
import { setupDependencies } from "./setup-dependencies.js";

describe("setupDependencies", () => {
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

    // Clean up mocks and restore spies
    mock.restore();
  });

  it("should install js-style-kit with bun when not in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue([]);

    setupDependencies("bun", false);

    expect(console.info).toHaveBeenCalledWith("Using package manager: bun");
    expect(console.info).toHaveBeenCalledWith("Installing js-style-kit...");
    expect(execSyncSpy).toHaveBeenCalledWith("bun add --dev js-style-kit", {
      stdio: "inherit",
    });
  });

  it("should install js-style-kit with npm when not in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue([]);

    setupDependencies("npm", false);

    expect(execSyncSpy).toHaveBeenCalledWith(
      "npm install --save-dev js-style-kit",
      { stdio: "inherit" },
    );
  });

  it("should install js-style-kit with pnpm when not in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue([]);

    setupDependencies("pnpm", false);

    expect(execSyncSpy).toHaveBeenCalledWith(
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

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue([]);

    setupDependencies("yarn", false);

    expect(execSyncSpy).toHaveBeenCalledWith("yarn add --dev js-style-kit", {
      stdio: "inherit",
    });
  });

  it("should skip installation in dry run mode", () => {
    const mockPackageJson = {
      dependencies: {},
      devDependencies: {},
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue([]);

    setupDependencies("npm", true);

    expect(console.info).toHaveBeenCalledWith(
      "Would install js-style-kit (dry run)",
    );
    expect(execSyncSpy).not.toHaveBeenCalled();
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

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {},
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue(["eslint", "prettier"]);

    setupDependencies("npm", true);

    const expectedUpdatedPackageJson = {
      dependencies: {
        "some-other-dep": "^1.0.0",
      },
      devDependencies: {
        "some-dev-dep": "^1.0.0",
      },
    };

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      "package.json",
      JSON.stringify(expectedUpdatedPackageJson, null, 2).concat("\n"),
    );
    expect(console.info).toHaveBeenCalledWith(
      "Removed eslint from dependencies",
    );
    expect(console.info).toHaveBeenCalledWith(
      "Removed prettier from devDependencies",
    );
  });

  it("should handle missing dependencies and devDependencies fields in package.json", () => {
    const mockPackageJson = {};

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    let wasWriteFileCalled = false;
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {
        wasWriteFileCalled = true;
      },
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue(["eslint"]);

    setupDependencies("npm", true);

    // Should not throw error and should not write file since no changes were made
    expect(wasWriteFileCalled).toBe(false);

    // Clean up spies for this test
    readFileSyncSpy.mockRestore();
    writeFileSyncSpy.mockRestore();
    execSyncSpy.mockRestore();
    getDependenciesSpy.mockRestore();
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

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    let wasWriteFileCalled = false;
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {
        wasWriteFileCalled = true;
      },
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue(["eslint", "prettier"]);

    setupDependencies("npm", true);

    // No overlapping dependencies, so no changes should be made
    expect(wasWriteFileCalled).toBe(false);

    // Clean up spies for this test
    readFileSyncSpy.mockRestore();
    writeFileSyncSpy.mockRestore();
    execSyncSpy.mockRestore();
    getDependenciesSpy.mockRestore();
  });

  it("should handle getDependencies error and exit process", () => {
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockImplementation(() => {
      throw new Error("Failed to get dependencies");
    });

    expect(() => {
      setupDependencies("npm", true);
    }).toThrow("process.exit called");

    expect(console.error).toHaveBeenCalledWith(
      "Failed to install dependencies:",
      expect.any(Error),
    );
  });

  it("should handle package.json read error and exit process", () => {
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("Failed to read package.json");
    });
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue([]);

    expect(() => {
      setupDependencies("npm", true);
    }).toThrow("process.exit called");

    expect(console.error).toHaveBeenCalledWith(
      "Failed to install dependencies:",
      expect.any(Error),
    );
  });

  it("should handle package.json write error and exit process", () => {
    const mockPackageJson = {
      dependencies: {
        eslint: "^8.0.0",
      },
      devDependencies: {},
    };

    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify(mockPackageJson),
    );
    const writeFileSyncSpy = spyOn(fs, "writeFileSync").mockImplementation(
      () => {
        throw new Error("Failed to write package.json");
      },
    );
    const execSyncSpy = spyOn(childProcess, "execSync").mockImplementation(
      () => {},
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue(["eslint"]);

    expect(() => {
      setupDependencies("npm", true);
    }).toThrow("process.exit called");

    expect(console.error).toHaveBeenCalledWith(
      "Failed to install dependencies:",
      expect.any(Error),
    );
  });

  it("should handle invalid JSON in package.json and exit process", () => {
    const readFileSyncSpy = spyOn(fs, "readFileSync").mockReturnValue(
      "invalid json",
    );
    const getDependenciesSpy = spyOn(
      getDependenciesModule,
      "getDependencies",
    ).mockReturnValue([]);

    expect(() => {
      setupDependencies("npm", true);
    }).toThrow("process.exit called");

    expect(console.error).toHaveBeenCalledWith(
      "Failed to install dependencies:",
      expect.any(Error),
    );
  });
});

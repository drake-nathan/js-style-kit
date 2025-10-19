import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import fs from "node:fs";
import path from "node:path";

import { getDependencies } from "./get-dependencies.js";

// Mock fs module
const mockFs = {
  existsSync: mock(),
  readFileSync: mock(),
};

// Mock console methods to avoid cluttering test output
const mockConsole = {
  info: mock(),
  warn: mock(),
};

describe("getDependencies", () => {
  const originalFs = { ...fs };
  const originalConsole = { ...console };

  beforeEach(() => {
    // Reset all mocks before each test
    mockFs.existsSync.mockReset();
    mockFs.readFileSync.mockReset();
    mockConsole.info.mockReset();
    mockConsole.warn.mockReset();

    // Mock the fs module
    Object.assign(fs, mockFs);

    // Mock console methods
    Object.assign(console, mockConsole);
  });

  afterEach(() => {
    // Restore original implementations
    Object.assign(fs, originalFs);
    Object.assign(console, originalConsole);
  });

  it("should return dependencies from node_modules package.json when file exists", () => {
    const mockPackageJson = {
      dependencies: {
        "@typescript-eslint/parser": "^6.0.0",
        eslint: "^8.0.0",
        prettier: "^3.0.0",
      },
    };

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = getDependencies();

    expect(result).toStrictEqual([
      "@typescript-eslint/parser",
      "eslint",
      "prettier",
    ]);
    expect(mockFs.existsSync).toHaveBeenCalledWith(
      path.join(process.cwd(), "node_modules", "js-style-kit", "package.json"),
    );
    expect(mockConsole.info).toHaveBeenCalledWith(
      "Found 3 dependencies in js-style-kit to remove",
    );
  });

  it("should return empty array when node_modules package.json has no dependencies", () => {
    const mockPackageJson = {};

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = getDependencies();

    expect(result).toStrictEqual([]);
    expect(mockConsole.info).toHaveBeenCalledWith(
      "Found 0 dependencies in js-style-kit to remove",
    );
  });

  it("should return empty array when dependencies is null", () => {
    const mockPackageJson = {
      dependencies: null,
    };

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = getDependencies();

    expect(result).toStrictEqual([]);
    expect(mockConsole.info).toHaveBeenCalledWith(
      "Found 0 dependencies in js-style-kit to remove",
    );
  });

  it("should return fallback list when node_modules package.json does not exist", () => {
    mockFs.existsSync.mockReturnValue(false);

    const result = getDependencies();

    // Check that it returns the fallback list (should contain expected dependencies)
    expect(result).toContain("eslint");
    expect(result).toContain("prettier");
    expect(result).toContain("typescript-eslint");

    expect(mockFs.existsSync).toHaveBeenCalled();
    expect(mockFs.readFileSync).not.toHaveBeenCalled();
  });

  it("should return fallback list when reading package.json throws an error", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error("File read error");
    });

    const result = getDependencies();

    // Should return fallback list
    expect(result).toContain("eslint");
    expect(result).toContain("prettier");

    expect(mockConsole.warn).toHaveBeenCalledWith(
      "Could not read js-style-kit package.json from node_modules, using fallback list",
    );
  });

  it("should return fallback list when package.json contains invalid JSON", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue("invalid json content");

    const result = getDependencies();

    // Should return fallback list
    expect(result).toContain("eslint");
    expect(result).toContain("prettier");

    expect(mockConsole.warn).toHaveBeenCalledWith(
      "Could not read js-style-kit package.json from node_modules, using fallback list",
    );
  });

  it("should handle file system access errors gracefully", () => {
    mockFs.existsSync.mockImplementation(() => {
      throw new Error("Permission denied");
    });

    const result = getDependencies();

    // Should return fallback list when existsSync throws
    expect(result).toContain("eslint");
    expect(result).toContain("prettier");

    expect(mockConsole.warn).toHaveBeenCalledWith(
      "Could not read js-style-kit package.json from node_modules, using fallback list",
    );
  });
});

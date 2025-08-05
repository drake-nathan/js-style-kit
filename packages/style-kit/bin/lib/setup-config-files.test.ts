import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import fs from "node:fs";

import { setupConfigFiles } from "./setup-config-files.js";

// Mock modules
const mockFs = {
  readFileSync: mock(),
  writeFileSync: mock(),
};
const mockConsole = {
  error: mock(),
  info: mock(),
};
const mockProcess = {
  exit: mock(),
};

describe("setupConfigFiles", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockFs.readFileSync.mockReset();
    mockFs.writeFileSync.mockReset();
    mockConsole.info.mockReset();
    mockConsole.error.mockReset();
    mockProcess.exit.mockReset();

    // Mock the modules
    Object.assign(fs, mockFs);
    Object.assign(console, mockConsole);
    Object.assign(process, mockProcess);
  });

  afterEach(() => {
    // Clean up mocks
    mock.restore();
  });

  it("should create .mjs config files when project is not ESM", () => {
    const mockPackageJson = {
      name: "test-package",
      type: "commonjs",
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = setupConfigFiles();

    expect(result).toBe(".mjs");
    expect(mockConsole.info).toHaveBeenCalledWith(
      "Creating configuration files...",
    );
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "prettier.config.mjs",
      expect.stringContaining('import { prettierConfig } from "js-style-kit";'),
    );
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "eslint.config.mjs",
      expect.stringContaining('import { eslintConfig } from "js-style-kit";'),
    );
    expect(mockConsole.info).toHaveBeenCalledWith(
      "Created configuration files with .mjs extension",
    );
  });

  it("should create .js config files when project is ESM", () => {
    const mockPackageJson = {
      name: "test-package",
      type: "module",
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = setupConfigFiles();

    expect(result).toBe(".js");
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "prettier.config.js",
      expect.stringContaining('import { prettierConfig } from "js-style-kit";'),
    );
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "eslint.config.js",
      expect.stringContaining('import { eslintConfig } from "js-style-kit";'),
    );
    expect(mockConsole.info).toHaveBeenCalledWith(
      "Created configuration files with .js extension",
    );
  });

  it("should default to .mjs when package.json has no type field", () => {
    const mockPackageJson = {
      name: "test-package",
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    const result = setupConfigFiles();

    expect(result).toBe(".mjs");
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "prettier.config.mjs",
      expect.stringContaining('import { prettierConfig } from "js-style-kit";'),
    );
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "eslint.config.mjs",
      expect.stringContaining('import { eslintConfig } from "js-style-kit";'),
    );
  });

  it("should create files with correct content for prettier config", () => {
    const mockPackageJson = {
      name: "test-package",
      type: "module",
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    setupConfigFiles();

    const prettierCall = mockFs.writeFileSync.mock.calls.find((call) =>
      call[0].includes("prettier.config"),
    );

    expect(prettierCall).toBeDefined();
    expect(prettierCall?.[1]).toContain("//@ts-check");
    expect(prettierCall?.[1]).toContain("import { prettierConfig }");
    expect(prettierCall?.[1]).toContain("export default prettierConfig({});");
  });

  it("should create files with correct content for eslint config", () => {
    const mockPackageJson = {
      name: "test-package",
      type: "module",
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));

    setupConfigFiles();

    const eslintCall = mockFs.writeFileSync.mock.calls.find((call) =>
      call[0].includes("eslint.config"),
    );

    expect(eslintCall).toBeDefined();
    expect(eslintCall?.[1]).toContain("//@ts-check");
    expect(eslintCall?.[1]).toContain("import { eslintConfig }");
    expect(eslintCall?.[1]).toContain("export default eslintConfig({});");
  });

  it("should handle file read error and exit process", () => {
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error("Failed to read package.json");
    });

    setupConfigFiles();

    expect(mockConsole.error).toHaveBeenCalledWith(
      "Failed to create configuration files:",
      expect.any(Error),
    );
    expect(mockProcess.exit).toHaveBeenCalledWith(1);
  });

  it("should handle file write error and exit process", () => {
    const mockPackageJson = {
      name: "test-package",
      type: "module",
    };

    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockPackageJson));
    mockFs.writeFileSync.mockImplementation(() => {
      throw new Error("Failed to write config file");
    });

    setupConfigFiles();

    expect(mockConsole.error).toHaveBeenCalledWith(
      "Failed to create configuration files:",
      expect.any(Error),
    );
    expect(mockProcess.exit).toHaveBeenCalledWith(1);
  });

  it("should handle invalid JSON in package.json and exit process", () => {
    mockFs.readFileSync.mockReturnValue("invalid json");

    setupConfigFiles();

    expect(mockConsole.error).toHaveBeenCalledWith(
      "Failed to create configuration files:",
      expect.any(Error),
    );
    expect(mockProcess.exit).toHaveBeenCalledWith(1);
  });

  it("should handle empty package.json file", () => {
    mockFs.readFileSync.mockReturnValue("{}");

    const result = setupConfigFiles();

    expect(result).toBe(".mjs");
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "prettier.config.mjs",
      expect.stringContaining('import { prettierConfig } from "js-style-kit";'),
    );
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "eslint.config.mjs",
      expect.stringContaining('import { eslintConfig } from "js-style-kit";'),
    );
  });
});

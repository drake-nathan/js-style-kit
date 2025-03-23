/* eslint-disable jest/no-conditional-in-test */
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";

import { patchTailwindPlugin } from "./patch-tailwind-plugin.js";

// Mock the required modules - these must be properly intercepted by our test
void mock.module("node:fs", () => ({
  existsSync: mock(() => false),
  readFileSync: mock(() => ""),
  writeFileSync: mock(() => undefined),
}));

void mock.module("node:path", () => ({
  join: mock((...args: string[]) => args.join("/")),
}));

// Spy on console methods
const consoleInfoSpy = spyOn(console, "info");
const consoleWarnSpy = spyOn(console, "warn");
const consoleErrorSpy = spyOn(console, "error");

// Get the mocked functions
const mockExistsSync = fs.existsSync as unknown as ReturnType<typeof mock>;
const mockReadFileSync = fs.readFileSync as unknown as ReturnType<typeof mock>;
const mockWriteFileSync = fs.writeFileSync as unknown as ReturnType<
  typeof mock
>;
const mockJoin = path.join as unknown as ReturnType<typeof mock>;

describe("patchTailwindPlugin", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockExistsSync.mockReset();
    mockReadFileSync.mockReset();
    mockWriteFileSync.mockReset();
    mockJoin.mockReset();
    consoleInfoSpy.mockReset();
    consoleWarnSpy.mockReset();
    consoleErrorSpy.mockReset();

    // Default mock implementation for path.join
    mockJoin.mockImplementation((...args: string[]) => args.join("/"));
  });

  it("should return false when plugin is not found", () => {
    // Set up path.join to return predictable paths
    mockJoin.mockImplementation((...args: string[]) =>
      args.includes("prettier-plugin-tailwindcss") ?
        "node_modules/prettier-plugin-tailwindcss/dist/index.d.ts"
      : args.join("/"),
    );

    // Both paths should not exist
    mockExistsSync.mockImplementation(() => false);

    const result = patchTailwindPlugin();

    expect(result).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("prettier-plugin-tailwindcss not found"),
    );
  });

  it("should create backup and patch file when declare block exists", () => {
    const pluginPath =
      "node_modules/prettier-plugin-tailwindcss/dist/index.d.ts";

    // Mock path.join to return our test path
    mockJoin.mockImplementation((...args: string[]) =>
      args.includes("prettier-plugin-tailwindcss") ? pluginPath : (
        args.join("/")
      ),
    );

    // First path should exist, backup should not
    mockExistsSync.mockImplementation((path: string) => path === pluginPath);

    const mockContent = `Some content
declare module 'prettier' {
    interface RequiredOptions extends PluginOptions {
    }
    interface ParserOptions extends PluginOptions {
    }
}
More content`;

    // Mock reading file to return our test content
    mockReadFileSync.mockImplementation(() => mockContent);

    const result = patchTailwindPlugin();

    expect(result).toBe(true);
    // Verify backup was created
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      `${pluginPath}.backup`,
      mockContent,
    );

    // Verify content was patched
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      pluginPath,
      expect.stringContaining("// Removed unsafe declare module statement"),
    );

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining("Successfully patched"),
    );
  });

  it("should skip patching when declare block is already removed", () => {
    const pluginPath =
      "node_modules/prettier-plugin-tailwindcss/dist/index.d.ts";

    // Mock path.join to return our test path
    mockJoin.mockImplementation((...args: string[]) =>
      args.includes("prettier-plugin-tailwindcss") ? pluginPath : (
        args.join("/")
      ),
    );

    // Plugin path should exist
    mockExistsSync.mockImplementation(() => true);

    const mockContent = `Some content
// Removed unsafe declare module statement
More content`;

    // Mock reading file to return already patched content
    mockReadFileSync.mockImplementation(() => mockContent);

    const result = patchTailwindPlugin();

    expect(result).toBe(true);
    // Should not write to the plugin path
    expect(mockWriteFileSync).not.toHaveBeenCalledWith(
      pluginPath,
      expect.any(String),
    );

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining("No patching needed"),
    );
  });

  it("should return false when an error occurs", () => {
    // Force an error by making mockJoin throw
    mockJoin.mockImplementation(() => {
      throw new Error("Test error");
    });

    const result = patchTailwindPlugin();

    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error patching prettier-plugin-tailwindcss"),
      expect.any(Error),
    );
  });
});

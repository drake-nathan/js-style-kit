import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import fs from "node:fs";

import { detectPackageManager } from "./detect-package-manager.js";

// Mock fs module
const mockFs = {
  existsSync: mock(),
};

describe("detectPackageManager", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockFs.existsSync.mockReset();

    // Mock the fs module
    Object.assign(fs, mockFs);
  });

  afterEach(() => {
    // Clean up mocks
    mock.restore();
  });

  it("should detect bun when bun.lock exists", () => {
    // Setup: only bun.lock exists
    mockFs.existsSync.mockReturnValueOnce(true); // bun.lock

    const result = detectPackageManager();

    expect(result).toBe("bun");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
  });

  it("should detect bun when bun.lockb exists", () => {
    // Setup: bun.lock doesn't exist, but bun.lockb does
    mockFs.existsSync.mockReturnValueOnce(false); // bun.lock
    mockFs.existsSync.mockReturnValueOnce(true); // bun.lockb

    const result = detectPackageManager();

    expect(result).toBe("bun");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lockb");
  });

  it("should detect bun when both bun.lock and bun.lockb exist", () => {
    // Setup: both bun lockfiles exist
    mockFs.existsSync.mockReturnValueOnce(true); // bun.lock

    const result = detectPackageManager();

    expect(result).toBe("bun");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
  });

  it("should detect pnpm when pnpm-lock.yaml exists and no bun lockfiles", () => {
    // Setup: no bun files, but pnpm-lock.yaml exists
    mockFs.existsSync.mockReturnValueOnce(false); // bun.lock
    mockFs.existsSync.mockReturnValueOnce(false); // bun.lockb
    mockFs.existsSync.mockReturnValueOnce(true); // pnpm-lock.yaml

    const result = detectPackageManager();

    expect(result).toBe("pnpm");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lockb");
    expect(mockFs.existsSync).toHaveBeenCalledWith("pnpm-lock.yaml");
  });

  it("should detect yarn when yarn.lock exists and no other lockfiles", () => {
    // Setup: no bun or pnpm files, but yarn.lock exists
    mockFs.existsSync.mockReturnValueOnce(false); // bun.lock
    mockFs.existsSync.mockReturnValueOnce(false); // bun.lockb
    mockFs.existsSync.mockReturnValueOnce(false); // pnpm-lock.yaml
    mockFs.existsSync.mockReturnValueOnce(true); // yarn.lock

    const result = detectPackageManager();

    expect(result).toBe("yarn");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lockb");
    expect(mockFs.existsSync).toHaveBeenCalledWith("pnpm-lock.yaml");
    expect(mockFs.existsSync).toHaveBeenCalledWith("yarn.lock");
  });

  it("should default to npm when no lockfiles exist", () => {
    // Setup: no lockfiles exist
    mockFs.existsSync.mockReturnValue(false);

    const result = detectPackageManager();

    expect(result).toBe("npm");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lockb");
    expect(mockFs.existsSync).toHaveBeenCalledWith("pnpm-lock.yaml");
    expect(mockFs.existsSync).toHaveBeenCalledWith("yarn.lock");
  });

  it("should prioritize bun over pnpm when both lockfiles exist", () => {
    // Setup: bun.lock exists (should return before checking pnpm)
    mockFs.existsSync.mockReturnValueOnce(true); // bun.lock

    const result = detectPackageManager();

    expect(result).toBe("bun");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
    // Should not check pnpm since bun.lock was found first
  });

  it("should prioritize bun over yarn when both lockfiles exist", () => {
    // Setup: bun.lockb exists (should return before checking yarn)
    mockFs.existsSync.mockReturnValueOnce(false); // bun.lock
    mockFs.existsSync.mockReturnValueOnce(true); // bun.lockb

    const result = detectPackageManager();

    expect(result).toBe("bun");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lockb");
    // Should not check yarn since bun.lockb was found
  });

  it("should prioritize pnpm over yarn when both lockfiles exist", () => {
    // Setup: no bun files, but pnpm-lock.yaml exists (should return before checking yarn)
    mockFs.existsSync.mockReturnValueOnce(false); // bun.lock
    mockFs.existsSync.mockReturnValueOnce(false); // bun.lockb
    mockFs.existsSync.mockReturnValueOnce(true); // pnpm-lock.yaml

    const result = detectPackageManager();

    expect(result).toBe("pnpm");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lockb");
    expect(mockFs.existsSync).toHaveBeenCalledWith("pnpm-lock.yaml");
    // Should not check yarn since pnpm-lock.yaml was found
  });

  it("should prioritize bun when all lockfiles exist", () => {
    // Setup: bun.lock exists (should return immediately)
    mockFs.existsSync.mockReturnValueOnce(true); // bun.lock

    const result = detectPackageManager();

    expect(result).toBe("bun");
    expect(mockFs.existsSync).toHaveBeenCalledWith("bun.lock");
    // Should not check other lockfiles since bun.lock was found first
  });

  it("should handle file system errors gracefully and default to npm", () => {
    // Setup: all fs.existsSync calls throw errors
    mockFs.existsSync.mockImplementation(() => {
      throw new Error("Permission denied");
    });

    const result = detectPackageManager();

    expect(result).toBe("npm");
  });

  it("should handle mixed file system errors and successful checks", () => {
    // Setup: some calls succeed, some fail - but any error causes fallback to npm
    const errorFn = () => {
      throw new Error("Permission denied");
    };
    mockFs.existsSync.mockImplementationOnce(errorFn); // First call throws

    const result = detectPackageManager();

    // Since any error in the try block causes fallback to npm
    expect(result).toBe("npm");
  });
});

import { describe, expect, it } from "bun:test";

import { getRootDirs } from "../../src/utils/get-root-dirs";

describe("getRootDirs", () => {
  it("should return cwd when no rootDir is provided", () => {
    const context = {
      cwd: "/test/cwd",
      settings: {},
    } as any;

    const result = getRootDirs(context);
    
    expect(result).toStrictEqual(["/test/cwd"]);
  });

  it("should return cwd when empty settings is provided", () => {
    const context = {
      cwd: "/test/cwd",
      settings: { next: {} },
    } as any;

    const result = getRootDirs(context);
    
    expect(result).toStrictEqual(["/test/cwd"]);
  });
});

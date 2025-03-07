import { describe, expect, it } from "vitest";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { vitestConfig } from "./config.js";

describe("vitestConfig", () => {
  it("returns an ESLint configuration object", () => {
    const config: EslintConfigObject = vitestConfig();

    expect(config.name).toBe(configNames.vitest);
  });

  it("replaces `files` with user provided files", () => {
    const config: EslintConfigObject = vitestConfig({
      files: ["some different stuff"],
    });

    expect(config.files).toStrictEqual(["some different stuff"]);
  });

  it("honors `filenamePattern` for consistent-test-filename rule", () => {
    const config: EslintConfigObject = vitestConfig({
      filenamePattern: "spec",
    });

    expect(config.rules?.["vitest/consistent-test-filename"]).toStrictEqual([
      "warn",
      {
        allTestPattern: ".*\\.(test|spec)\\.[tj]sx?$",
        pattern: ".*\\.spec\\.[tj]sx?$",
      },
    ]);
  });

  it("honors `itOrTest` with 'test' value", () => {
    const config: EslintConfigObject = vitestConfig({
      itOrTest: "test",
    });

    expect(config.rules?.["vitest/consistent-test-it"]).toStrictEqual([
      "warn",
      { fn: "test", withinDescribe: "test" },
    ]);
  });

  it("honors `itOrTest` with 'it' value", () => {
    const config: EslintConfigObject = vitestConfig({
      itOrTest: "it",
    });

    expect(config.rules?.["vitest/consistent-test-it"]).toStrictEqual([
      "warn",
      { fn: "it", withinDescribe: "it" },
    ]);
  });

  it("uses default values when no options are provided", () => {
    const config: EslintConfigObject = vitestConfig();

    expect(config.rules?.["vitest/consistent-test-filename"]).toStrictEqual([
      "warn",
      {
        allTestPattern: ".*\\.(test|spec)\\.[tj]sx?$",
        pattern: ".*\\.test\\.[tj]sx?$",
      },
    ]);
    expect(config.rules?.["vitest/consistent-test-it"]).toStrictEqual([
      "warn",
      { fn: "test", withinDescribe: "test" },
    ]);
  });
});

import jest from "eslint-plugin-jest";
import vitest from "eslint-plugin-vitest";
import { describe, expect, it } from "vitest";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { testingConfig } from "./config.js";
import { jestRules } from "./jestRules.js";

describe("testingConfig", () => {
  it("returns an ESLint configuration object", () => {
    const config: EslintConfigObject = testingConfig();

    expect(config.name).toBe(configNames.testing);
  });

  it("replaces `files` with user provided files", () => {
    const config: EslintConfigObject = testingConfig({
      files: ["some different stuff"],
    });

    expect(config.files).toStrictEqual(["some different stuff"]);
  });

  it("honors `filenamePattern` for consistent-test-filename rule", () => {
    const config: EslintConfigObject = testingConfig({
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
    const config: EslintConfigObject = testingConfig({
      framework: "vitest",
      itOrTest: "test",
    });

    expect(config.rules?.["vitest/consistent-test-it"]).toStrictEqual([
      "warn",
      { fn: "test", withinDescribe: "test" },
    ]);
  });

  it("honors `itOrTest` with 'it' value", () => {
    const config: EslintConfigObject = testingConfig({
      framework: "vitest",
      itOrTest: "it",
    });

    expect(config.rules?.["vitest/consistent-test-it"]).toStrictEqual([
      "warn",
      { fn: "it", withinDescribe: "it" },
    ]);
  });

  it("uses default values when no options are provided", () => {
    const config: EslintConfigObject = testingConfig();

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
    // Default framework should be vitest
    expect(config.languageOptions?.globals).toStrictEqual({
      ...vitest.environments.env.globals,
    });
    // Default formattingRules should be true
    expect(config.rules?.["jest/padding-around-test-blocks"]).toBe("warn");
  });

  it("configures jest framework when specified", () => {
    const config: EslintConfigObject = testingConfig({
      framework: "jest",
      itOrTest: "test",
    });

    expect(config.languageOptions?.globals).toStrictEqual(
      jest.environments.globals.globals,
    );
    expect(config.rules).toMatchObject(jestRules("test"));
    expect(config.settings).toBeUndefined();
  });

  it("configures node framework when specified", () => {
    const config: EslintConfigObject = testingConfig({
      framework: "node",
    });

    expect(config.settings).toStrictEqual({
      jest: {
        globalPackage: "node:test",
      },
    });
  });

  it("configures bun framework when specified", () => {
    const config: EslintConfigObject = testingConfig({
      framework: "bun",
    });

    expect(config.settings).toStrictEqual({
      jest: {
        globalPackage: "bun:test",
      },
    });
  });

  it("disables formatting rules when formattingRules is false", () => {
    const config: EslintConfigObject = testingConfig({
      formattingRules: false,
    });

    expect(config.rules?.["jest/padding-around-test-blocks"]).toBeUndefined();
    expect(
      config.rules?.["jest/padding-around-describe-blocks"],
    ).toBeUndefined();
    expect(config.rules?.["jest/padding-around-expect-groups"]).toBeUndefined();
  });
});

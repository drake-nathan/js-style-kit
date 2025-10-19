import { describe, expect, it } from "bun:test";
import tseslint, { type ConfigArray } from "typescript-eslint";

import { configNames } from "../constants.js";
import { tseslintConfig } from "./config.js";
import { tseslintRules } from "./rules.js";

/**
 * Unit tests for TypeScript configuration
 * Tests tseslintConfig() in isolation to verify:
 * - Config array structure (returns 2 configs: main + disableTypeChecked)
 * - Parser configuration (TypeScript ESLint parser)
 * - tsconfig path handling (project vs projectService)
 * - File patterns (TypeScript and JavaScript files)
 * - Custom rules merging
 * - Type-checked rules disabled for JavaScript files
 */

const getRules = (mainConfig: unknown): Record<string, unknown> => {
  if (!mainConfig || typeof mainConfig !== "object") {
    throw new TypeError("Invalid TypeScript main config");
  }
  const rules = (mainConfig as { rules?: unknown }).rules;
  if (!rules || typeof rules !== "object") {
    throw new TypeError("Invalid TypeScript rules object");
  }
  return rules as Record<string, unknown>;
};

describe("tseslintConfig", () => {
  describe("config array structure", () => {
    it("returns an array of configurations", () => {
      const config = tseslintConfig();

      expect(Array.isArray(config)).toBe(true);
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      expect(config.length).toBeGreaterThan(0);
    });

    it("first config is the main TypeScript config", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      expect(mainConfig?.name).toBe(configNames.typescript);
    });

    it("includes a config that disables type-checked rules for JS files", () => {
      const config = tseslintConfig() as ConfigArray;

      // Find the config that applies to JS files
      const disableTypeCheckedConfig = config.find((c) =>
        c.files?.includes("**/*.js"),
      );

      expect(disableTypeCheckedConfig).toBeDefined();
      expect(disableTypeCheckedConfig?.files).toStrictEqual(["**/*.js"]);
    });
  });

  describe("file patterns", () => {
    it("applies to JavaScript and TypeScript files", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      expect(mainConfig?.files).toStrictEqual(["**/*.{js,cjs,mjs,ts,jsx,tsx}"]);
    });
  });

  describe("parser configuration", () => {
    it("uses TypeScript ESLint parser", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      expect(mainConfig?.languageOptions?.parser).toBe(tseslint.parser);
    });

    it("uses projectService by default when no tsconfig path provided", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      expect(mainConfig?.languageOptions?.parserOptions?.projectService).toBe(
        true,
      );
      expect(
        mainConfig?.languageOptions?.parserOptions?.tsconfigRootDir,
      ).toBeDefined();
      expect(
        mainConfig?.languageOptions?.parserOptions?.project,
      ).toBeUndefined();
    });

    it("uses project path when tsconfig path is provided", () => {
      const tsconfigPath = "./tsconfig.json";
      const config = tseslintConfig(tsconfigPath);
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      expect(mainConfig?.languageOptions?.parserOptions?.project).toBe(
        tsconfigPath,
      );
      expect(
        mainConfig?.languageOptions?.parserOptions?.tsconfigRootDir,
      ).toBeDefined();
      expect(
        mainConfig?.languageOptions?.parserOptions?.projectService,
      ).toBeUndefined();
    });

    it("uses custom tsconfig path when provided", () => {
      const customPath = "./tsconfig.build.json";
      const config = tseslintConfig(customPath);
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      expect(mainConfig?.languageOptions?.parserOptions?.project).toBe(
        customPath,
      );
    });
  });

  describe("plugins", () => {
    it("includes TypeScript ESLint plugin", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      expect(mainConfig?.plugins?.["@typescript-eslint"]).toBe(tseslint.plugin);
    });
  });

  describe("rules", () => {
    it("includes all default TypeScript ESLint rules", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      // Check that rules object contains all tseslintRules
      const configRules = getRules(mainConfig);
      const tseslintRuleKeys = Object.keys(tseslintRules);

      tseslintRuleKeys.forEach((ruleKey) => {
        expect(configRules[ruleKey]).toBeDefined();
      });
    });

    it("includes expected core TypeScript rules", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      // Spot check some key rules
      expect(mainConfig?.rules?.["@typescript-eslint/no-explicit-any"]).toBe(
        "warn",
      );
      expect(
        mainConfig?.rules?.["@typescript-eslint/no-unused-vars"],
      ).toStrictEqual([
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: false,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ]);
      expect(
        mainConfig?.rules?.["@typescript-eslint/consistent-type-imports"],
      ).toStrictEqual([
        "warn",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ]);
    });

    it("includes type-aware rules", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      // These rules require type information
      expect(mainConfig?.rules?.["@typescript-eslint/await-thenable"]).toBe(
        "warn",
      );
      expect(
        mainConfig?.rules?.["@typescript-eslint/no-floating-promises"],
      ).toBe("warn");
      expect(
        mainConfig?.rules?.["@typescript-eslint/no-misused-promises"],
      ).toBe("warn");
      expect(mainConfig?.rules?.["@typescript-eslint/require-await"]).toBe(
        "warn",
      );
    });
  });

  describe("custom rules", () => {
    it("merges custom rules with default rules", () => {
      const customRules = {
        "@typescript-eslint/custom-rule": "warn" as const,
        "@typescript-eslint/no-explicit-any": "off" as const,
      };

      const config = tseslintConfig(undefined, customRules);
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      // Custom rule should override default
      expect(mainConfig?.rules?.["@typescript-eslint/no-explicit-any"]).toBe(
        "off",
      );
      // Custom rule should be added
      expect(mainConfig?.rules?.["@typescript-eslint/custom-rule"]).toBe(
        "warn",
      );
      // Other rules should remain
      expect(
        mainConfig?.rules?.["@typescript-eslint/no-unused-vars"],
      ).toBeDefined();
    });

    it("works with custom rules and custom tsconfig path", () => {
      const customRules = {
        "@typescript-eslint/no-explicit-any": "off" as const,
      };
      const tsconfigPath = "./tsconfig.build.json";

      const config = tseslintConfig(tsconfigPath, customRules);
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      // Both tsconfig path and custom rules should be applied
      expect(mainConfig?.languageOptions?.parserOptions?.project).toBe(
        tsconfigPath,
      );
      expect(mainConfig?.rules?.["@typescript-eslint/no-explicit-any"]).toBe(
        "off",
      );
    });
  });

  describe("disable type-checked config", () => {
    it("includes a config for JS files that disables type-checked rules", () => {
      const config = tseslintConfig() as ConfigArray;

      const jsConfig = config.find((c) => c.files?.includes("**/*.js"));

      expect(jsConfig).toBeDefined();
      expect(jsConfig?.files).toStrictEqual(["**/*.js"]);
      // defineConfig flattens the extends, so we check that type-aware rules are disabled
      expect(jsConfig?.rules?.["@typescript-eslint/await-thenable"]).toBe(
        "off",
      );
      expect(jsConfig?.rules?.["@typescript-eslint/no-floating-promises"]).toBe(
        "off",
      );
    });

    it("only applies to JavaScript files", () => {
      const config = tseslintConfig() as ConfigArray;
      const disableConfig = config.find((c) => c.files?.includes("**/*.js"));

      expect(disableConfig?.files).toStrictEqual(["**/*.js"]);
    });

    it("is present regardless of custom rules", () => {
      const customRules = {
        "@typescript-eslint/no-explicit-any": "off" as const,
      };

      const config = tseslintConfig(undefined, customRules) as ConfigArray;

      const jsConfig = config.find((c) => c.files?.includes("**/*.js"));

      expect(jsConfig).toBeDefined();
    });

    it("is present regardless of tsconfig path", () => {
      const config = tseslintConfig("./tsconfig.json") as ConfigArray;

      const jsConfig = config.find((c) => c.files?.includes("**/*.js"));

      expect(jsConfig).toBeDefined();
    });
  });

  describe("config name", () => {
    it("uses the correct config name constant", () => {
      const config = tseslintConfig();
      // @ts-expect-error - Config type is complex union, but at runtime it's an array
      const mainConfig = config[0];

      expect(mainConfig?.name).toBe(configNames.typescript);
      expect(mainConfig?.name).toBe("tseslint");
    });
  });
});

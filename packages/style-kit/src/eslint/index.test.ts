import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

import { configNames } from "./constants.js";
import { eslintConfig } from "./index.js";

describe("eslintConfig", () => {
  describe("default configuration", () => {
    it("returns expected default configs", () => {
      const config = eslintConfig();
      const names = config.map((c) => c.name);
      const expectedConfigs = [
        configNames.ignores,
        configNames.base,
        configNames.jsdoc,
        configNames.typescript,
        configNames.perfectionist,
        configNames.testing,
        configNames.preferArrowFunction,
        configNames.disableTypeChecked,
        // the disable type checked config comes with an additional un-named config
        undefined,
      ];

      expect(config).toBeInstanceOf(Array);

      expectedConfigs.forEach((expectedName) => {
        expect(names).toContain(expectedName);
      });
    });
  });

  describe("function style options", () => {
    it("applies 'arrow' function style by default", () => {
      const config = eslintConfig();
      const baseConfig = config.find((c) => c.name === configNames.base);

      // it is enforced by prefer-arrow-functions when functionStyle is "arrow"
      expect(baseConfig?.rules?.["func-style"]).toBe("off");
    });

    it("applies 'declaration' function style when specified", () => {
      const config = eslintConfig({ functionStyle: "declaration" });
      const baseConfig = config.find((c) => c.name === configNames.base);

      expect(baseConfig?.rules?.["func-style"]).toStrictEqual([
        "warn",
        "declaration",
        { allowArrowFunctions: true },
      ]);
    });

    it("applies 'expression' function style when specified", () => {
      const config = eslintConfig({ functionStyle: "expression" });
      const baseConfig = config.find((c) => c.name === configNames.base);

      expect(baseConfig?.rules?.["func-style"]).toStrictEqual([
        "warn",
        "expression",
        { allowArrowFunctions: true },
      ]);
    });

    it("disables function style rule when 'off' is specified", () => {
      const config = eslintConfig({ functionStyle: "off" });
      const baseConfig = config.find((c) => c.name === configNames.base);

      expect(baseConfig?.rules?.["func-style"]).toBe("off");
    });

    it("applies function style to React component definition when React is enabled", () => {
      const config = eslintConfig({
        functionStyle: "declaration",
        react: true,
      });
      const reactConfig = config.find((c) => c.name === configNames.react);

      expect(
        reactConfig?.rules?.["react/function-component-definition"],
      ).toStrictEqual([
        "warn",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "function-expression",
        },
      ]);
    });
  });

  describe("react configuration", () => {
    it("includes React config when enabled", () => {
      const config = eslintConfig({ react: true });

      expect(config.some((c) => c.name === configNames.react)).toBe(true);
    });

    it("includes React compiler config by default when React is enabled", () => {
      const config = eslintConfig({ react: true });

      expect(config.some((c) => c.name === configNames.reactCompiler)).toBe(
        true,
      );
    });

    it("excludes React compiler config when React is enabled but React compiler is not", () => {
      const config = eslintConfig({ react: { reactCompiler: false } });

      expect(config.some((c) => c.name === configNames.reactCompiler)).toBe(
        false,
      );
    });

    it("enables React with Next.js support when next is true", () => {
      const config = eslintConfig({ react: { next: true } });
      const ignoresConfig = config[0];

      expect(config.some((c) => c.name === configNames.react)).toBe(true);
      expect(ignoresConfig?.ignores).toStrictEqual(
        expect.arrayContaining([".next"]),
      );
    });
  });

  describe("jSDoc configuration", () => {
    it("includes JSDoc config by default with requirements disabled", () => {
      const config = eslintConfig();
      const jsdocConfig = config.find((c) => c.name === configNames.jsdoc);

      expect(jsdocConfig).toBeDefined();
      expect(jsdocConfig?.rules?.["jsdoc/require-jsdoc"]).toBe("off");
    });

    it("excludes JSDoc config entirely when disabled", () => {
      const config = eslintConfig({ jsdoc: false });

      expect(config.some((c) => c.name === configNames.jsdoc)).toBe(false);
    });

    it("enables JSDoc requirements when configured", () => {
      const config = eslintConfig({ jsdoc: { requireJsdoc: true } });
      const jsdocConfig = config.find((c) => c.name === configNames.jsdoc);

      expect(jsdocConfig).toBeDefined();
      expect(jsdocConfig?.rules?.["jsdoc/require-jsdoc"]).toStrictEqual(
        expect.arrayContaining(["warn"]),
      );
    });

    it("keeps JSDoc requirements disabled when explicitly set", () => {
      const config = eslintConfig({ jsdoc: { requireJsdoc: false } });
      const jsdocConfig = config.find((c) => c.name === configNames.jsdoc);

      expect(jsdocConfig).toBeDefined();
      expect(jsdocConfig?.rules?.["jsdoc/require-jsdoc"]).toBeDefined();
    });
  });

  describe("optional configurations", () => {
    it("excludes TypeScript config when disabled", () => {
      const config = eslintConfig({ typescript: false });

      expect(config.some((c) => c.name === configNames.typescript)).toBe(false);
    });

    it("excludes sorting config when disabled", () => {
      const config = eslintConfig({ sorting: false });

      expect(config.some((c) => c.name === configNames.perfectionist)).toBe(
        false,
      );
    });

    it("includes unicorn config by default", () => {
      const config = eslintConfig();

      expect(config.some((c) => c.name === configNames.unicorn)).toBe(true);
    });

    it("excludes unicorn config when disabled", () => {
      const config = eslintConfig({ unicorn: false });

      expect(config.some((c) => c.name === configNames.unicorn)).toBe(false);
    });

    it("excludes turbo config by default", () => {
      const config = eslintConfig();

      expect(config.some((c) => c.name === configNames.turbo)).toBe(false);
    });

    it("includes turbo config when enabled", () => {
      const config = eslintConfig({ turbo: true });

      expect(config.some((c) => c.name === configNames.turbo)).toBe(true);
    });
  });

  describe("ignore patterns", () => {
    it("applies custom ignores", () => {
      const customIgnores = ["*.test.ts", "*.spec.ts"];
      const config = eslintConfig({ ignores: customIgnores });

      expect(config[0]?.ignores).toStrictEqual(
        expect.arrayContaining(customIgnores),
      );
    });

    it("handles empty ignores array", () => {
      const config = eslintConfig({ ignores: [] });
      const ignoresConfig = config[0];

      // Should still include default ignores
      expect(ignoresConfig?.ignores?.length).toBeGreaterThan(0);
      expect(ignoresConfig?.ignores).toStrictEqual(
        expect.arrayContaining(["**/node_modules/", "**/dist/"]),
      );
    });

    it("adds '.next' to ignores when `react.next` is true", () => {
      const config = eslintConfig({ react: { next: true } });
      const ignoresConfig = config[0];

      expect(ignoresConfig?.ignores).toStrictEqual(
        expect.arrayContaining([".next"]),
      );
    });
  });

  describe("additional config objects", () => {
    it("includes additional config objects in the returned array", () => {
      const additionalConfig: Linter.Config = {
        name: "custom-config",
        rules: {
          "no-console": 2,
        },
      };

      const config = eslintConfig({}, additionalConfig);

      expect(config).toContainEqual(additionalConfig);
    });

    it("appends multiple additional config objects to the returned array", () => {
      const additionalConfig1: Linter.Config = {
        name: "custom-config-1",
        rules: {
          "custom-rule-1": "error",
        },
      };

      const additionalConfig2: Linter.Config = {
        name: "custom-config-2",
        rules: {
          "custom-rule-2": "warn",
        },
      };

      const config = eslintConfig({}, additionalConfig1, additionalConfig2);

      expect(config).toContainEqual(additionalConfig1);
      expect(config).toContainEqual(additionalConfig2);
    });

    it("maintains the order of additional config objects", () => {
      const additionalConfig1: Linter.Config = { name: "custom-config-1" };
      const additionalConfig2: Linter.Config = { name: "custom-config-2" };

      const config = eslintConfig({}, additionalConfig1, additionalConfig2);
      const index1 = config.findIndex((c) => c.name === "custom-config-1");
      const index2 = config.findIndex((c) => c.name === "custom-config-2");

      expect(index1).toBeGreaterThanOrEqual(0);
      expect(index2).toBeGreaterThanOrEqual(0);
      expect(index1).toBeLessThan(index2);
    });
  });

  describe("prefer arrow functions configuration", () => {
    it("includes prefer-arrow-function config when function style is 'arrow'", () => {
      const config = eslintConfig({ functionStyle: "arrow" });

      expect(
        config.some((c) => c.name === configNames.preferArrowFunction),
      ).toBe(true);
    });

    it("excludes prefer-arrow-function config when function style is not 'arrow'", () => {
      const config = eslintConfig({ functionStyle: "declaration" });

      expect(
        config.some((c) => c.name === configNames.preferArrowFunction),
      ).toBe(false);
    });

    it("applies expected rules in prefer-arrow-function config", () => {
      const config = eslintConfig({ functionStyle: "arrow" });
      const arrowConfig = config.find(
        (c) => c.name === configNames.preferArrowFunction,
      );

      expect(arrowConfig).toBeDefined();
      expect(
        arrowConfig?.rules?.["prefer-arrow-functions/prefer-arrow-functions"],
      ).toStrictEqual([
        "warn",
        {
          returnStyle: "unchanged",
          singleReturnOnly: false,
        },
      ]);
    });

    it("includes prefer-arrow-function config by default", () => {
      const config = eslintConfig();

      expect(
        config.some((c) => c.name === configNames.preferArrowFunction),
      ).toBe(true);
    });
  });

  describe("storybook configuration", () => {
    it("excludes storybook config by default", () => {
      const config = eslintConfig();

      expect(config.some((c) => c.name === configNames.storybook)).toBe(false);
      expect(config.some((c) => c.name === configNames.storybookConfig)).toBe(
        false,
      );
    });

    it("includes storybook config when enabled", () => {
      const config = eslintConfig({ storybook: true });

      expect(config.some((c) => c.name === configNames.storybook)).toBe(true);
      expect(config.some((c) => c.name === configNames.storybookConfig)).toBe(
        true,
      );
    });

    it("correctly configures ignores when storybook is enabled", () => {
      const config = eslintConfig({ storybook: true });
      const ignoresConfig = config.find((c) => c.name === configNames.ignores);

      expect(ignoresConfig?.ignores).toContain("!.storybook");
    });

    it("does not include .storybook negation in ignores when storybook is disabled", () => {
      const config = eslintConfig();
      const ignoresConfig = config.find((c) => c.name === configNames.ignores);

      expect(ignoresConfig?.ignores).not.toContain("!.storybook");
    });
  });

  describe("edge cases", () => {
    it("works when all optional features are disabled", () => {
      const config = eslintConfig({
        jsdoc: false,
        react: false,
        sorting: false,
        storybook: false,
        testing: false,
        typescript: false,
      });

      const names = config.map((c) => c.name);

      expect(names).toContain(configNames.base);
      expect(names).toContain(configNames.ignores);

      // These should be excluded
      expect(names).not.toContain(configNames.typescript);
      expect(names).not.toContain(configNames.react);
      expect(names).not.toContain(configNames.reactCompiler);
      expect(names).not.toContain(configNames.jsdoc);
      expect(names).not.toContain(configNames.perfectionist);
      expect(names).not.toContain(configNames.testing);
      expect(names).not.toContain(configNames.storybook);
      expect(names).not.toContain(configNames.storybookConfig);
    });

    it("handles React options without TypeScript", () => {
      const config = eslintConfig({
        react: true,
        typescript: false,
      });

      const reactConfig = config.find((c) => c.name === configNames.react);

      // Should still include React configs
      expect(reactConfig).toBeDefined();
      // React config should be initialized with typescript=false
      expect(reactConfig?.rules?.["react/prop-types"]).toBe("warn");
    });
  });

  describe("testing configuration", () => {
    it("includes vitest config by default", () => {
      const config = eslintConfig();

      expect(config.some((c) => c.name === configNames.testing)).toBe(true);
    });

    it("excludes testing config when testing is false", () => {
      const config = eslintConfig({ testing: false });

      expect(config.some((c) => c.name === configNames.testing)).toBe(false);
    });

    it("applies default testing configuration when testing is not provided", () => {
      const config = eslintConfig();
      const testingConfigObj = config.find(
        (c) => c.name === configNames.testing,
      );

      expect(testingConfigObj).toBeDefined();
      expect(testingConfigObj?.files).toStrictEqual([
        "**/*.{test,spec}.{ts,tsx,js,jsx}",
      ]);
      // Default framework should be vitest
      expect(testingConfigObj?.languageOptions?.globals).toBeDefined();
      // Default formattingRules should be true
      expect(testingConfigObj?.rules?.["jest/padding-around-test-blocks"]).toBe(
        "warn",
      );
    });

    it("applies custom testing configuration when provided", () => {
      const customFiles = ["**/*.spec.{ts,tsx}"];
      const config = eslintConfig({
        testing: {
          filenamePattern: "spec",
          files: customFiles,
          framework: "vitest",
          itOrTest: "test",
        },
      });
      const testingConfigObj = config.find(
        (c) => c.name === configNames.testing,
      );

      expect(testingConfigObj).toBeDefined();
      expect(testingConfigObj?.files).toStrictEqual(customFiles);
    });

    it("merges custom testing configuration with defaults", () => {
      const config = eslintConfig({
        testing: {
          itOrTest: "test",
        },
      });
      const testingConfigObj = config.find(
        (c) => c.name === configNames.testing,
      );

      expect(testingConfigObj).toBeDefined();
      // Should still have default files pattern
      expect(testingConfigObj?.files).toStrictEqual([
        "**/*.{test,spec}.{ts,tsx,js,jsx}",
      ]);
    });

    it("applies jest framework when specified", () => {
      const config = eslintConfig({
        testing: {
          framework: "jest",
        },
      });
      const testingConfigObj = config.find(
        (c) => c.name === configNames.testing,
      );

      expect(testingConfigObj).toBeDefined();
      // Should have jest globals
      expect(testingConfigObj?.languageOptions?.globals).toBeDefined();
      // Should have jest rules
      expect(testingConfigObj?.rules?.["jest/expect-expect"]).toBeDefined();
    });

    it("applies node framework when specified", () => {
      const config = eslintConfig({
        testing: {
          framework: "node",
        },
      });
      const testingConfigObj = config.find(
        (c) => c.name === configNames.testing,
      );

      expect(testingConfigObj).toBeDefined();
      // Should have node:test settings
      expect(testingConfigObj?.settings).toStrictEqual({
        jest: {
          globalPackage: "node:test",
        },
      });
    });

    it("applies bun framework when specified", () => {
      const config = eslintConfig({
        testing: {
          framework: "bun",
        },
      });
      const testingConfigObj = config.find(
        (c) => c.name === configNames.testing,
      );

      expect(testingConfigObj).toBeDefined();
      // Should have bun:test settings
      expect(testingConfigObj?.settings).toStrictEqual({
        jest: {
          globalPackage: "bun:test",
        },
      });
    });

    it("disables formatting rules when formattingRules is false", () => {
      const config = eslintConfig({
        testing: {
          formattingRules: false,
        },
      });
      const testingConfigObj = config.find(
        (c) => c.name === configNames.testing,
      );

      expect(testingConfigObj).toBeDefined();
      // Formatting rules should be undefined
      expect(
        testingConfigObj?.rules?.["jest/padding-around-test-blocks"],
      ).toBeUndefined();
      expect(
        testingConfigObj?.rules?.["jest/padding-around-describe-blocks"],
      ).toBeUndefined();
    });
  });

  describe("rule severity configuration", () => {
    it("ensures no rules are configured with 'error' severity", async () => {
      const path = await import("node:path");
      const fs = await import("node:fs/promises");
      const glob = await import("glob");

      // Get all rules.ts and config.ts files
      // Handle both running from root and from packages/style-kit
      const cwd = process.cwd();
      const isInPackageDir =
        cwd.endsWith("packages/style-kit") ||
        cwd.endsWith("packages/style-kit/");

      const eslintDir = path.resolve(
        cwd,
        isInPackageDir ? "src/eslint" : "packages/style-kit/src/eslint",
      );

      const files = await glob.glob(["**/*rules.ts", "**/*config.ts"], {
        absolute: true,
        cwd: eslintDir,
      });

      expect(files.length).toBeGreaterThan(0);

      // Check each file for "error" configurations
      const errorRules: { file: string; rule: string }[] = [];

      for (const file of files) {
        const content = await fs.readFile(file, "utf8");

        // Look for patterns like: "rule-name": "error" or "rule-name": ["error"
        const errorMatches = content.matchAll(
          /"(?<ruleName>[^"]+)":\s*"error"/g,
        );
        const arrayErrorMatches = content.matchAll(
          /"(?<ruleName>[^"]+)":\s*\[\s*"error"/g,
        );

        for (const match of errorMatches) {
          const ruleName = match.groups?.ruleName;
          if (ruleName) {
            errorRules.push({
              file: path.relative(eslintDir, file),
              rule: ruleName,
            });
          }
        }

        for (const match of arrayErrorMatches) {
          const ruleName = match.groups?.ruleName;
          if (ruleName) {
            errorRules.push({
              file: path.relative(eslintDir, file),
              rule: ruleName,
            });
          }
        }
      }

      if (errorRules.length > 0) {
        console.error("Found rules configured with 'error' severity:");
        errorRules.forEach(({ file, rule }) => {
          console.error(`  - ${file}: ${rule}`);
        });
      }

      expect(errorRules).toEqual([]);
    });
  });
});

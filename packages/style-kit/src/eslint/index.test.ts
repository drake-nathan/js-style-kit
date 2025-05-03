import type { Linter } from "eslint";

import { describe, expect, it } from "bun:test";

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
        configNames.import,
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

    it("includes React compiler via the react hooks plugin", () => {
      const config = eslintConfig({ react: true });

      const reactConfig = config.find((c) => c.name === configNames.react);

      expect(reactConfig?.rules?.["react-hooks/react-compiler"]).toBe("warn");
    });

    it("excludes React Refresh config by default when React is enabled", () => {
      const config = eslintConfig({ react: true });

      expect(config.some((c) => c.name === configNames.reactRefresh)).toBe(
        false,
      );
    });

    it("includes React Refresh config when React is enabled and React Refresh is explicitly enabled", () => {
      const config = eslintConfig({ react: { reactRefresh: true } });

      expect(config.some((c) => c.name === configNames.reactRefresh)).toBe(
        true,
      );
    });

    it("applies correct React Refresh rules when enabled", () => {
      const config = eslintConfig({ react: { reactRefresh: true } });
      const reactRefreshConfig = config.find(
        (c) => c.name === configNames.reactRefresh,
      );

      expect(reactRefreshConfig).toBeDefined();
      expect(
        reactRefreshConfig?.rules?.["react-refresh/only-export-components"],
      ).toStrictEqual(["warn", { allowConstantExport: true }]);
    });

    it("includes Next.js config when framework is 'next'", () => {
      const config = eslintConfig({ react: { framework: "next" } });

      // Should include Next.js config
      expect(config.some((c) => c.name === configNames.nextjs)).toBe(true);
      // Should exclude React Refresh config by default
      expect(config.some((c) => c.name === configNames.reactRefresh)).toBe(
        false,
      );
      // Should include .next in ignores
      expect(config[0]?.ignores).toStrictEqual(
        expect.arrayContaining([".next"]),
      );
    });

    it("includes React Refresh config when framework is 'vite'", () => {
      const config = eslintConfig({ react: { framework: "vite" } });

      // Should include React Refresh config
      expect(config.some((c) => c.name === configNames.reactRefresh)).toBe(
        true,
      );
      // Should exclude Next.js config
      expect(config.some((c) => c.name === configNames.nextjs)).toBe(false);
    });

    it("includes React Refresh config when framework is 'none'", () => {
      const config = eslintConfig({ react: { framework: "none" } });

      // Should include React Refresh config
      expect(config.some((c) => c.name === configNames.reactRefresh)).toBe(
        true,
      );
      // Should exclude Next.js config
      expect(config.some((c) => c.name === configNames.nextjs)).toBe(false);
    });

    it("allows reactRefresh to override framework-based behavior", () => {
      // With Next.js framework but explicitly enabling React Refresh
      const configWithNext = eslintConfig({
        react: {
          framework: "next",
          reactRefresh: true,
        },
      });

      // Should include both Next.js and React Refresh configs
      expect(configWithNext.some((c) => c.name === configNames.nextjs)).toBe(
        true,
      );
      expect(
        configWithNext.some((c) => c.name === configNames.reactRefresh),
      ).toBe(true);

      // With Vite framework but explicitly disabling React Refresh
      const configWithVite = eslintConfig({
        react: {
          framework: "vite",
          reactRefresh: false,
        },
      });

      // Should exclude React Refresh config
      expect(
        configWithVite.some((c) => c.name === configNames.reactRefresh),
      ).toBe(false);
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
        expect.arrayContaining(["**/dist/"]),
      );
    });

    it("handles user ignores with Next.js framework", () => {
      const config = eslintConfig({
        ignores: ["something else"],
        react: { framework: "next" },
      });
      const ignoresConfig = config[0];

      expect(ignoresConfig?.ignores).toStrictEqual(
        expect.arrayContaining([".next", "something else"]),
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

  describe("custom rules configuration", () => {
    it("adds custom rules to the base config when no plugin prefix is present", () => {
      const customRules = {
        "no-console": "off" as const,
        "no-unused-vars": "warn" as const,
      };

      const config = eslintConfig({ rules: customRules });
      const baseConfig = config.find((c) => c.name === configNames.base);

      expect(baseConfig?.rules?.["no-console"]).toBe("off");
      expect(baseConfig?.rules?.["no-unused-vars"]).toBe("warn");
    });

    it("adds TypeScript rules to the TypeScript config", () => {
      const customRules = {
        "@typescript-eslint/explicit-function-return-type": "warn" as const,
        "@typescript-eslint/no-explicit-any": "off" as const,
      };

      const config = eslintConfig({ rules: customRules });
      const tsConfig = config.find((c) => c.name === configNames.typescript);

      expect(tsConfig?.rules?.["@typescript-eslint/no-explicit-any"]).toBe(
        "off",
      );
      expect(
        tsConfig?.rules?.["@typescript-eslint/explicit-function-return-type"],
      ).toBe("warn");
    });

    it("adds React rules to the React config", () => {
      const customRules = {
        "react-hooks/exhaustive-deps": "warn" as const,
        "react/prop-types": "off" as const,
      };

      const config = eslintConfig({ react: true, rules: customRules });
      const reactConfig = config.find((c) => c.name === configNames.react);

      expect(reactConfig?.rules?.["react/prop-types"]).toBe("off");
      expect(reactConfig?.rules?.["react-hooks/exhaustive-deps"]).toBe("warn");
    });

    it("distributes mixed custom rules to their respective configs", () => {
      const customRules = {
        // TypeScript rules
        "@typescript-eslint/no-explicit-any": "off" as const,
        // Import rules
        "import/no-unresolved": "off" as const,
        // Base rules
        "no-console": "off" as const,
        // Perfectionist rules
        "perfectionist/sort-imports": "off" as const,
        // React rules
        "react/prop-types": "off" as const,
      };

      const config = eslintConfig({ react: true, rules: customRules });

      const baseConfig = config.find((c) => c.name === configNames.base);
      const tsConfig = config.find((c) => c.name === configNames.typescript);
      const reactConfig = config.find((c) => c.name === configNames.react);
      const importConfig = config.find((c) => c.name === configNames.import);
      const perfectionistConfig = config.find(
        (c) => c.name === configNames.perfectionist,
      );

      expect(baseConfig?.rules?.["no-console"]).toBe("off");
      expect(tsConfig?.rules?.["@typescript-eslint/no-explicit-any"]).toBe(
        "off",
      );
      expect(reactConfig?.rules?.["react/prop-types"]).toBe("off");
      expect(importConfig?.rules?.["import/no-unresolved"]).toBe("off");
      expect(perfectionistConfig?.rules?.["perfectionist/sort-imports"]).toBe(
        "off",
      );
    });

    it("handles rules for disabled features by not applying them", () => {
      const customRules = {
        "@typescript-eslint/no-explicit-any": "off" as const,
        "react/prop-types": "off" as const,
      };

      // Disable React and TypeScript
      const config = eslintConfig({
        react: false,
        rules: customRules,
        typescript: false,
      });

      // These configs should not exist
      expect(config.some((c) => c.name === configNames.react)).toBe(false);
      expect(config.some((c) => c.name === configNames.typescript)).toBe(false);

      // The rules should not have been applied anywhere
      // eslint-disable-next-line jest/no-conditional-in-test
      const allRules = config.flatMap((c) => Object.keys(c.rules ?? {}));

      expect(allRules).not.toContain("react/prop-types");
      expect(allRules).not.toContain("@typescript-eslint/no-explicit-any");
    });
  });

  /* eslint-disable jest/no-conditional-in-test */
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

      expect(errorRules).toStrictEqual([]);
    });
  });
});

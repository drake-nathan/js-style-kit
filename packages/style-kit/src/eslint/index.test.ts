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
      expect(baseConfig?.rules?.["func-style"]).toEqual("off");
    });

    it("applies 'declaration' function style when specified", () => {
      const config = eslintConfig({ functionStyle: "declaration" });
      const baseConfig = config.find((c) => c.name === configNames.base);

      expect(baseConfig?.rules?.["func-style"]).toEqual([
        "warn",
        "declaration",
        { allowArrowFunctions: true },
      ]);
    });

    it("applies 'expression' function style when specified", () => {
      const config = eslintConfig({ functionStyle: "expression" });
      const baseConfig = config.find((c) => c.name === configNames.base);

      expect(baseConfig?.rules?.["func-style"]).toEqual([
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
      ).toEqual([
        "warn",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "function-expression",
        },
      ]);
    });
  });

  describe("React configuration", () => {
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
      const config = eslintConfig({ react: true, reactCompiler: false });

      expect(config.some((c) => c.name === configNames.reactCompiler)).toBe(
        false,
      );
    });
  });

  describe("JSDoc configuration", () => {
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
      expect(jsdocConfig?.rules?.["jsdoc/require-jsdoc"]).toEqual(
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
  });

  describe("ignore patterns", () => {
    it("applies custom ignores", () => {
      const customIgnores = ["*.test.ts", "*.spec.ts"];
      const config = eslintConfig({ ignores: customIgnores });

      expect(config[0]?.ignores).toEqual(expect.arrayContaining(customIgnores));
    });

    it("handles empty ignores array", () => {
      const config = eslintConfig({ ignores: [] });
      const ignoresConfig = config[0];

      // Should still include default ignores
      expect(ignoresConfig?.ignores?.length).toBeGreaterThan(0);
      expect(ignoresConfig?.ignores).toEqual(
        expect.arrayContaining(["**/node_modules/", "**/dist/"]),
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
      ).toEqual([
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

  describe("edge cases", () => {
    it("works when all optional features are disabled", () => {
      const config = eslintConfig({
        jsdoc: false,
        react: false,
        sorting: false,
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
});

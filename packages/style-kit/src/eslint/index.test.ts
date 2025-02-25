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
});

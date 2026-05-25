import { describe, expect, it } from "bun:test";

import { oxlintConfig } from "./index.js";

describe("oxlintConfig", () => {
  describe("defaults", () => {
    it("returns the always-on ignore patterns", () => {
      const cfg = oxlintConfig();
      expect(cfg.ignorePatterns).toContain("**/node_modules/**");
      expect(cfg.ignorePatterns).toContain("**/dist/**");
      expect(cfg.ignorePatterns).toContain("**/build/**");
    });

    it("registers the default plugin set", () => {
      const cfg = oxlintConfig();
      expect(cfg.plugins).toContain("eslint");
      expect(cfg.plugins).toContain("typescript");
      expect(cfg.plugins).toContain("import");
      expect(cfg.plugins).toContain("unicorn");
      expect(cfg.plugins).toContain("jsdoc");
    });

    it("populates base correctness rules", () => {
      const cfg = oxlintConfig();
      expect(cfg.rules?.eqeqeq).toBe("warn");
      expect(cfg.rules?.["no-debugger"]).toBe("warn");
      expect(cfg.rules?.["prefer-const"]).toBe("warn");
    });

    it("populates typescript rules under typescript/ prefix", () => {
      const cfg = oxlintConfig();
      expect(cfg.rules?.["typescript/no-explicit-any"]).toBe("warn");
      expect(cfg.rules?.["typescript/no-floating-promises"]).toBe("warn");
    });

    it("populates import rules under import/ prefix", () => {
      const cfg = oxlintConfig();
      expect(cfg.rules?.["import/first"]).toBe("warn");
      expect(cfg.rules?.["import/no-cycle"]).toBe("warn");
    });

    it("populates unicorn rules with default kebabCase filename case", () => {
      const cfg = oxlintConfig();
      const rule = cfg.rules?.["unicorn/filename-case"];
      expect(Array.isArray(rule)).toBe(true);
      if (Array.isArray(rule)) {
        expect((rule[1] as { case: string }).case).toBe("kebabCase");
      }
    });

    it("populates jsdoc rules", () => {
      const cfg = oxlintConfig();
      expect(cfg.rules?.["jsdoc/check-access"]).toBe("warn");
      expect(cfg.rules?.["jsdoc/require-param"]).toBe("off"); // requireJsdoc false
    });

    it("enables type-aware mode when typescript is on", () => {
      const cfg = oxlintConfig();
      expect(cfg.options?.typeAware).toBe(true);
    });

    it("starts with empty jsPlugins and overrides arrays", () => {
      const cfg = oxlintConfig();
      expect(cfg.jsPlugins).toEqual([]);
      expect(cfg.overrides).toEqual([]);
    });
  });

  describe("ignores", () => {
    it("appends user-supplied patterns to the defaults", () => {
      const cfg = oxlintConfig({ ignores: ["coverage/**", ".next/**"] });
      expect(cfg.ignorePatterns).toContain("**/node_modules/**");
      expect(cfg.ignorePatterns).toContain("coverage/**");
      expect(cfg.ignorePatterns).toContain(".next/**");
    });
  });

  describe("rules override (shallow merge)", () => {
    it("shallow-merges user rules onto the base map", () => {
      const cfg = oxlintConfig({
        rules: {
          eqeqeq: "off",
          "my-custom/rule": "error",
        },
      });
      expect(cfg.rules?.eqeqeq).toBe("off");
      expect(cfg.rules?.["my-custom/rule"]).toBe("error");
      expect(cfg.rules?.["no-debugger"]).toBe("warn");
    });

    it("user rules win over plugin defaults", () => {
      const cfg = oxlintConfig({
        rules: { "typescript/no-explicit-any": "off" },
      });
      expect(cfg.rules?.["typescript/no-explicit-any"]).toBe("off");
    });
  });

  describe("overrides passthrough", () => {
    it("forwards user overrides", () => {
      const cfg = oxlintConfig({
        overrides: [{ files: ["*.test.ts"], rules: { "no-console": "off" } }],
      });
      expect(cfg.overrides).toHaveLength(1);
      expect(cfg.overrides?.[0]?.files).toEqual(["*.test.ts"]);
    });
  });

  describe("functionStyle", () => {
    it("enables built-in func-style for 'declaration'", () => {
      const cfg = oxlintConfig({ functionStyle: "declaration" });
      const rule = cfg.rules?.["func-style"];
      expect(Array.isArray(rule)).toBe(true);
      if (Array.isArray(rule)) {
        expect(rule[0]).toBe("warn");
        expect(rule[1]).toBe("declaration");
      }
    });

    it("leaves func-style unset for 'arrow' (handled by JS plugin in T08)", () => {
      const cfg = oxlintConfig({ functionStyle: "arrow" });
      expect(cfg.rules?.["func-style"]).toBeUndefined();
    });

    it("leaves func-style unset for 'off'", () => {
      const cfg = oxlintConfig({ functionStyle: "off" });
      expect(cfg.rules?.["func-style"]).toBeUndefined();
    });
  });

  describe("typescript: false", () => {
    it("disables typescript plugin and adds plain no-unused-vars", () => {
      const cfg = oxlintConfig({ typescript: false });
      expect(cfg.plugins).not.toContain("typescript");
      expect(cfg.rules?.["typescript/no-explicit-any"]).toBeUndefined();
      expect(cfg.rules?.["no-unused-vars"]).toBe("warn");
      expect(cfg.options?.typeAware).toBe(false);
    });

    it("adds import resolution rules when ts is off", () => {
      const cfg = oxlintConfig({ typescript: false });
      expect(cfg.rules?.["import/default"]).toBe("warn");
      expect(cfg.rules?.["import/named"]).toBe("warn");
    });
  });

  describe("toggles", () => {
    it("disables import plugin when importPlugin is false", () => {
      const cfg = oxlintConfig({ importPlugin: false });
      expect(cfg.plugins).not.toContain("import");
      expect(cfg.rules?.["import/first"]).toBeUndefined();
    });

    it("disables unicorn plugin when unicorn is false", () => {
      const cfg = oxlintConfig({ unicorn: false });
      expect(cfg.plugins).not.toContain("unicorn");
      expect(cfg.rules?.["unicorn/filename-case"]).toBeUndefined();
    });

    it("respects custom filenameCase under unicorn", () => {
      const cfg = oxlintConfig({ unicorn: { filenameCase: "camelCase" } });
      const rule = cfg.rules?.["unicorn/filename-case"];
      if (Array.isArray(rule)) {
        expect((rule[1] as { case: string }).case).toBe("camelCase");
      }
    });

    it("disables jsdoc when jsdoc is false", () => {
      const cfg = oxlintConfig({ jsdoc: false });
      expect(cfg.plugins).not.toContain("jsdoc");
      expect(cfg.rules?.["jsdoc/check-access"]).toBeUndefined();
    });

    it("turns on require-jsdoc family when requireJsdoc is true", () => {
      const cfg = oxlintConfig({ jsdoc: { requireJsdoc: true } });
      expect(cfg.rules?.["jsdoc/require-param"]).toBe("warn");
      expect(cfg.rules?.["jsdoc/require-returns"]).toBe("warn");
    });
  });
});

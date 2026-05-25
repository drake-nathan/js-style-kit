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

    it("registers the eslint plugin", () => {
      const cfg = oxlintConfig();
      expect(cfg.plugins).toEqual(["eslint"]);
    });

    it("populates base correctness rules", () => {
      const cfg = oxlintConfig();
      expect(cfg.rules?.eqeqeq).toBe("warn");
      expect(cfg.rules?.["no-debugger"]).toBe("warn");
      expect(cfg.rules?.["prefer-const"]).toBe("warn");
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
      // overridden
      expect(cfg.rules?.eqeqeq).toBe("off");
      // user-added
      expect(cfg.rules?.["my-custom/rule"]).toBe("error");
      // untouched
      expect(cfg.rules?.["no-debugger"]).toBe("warn");
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

    it("enables built-in func-style for 'expression'", () => {
      const cfg = oxlintConfig({ functionStyle: "expression" });
      const rule = cfg.rules?.["func-style"];
      expect(Array.isArray(rule)).toBe(true);
      if (Array.isArray(rule)) {
        expect(rule[1]).toBe("expression");
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

  describe("typescript", () => {
    it("does NOT add no-unused-vars when typescript is on (TS variant takes over in T06)", () => {
      const cfg = oxlintConfig({ typescript: true });
      expect(cfg.rules?.["no-unused-vars"]).toBeUndefined();
      expect(cfg.rules?.["no-unused-expressions"]).toBeUndefined();
    });

    it("adds no-unused-vars when typescript is off", () => {
      const cfg = oxlintConfig({ typescript: false });
      expect(cfg.rules?.["no-unused-vars"]).toBe("warn");
      expect(cfg.rules?.["no-unused-expressions"]).toBe("warn");
    });
  });
});

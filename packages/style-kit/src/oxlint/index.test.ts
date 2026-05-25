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

    it("includes the testing override by default (vitest, test glob)", () => {
      const cfg = oxlintConfig();
      expect(cfg.overrides).toHaveLength(1);
      expect(cfg.overrides?.[0]?.files).toEqual([
        "**/*.{test,spec}.{ts,tsx,js,jsx}",
      ]);
      expect(cfg.plugins).toContain("vitest");
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
    it("forwards user overrides ahead of built-in ones", () => {
      const cfg = oxlintConfig({
        overrides: [{ files: ["*.test.ts"], rules: { "no-console": "off" } }],
        testing: false,
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

  describe("react", () => {
    it("does not register react plugins when react is false", () => {
      const cfg = oxlintConfig();
      expect(cfg.plugins).not.toContain("react");
      expect(cfg.plugins).not.toContain("jsx-a11y");
      expect(cfg.rules?.["react/rules-of-hooks"]).toBeUndefined();
      // react-hooks-js alias only registered when react is on
      const hasReactHooksJs = cfg.jsPlugins?.some(
        (p) => typeof p !== "string" && p.name === "react-hooks-js",
      );
      expect(hasReactHooksJs).toBeFalsy();
    });

    it("enables react + jsx-a11y when react: true", () => {
      const cfg = oxlintConfig({ react: true });
      expect(cfg.plugins).toContain("react");
      expect(cfg.plugins).toContain("jsx-a11y");
      expect(cfg.rules?.["react/rules-of-hooks"]).toBe("warn");
      expect(cfg.rules?.["react/exhaustive-deps"]).toBe("warn");
      expect(cfg.rules?.["react/jsx-key"]).toBe("warn");
    });

    it("loads aliased react-hooks-js JS plugin with React 19 rules", () => {
      const cfg = oxlintConfig({ react: true });
      const aliased = cfg.jsPlugins?.find(
        (p): p is { name: string; specifier: string } =>
          typeof p !== "string" && p.name === "react-hooks-js",
      );
      expect(aliased?.specifier).toBe("eslint-plugin-react-hooks");
      expect(cfg.rules?.["react-hooks-js/preserve-manual-memoization"]).toBe(
        "warn",
      );
      expect(cfg.rules?.["react-hooks-js/purity"]).toBe("warn");
    });

    it("enables only-export-components for vite framework", () => {
      const cfg = oxlintConfig({ react: { framework: "vite" } });
      const rule = cfg.rules?.["react/only-export-components"];
      expect(Array.isArray(rule)).toBe(true);
    });

    it("enables only-export-components for 'none' (default)", () => {
      const cfg = oxlintConfig({ react: true });
      expect(cfg.rules?.["react/only-export-components"]).toBeDefined();
    });

    it("disables only-export-components for next framework", () => {
      const cfg = oxlintConfig({ react: { framework: "next" } });
      expect(cfg.rules?.["react/only-export-components"]).toBeUndefined();
    });

    it("disables only-export-components for remix and react-router", () => {
      const remix = oxlintConfig({ react: { framework: "remix" } });
      const rr = oxlintConfig({ react: { framework: "react-router" } });
      expect(remix.rules?.["react/only-export-components"]).toBeUndefined();
      expect(rr.rules?.["react/only-export-components"]).toBeUndefined();
    });

    it("enables nextjs plugin and rules only for next framework", () => {
      const next = oxlintConfig({ react: { framework: "next" } });
      const vite = oxlintConfig({ react: { framework: "vite" } });
      expect(next.plugins).toContain("nextjs");
      expect(next.rules?.["nextjs/no-html-link-for-pages"]).toBe("warn");
      expect(vite.plugins).not.toContain("nextjs");
      expect(vite.rules?.["nextjs/no-html-link-for-pages"]).toBeUndefined();
    });
  });

  describe("perfectionist (non-import sorting)", () => {
    it("enables by default", () => {
      const cfg = oxlintConfig();
      expect(cfg.jsPlugins).toContain("eslint-plugin-perfectionist");
      expect(cfg.rules?.["perfectionist/sort-objects"]).toBeDefined();
      expect(cfg.rules?.["perfectionist/sort-jsx-props"]).toBeDefined();
    });

    it("does NOT enable perfectionist/sort-imports (owned by oxfmt)", () => {
      const cfg = oxlintConfig();
      expect(cfg.rules?.["perfectionist/sort-imports"]).toBeUndefined();
    });

    it("can be turned off", () => {
      const cfg = oxlintConfig({ sorting: false });
      expect(cfg.jsPlugins).not.toContain("eslint-plugin-perfectionist");
      expect(cfg.rules?.["perfectionist/sort-objects"]).toBeUndefined();
    });
  });

  describe("opt-in JS plugins", () => {
    it("tailwind: registers oxlint-tailwindcss JS plugin and rules", () => {
      const cfg = oxlintConfig({ tailwind: true });
      const reg = cfg.jsPlugins?.some(
        (p) => typeof p !== "string" && p.name === "tailwindcss",
      );
      expect(reg).toBe(true);
      expect(cfg.rules?.["tailwindcss/classnames-order"]).toBe("warn");
    });

    it("query: registers @tanstack/eslint-plugin-query", () => {
      const cfg = oxlintConfig({ query: true });
      const reg = cfg.jsPlugins?.some(
        (p) => typeof p !== "string" && p.name === "query",
      );
      expect(reg).toBe(true);
      expect(cfg.rules?.["query/exhaustive-deps"]).toBe("warn");
    });

    it("convex: registers @convex-dev/eslint-plugin", () => {
      const cfg = oxlintConfig({ convex: true });
      const reg = cfg.jsPlugins?.some(
        (p) => typeof p !== "string" && p.name === "convex",
      );
      expect(reg).toBe(true);
    });

    it("turbo: registers eslint-plugin-turbo", () => {
      const cfg = oxlintConfig({ turbo: true });
      expect(cfg.rules?.["turbo/no-undeclared-env-vars"]).toBe("warn");
    });

    it("storybook: adds override scoped to *.stories.*", () => {
      const cfg = oxlintConfig({ storybook: true });
      const sb = cfg.overrides?.find((o) =>
        o.files.some((f) => f.includes(".stories.")),
      );
      expect(sb).toBeDefined();
      expect(sb?.rules?.["storybook/default-exports"]).toBe("warn");
    });

    it("none of the opt-ins fire when their flags are off", () => {
      const cfg = oxlintConfig();
      const jsPluginNames = (cfg.jsPlugins ?? []).map((p) =>
        typeof p === "string" ? p : p.name,
      );
      expect(jsPluginNames).not.toContain("tailwindcss");
      expect(jsPluginNames).not.toContain("query");
      expect(jsPluginNames).not.toContain("convex");
      expect(jsPluginNames).not.toContain("turbo");
      expect(jsPluginNames).not.toContain("storybook");
    });
  });

  describe("testing", () => {
    it("uses jest plugin when framework=jest", () => {
      const cfg = oxlintConfig({ testing: { framework: "jest" } });
      expect(cfg.plugins).toContain("jest");
      expect(cfg.plugins).not.toContain("vitest");
      const override = cfg.overrides?.find((o) =>
        o.files.some((f) => f.includes("test")),
      );
      expect(override?.rules?.["jest/expect-expect"]).toBe("warn");
    });

    it("uses jest plugin for bun framework", () => {
      const cfg = oxlintConfig({ testing: { framework: "bun" } });
      expect(cfg.plugins).toContain("jest");
    });

    it("disables testing entirely when testing: false", () => {
      const cfg = oxlintConfig({ testing: false });
      expect(cfg.plugins).not.toContain("vitest");
      expect(cfg.plugins).not.toContain("jest");
      expect(cfg.overrides).toEqual([]);
    });

    it("respects custom files glob", () => {
      const cfg = oxlintConfig({
        testing: { files: ["src/**/*.spec.ts"] },
      });
      const override = cfg.overrides?.[0];
      expect(override?.files).toEqual(["src/**/*.spec.ts"]);
    });

    it("itOrTest threads through to consistent-test-it", () => {
      const cfg = oxlintConfig({ testing: { itOrTest: "test" } });
      const override = cfg.overrides?.[0];
      const rule = override?.rules?.["vitest/consistent-test-it"];
      if (Array.isArray(rule)) {
        expect((rule[1] as { fn: string }).fn).toBe("test");
      }
    });
  });

  describe("prefer-arrow-functions (functionStyle=arrow)", () => {
    it("loads the JS plugin and rule when arrow (default)", () => {
      const cfg = oxlintConfig();
      expect(cfg.jsPlugins).toContain("eslint-plugin-prefer-arrow-functions");
      expect(
        cfg.rules?.["prefer-arrow-functions/prefer-arrow-functions"],
      ).toBeDefined();
    });

    it("does NOT load the JS plugin for non-arrow function styles", () => {
      for (const fs of ["declaration", "expression", "off"] as const) {
        const cfg = oxlintConfig({ functionStyle: fs });
        expect(cfg.jsPlugins).not.toContain(
          "eslint-plugin-prefer-arrow-functions",
        );
        expect(
          cfg.rules?.["prefer-arrow-functions/prefer-arrow-functions"],
        ).toBeUndefined();
      }
    });
  });
});

/**
 * Unit tests for JSDoc configuration
 * Tests jsdocConfig() and jsdocRules() in isolation to verify:
 * - requireJsdoc parameter handling (enables/disables JSDoc requirements)
 * - typescript parameter handling in rules (affects no-types and no-undefined-types)
 * - File patterns (includes JS/TS files, excludes test files)
 * - Config structure (plugins, name)
 * - Custom rules merging
 * - All core JSDoc rules are included
 */
import { describe, expect, it } from "bun:test";
import jsdoc from "eslint-plugin-jsdoc";

import type { EslintRuleConfig } from "../types.js";
import type { JsdocRules } from "./types.js";

import { configNames } from "../constants.js";
import { jsdocConfig } from "./config.js";
import { jsdocRules } from "./rules.js";

type RequireJsdocOptions =
  JsdocRules["jsdoc/require-jsdoc"] extends (
    EslintRuleConfig<infer TOpt, infer _T2>
  ) ?
    TOpt
  : never;

const isRequireJsdocOptions = (value: unknown): value is RequireJsdocOptions =>
  typeof value === "object" &&
  value !== null &&
  "require" in (value as Record<string, unknown>);

const getRequireJsdocOptions = (
  rule: JsdocRules["jsdoc/require-jsdoc"],
): RequireJsdocOptions => {
  if (!Array.isArray(rule)) {
    throw new TypeError(
      "`jsdoc/require-jsdoc` should be an array when enabled",
    );
  }
  const opts = rule[1];
  if (!isRequireJsdocOptions(opts)) {
    throw new Error("Invalid options for `jsdoc/require-jsdoc`");
  }
  return opts;
};

describe("jsdocRules", () => {
  describe("requireJsdoc parameter", () => {
    it("disables JSDoc requirements by default", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/require-jsdoc"]).toBe("off");
      expect(rules["jsdoc/require-description"]).toBe("off");
      expect(rules["jsdoc/require-param"]).toBe("off");
      expect(rules["jsdoc/require-property"]).toBe("off");
      expect(rules["jsdoc/require-returns"]).toBe("off");
    });

    it("disables JSDoc requirements when explicitly false", () => {
      const rules = jsdocRules(false);

      expect(rules["jsdoc/require-jsdoc"]).toBe("off");
      expect(rules["jsdoc/require-description"]).toBe("off");
      expect(rules["jsdoc/require-param"]).toBe("off");
      expect(rules["jsdoc/require-property"]).toBe("off");
      expect(rules["jsdoc/require-returns"]).toBe("off");
    });

    it("enables JSDoc requirements when true", () => {
      const rules = jsdocRules(true);

      expect(rules["jsdoc/require-jsdoc"]).toStrictEqual([
        "warn",
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ]);
      expect(rules["jsdoc/require-description"]).toBe("warn");
      expect(rules["jsdoc/require-param"]).toBe("warn");
      expect(rules["jsdoc/require-property"]).toBe("warn");
      expect(rules["jsdoc/require-returns"]).toBe("warn");
    });

    it("enables require-jsdoc for all function types when true", () => {
      const rules = jsdocRules(true);
      const requireJsdocRule = rules["jsdoc/require-jsdoc"];

      const options = getRequireJsdocOptions(requireJsdocRule);

      expect(options.require?.ArrowFunctionExpression).toBe(true);
      expect(options.require?.ClassDeclaration).toBe(true);
      expect(options.require?.ClassExpression).toBe(true);
      expect(options.require?.FunctionDeclaration).toBe(true);
      expect(options.require?.FunctionExpression).toBe(true);
      expect(options.require?.MethodDefinition).toBe(true);
    });
  });

  describe("typescript parameter", () => {
    it("uses TypeScript-friendly defaults by default", () => {
      const rules = jsdocRules();

      // When TypeScript is enabled (default), no-types is warn and no-undefined-types is off
      expect(rules["jsdoc/no-types"]).toBe("warn");
      expect(rules["jsdoc/no-undefined-types"]).toBe("off");
    });

    it("uses TypeScript-friendly rules when explicitly true", () => {
      const rules = jsdocRules(false, true);

      expect(rules["jsdoc/no-types"]).toBe("warn");
      expect(rules["jsdoc/no-undefined-types"]).toBe("off");
    });

    it("uses non-TypeScript rules when false", () => {
      const rules = jsdocRules(false, false);

      // When TypeScript is disabled, no-types is off and no-undefined-types is warn
      expect(rules["jsdoc/no-types"]).toBe("off");
      expect(rules["jsdoc/no-undefined-types"]).toBe("warn");
    });

    it("works with both requireJsdoc and typescript parameters", () => {
      const rules = jsdocRules(true, false);

      // Both parameters should be respected
      expect(rules["jsdoc/require-jsdoc"]).toBeDefined();
      expect(rules["jsdoc/require-jsdoc"]).not.toBe("off");
      expect(rules["jsdoc/no-types"]).toBe("off");
      expect(rules["jsdoc/no-undefined-types"]).toBe("warn");
    });
  });

  describe("core rules", () => {
    it("includes all expected JSDoc validation rules", () => {
      const rules = jsdocRules();

      // Validation rules
      expect(rules["jsdoc/check-access"]).toBe("warn");
      expect(rules["jsdoc/check-alignment"]).toBe("warn");
      expect(rules["jsdoc/check-property-names"]).toBe("warn");
      expect(rules["jsdoc/check-types"]).toBe("warn");
      expect(rules["jsdoc/check-values"]).toBe("warn");
      expect(rules["jsdoc/valid-types"]).toBe("warn");
    });

    it("includes check-param-names with correct configuration", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/check-param-names"]).toStrictEqual([
        "warn",
        {
          checkDestructured: true,
          enableFixer: true,
        },
      ]);
    });

    it("includes check-tag-names with typed option", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/check-tag-names"]).toStrictEqual([
        "warn",
        {
          typed: true,
        },
      ]);
    });

    it("includes formatting rules", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/empty-tags"]).toBe("warn");
      expect(rules["jsdoc/multiline-blocks"]).toBe("warn");
      expect(rules["jsdoc/no-multi-asterisks"]).toBe("warn");
      expect(rules["jsdoc/require-asterisk-prefix"]).toBe("warn");
    });

    it("includes tag-lines with correct configuration", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/tag-lines"]).toStrictEqual([
        "warn",
        "never",
        {
          startLines: 1,
          tags: {
            param: { lines: "never" },
          },
        },
      ]);
    });

    it("includes description and name requirement rules", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/require-param-description"]).toBe("warn");
      expect(rules["jsdoc/require-param-name"]).toBe("warn");
      expect(rules["jsdoc/require-property-description"]).toBe("warn");
      expect(rules["jsdoc/require-property-name"]).toBe("warn");
      expect(rules["jsdoc/require-returns-description"]).toBe("warn");
    });

    it("includes yield rules", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/require-yields"]).toBe("warn");
      expect(rules["jsdoc/require-yields-check"]).toBe("warn");
    });

    it("includes other validation rules", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/implements-on-classes"]).toBe("warn");
      expect(rules["jsdoc/no-defaults"]).toBe("warn");
      expect(rules["jsdoc/require-returns-check"]).toBe("warn");
    });

    it("disables certain rules", () => {
      const rules = jsdocRules();

      expect(rules["jsdoc/no-blank-block-descriptions"]).toBe("off");
      expect(rules["jsdoc/text-escaping"]).toBe("off");
    });
  });
});

describe("jsdocConfig", () => {
  describe("config structure", () => {
    it("returns a valid ESLint config object", () => {
      const config = jsdocConfig();

      expect(config).toBeInstanceOf(Object);
      expect(config.name).toBe(configNames.jsdoc);
    });

    it("includes jsdoc plugin", () => {
      const config = jsdocConfig();

      expect(config.plugins?.jsdoc).toBe(jsdoc);
    });

    it("uses correct config name", () => {
      const config = jsdocConfig();

      expect(config.name).toBe(configNames.jsdoc);
      expect(config.name).toBe("jsdoc");
    });
  });

  describe("file patterns", () => {
    it("applies to JavaScript and TypeScript files", () => {
      const config = jsdocConfig();

      expect(config.files).toStrictEqual(["**/*.{js,jsx,ts,tsx,cjs,mjs}"]);
    });

    it("ignores test and spec files", () => {
      const config = jsdocConfig();

      expect(config.ignores).toStrictEqual([
        "**/*.{test,spec}.{js,jsx,ts,tsx,cjs,mjs}",
      ]);
    });
  });

  describe("requireJsdoc parameter", () => {
    it("disables JSDoc requirements by default", () => {
      const config = jsdocConfig();

      expect(config.rules?.["jsdoc/require-jsdoc"]).toBe("off");
      expect(config.rules?.["jsdoc/require-description"]).toBe("off");
      expect(config.rules?.["jsdoc/require-param"]).toBe("off");
      expect(config.rules?.["jsdoc/require-property"]).toBe("off");
      expect(config.rules?.["jsdoc/require-returns"]).toBe("off");
    });

    it("disables JSDoc requirements when explicitly false", () => {
      const config = jsdocConfig(false);

      expect(config.rules?.["jsdoc/require-jsdoc"]).toBe("off");
    });

    it("enables JSDoc requirements when true", () => {
      const config = jsdocConfig(true);

      expect(config.rules?.["jsdoc/require-jsdoc"]).toStrictEqual([
        "warn",
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ]);
      expect(config.rules?.["jsdoc/require-description"]).toBe("warn");
      expect(config.rules?.["jsdoc/require-param"]).toBe("warn");
    });
  });

  describe("rules", () => {
    it("includes all default JSDoc rules", () => {
      const config = jsdocConfig();

      // Spot check some key rules
      expect(config.rules?.["jsdoc/check-access"]).toBe("warn");
      expect(config.rules?.["jsdoc/check-alignment"]).toBe("warn");
      expect(config.rules?.["jsdoc/valid-types"]).toBe("warn");
    });

    it("includes all rules from jsdocRules() function", () => {
      const config = jsdocConfig();
      const expectedRules = jsdocRules();

      Object.keys(expectedRules).forEach((ruleKey) => {
        // @ts-expect-error - ruleKey is a string but we've validated it exists
        expect(config.rules?.[ruleKey]).toStrictEqual(expectedRules[ruleKey]);
      });
    });

    it("uses TypeScript-friendly defaults (no-types enabled)", () => {
      const config = jsdocConfig();

      // jsdocRules defaults to typescript=true
      expect(config.rules?.["jsdoc/no-types"]).toBe("warn");
      expect(config.rules?.["jsdoc/no-undefined-types"]).toBe("off");
    });
  });

  describe("custom rules", () => {
    it("merges custom rules with default rules", () => {
      const customRules = {
        "jsdoc/check-access": "off" as const,
        "jsdoc/custom-rule": "warn" as const,
      };

      const config = jsdocConfig(false, customRules);

      // Custom rule should override default
      expect(config.rules?.["jsdoc/check-access"]).toBe("off");
      // Custom rule should be added
      expect(config.rules?.["jsdoc/custom-rule"]).toBe("warn");
      // Other rules should remain
      expect(config.rules?.["jsdoc/check-alignment"]).toBe("warn");
    });

    it("works with both requireJsdoc and custom rules", () => {
      const customRules = {
        "jsdoc/check-access": "off" as const,
      };

      const config = jsdocConfig(true, customRules);

      // Both requireJsdoc and custom rules should be applied
      expect(config.rules?.["jsdoc/require-jsdoc"]).toBeDefined();
      expect(config.rules?.["jsdoc/require-jsdoc"]).not.toBe("off");
      expect(config.rules?.["jsdoc/check-access"]).toBe("off");
    });

    it("custom rules take precedence over jsdocRules() function", () => {
      const customRules = {
        "jsdoc/require-jsdoc": "off" as const,
      };

      const config = jsdocConfig(true, customRules);

      // Custom rule should override the jsdocRules() function output
      expect(config.rules?.["jsdoc/require-jsdoc"]).toBe("off");
    });
  });

  describe("edge cases", () => {
    it("works with no parameters", () => {
      const config = jsdocConfig();

      expect(config.name).toBe(configNames.jsdoc);
      expect(config.plugins?.jsdoc).toBeDefined();
      expect(config.rules).toBeDefined();
    });

    it("works with only requireJsdoc parameter", () => {
      const config = jsdocConfig(true);

      expect(config.rules?.["jsdoc/require-jsdoc"]).toBeDefined();
    });

    it("works with only customRules parameter", () => {
      const config = jsdocConfig(undefined, { "jsdoc/check-access": "off" });

      expect(config.rules?.["jsdoc/check-access"]).toBe("off");
      // requireJsdoc should use default (false)
      expect(config.rules?.["jsdoc/require-jsdoc"]).toBe("off");
    });

    it("works with undefined customRules", () => {
      const config = jsdocConfig(false, undefined);

      expect(config.rules?.["jsdoc/check-access"]).toBe("warn");
    });
  });
});

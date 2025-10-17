/**
 * Unit tests for Unicorn configuration
 * Tests unicornConfig() and rules() in isolation to verify:
 * - Filename case parameter handling (kebabCase, camelCase, pascalCase, snakeCase)
 * - Default filename case behavior
 * - Config structure (plugins, name)
 * - Custom rules merging
 * - All core Unicorn rules are included
 */
import { describe, expect, it } from "bun:test";
import unicorn from "eslint-plugin-unicorn";

import { configNames } from "../constants.js";
import { unicornConfig } from "./config.js";
import { rules } from "./rules.js";

describe("rules", () => {
  describe("filenameCase parameter", () => {
    it("uses kebabCase by default", () => {
      const unicornRules = rules();

      expect(unicornRules["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "kebabCase" },
      ]);
    });

    it("accepts kebabCase explicitly", () => {
      const unicornRules = rules("kebabCase");

      expect(unicornRules["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "kebabCase" },
      ]);
    });

    it("accepts camelCase", () => {
      const unicornRules = rules("camelCase");

      expect(unicornRules["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "camelCase" },
      ]);
    });

    it("accepts pascalCase", () => {
      const unicornRules = rules("pascalCase");

      expect(unicornRules["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "pascalCase" },
      ]);
    });

    it("accepts snakeCase", () => {
      const unicornRules = rules("snakeCase");

      expect(unicornRules["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "snakeCase" },
      ]);
    });
  });

  describe("core rules", () => {
    it("includes all expected Unicorn rules", () => {
      const unicornRules = rules();

      // Check that all core unicorn rules are present
      expect(unicornRules["unicorn/better-regex"]).toBe("warn");
      expect(unicornRules["unicorn/error-message"]).toBe("warn");
      expect(unicornRules["unicorn/new-for-builtins"]).toBe("warn");
      expect(unicornRules["unicorn/no-console-spaces"]).toBe("warn");
      expect(unicornRules["unicorn/no-for-loop"]).toBe("warn");
      expect(unicornRules["unicorn/prefer-add-event-listener"]).toBe("warn");
      expect(unicornRules["unicorn/prefer-node-protocol"]).toBe("warn");
      expect(unicornRules["unicorn/prefer-string-replace-all"]).toBe("warn");
      expect(unicornRules["unicorn/prefer-type-error"]).toBe("warn");
      expect(unicornRules["unicorn/text-encoding-identifier-case"]).toBe(
        "warn",
      );
    });

    it("includes switch-case-braces with correct configuration", () => {
      const unicornRules = rules();

      expect(unicornRules["unicorn/switch-case-braces"]).toStrictEqual([
        "warn",
        "always",
      ]);
    });

    it("includes filename-case rule", () => {
      const unicornRules = rules();

      expect(unicornRules["unicorn/filename-case"]).toBeDefined();
      expect(Array.isArray(unicornRules["unicorn/filename-case"])).toBe(true);
    });
  });

  describe("rule consistency across filename cases", () => {
    it("returns same rules except filename-case for different filename cases", () => {
      const kebabRules = rules("kebabCase");
      const camelRules = rules("camelCase");

      // All rules except filename-case should be identical
      const kebabKeys = Object.keys(kebabRules).filter(
        (k) => k !== "unicorn/filename-case",
      );
      const camelKeys = Object.keys(camelRules).filter(
        (k) => k !== "unicorn/filename-case",
      );

      expect(kebabKeys).toStrictEqual(camelKeys);

      kebabKeys.forEach((key) => {
        // @ts-expect-error - key is a string but we've validated it exists
        expect(kebabRules[key]).toStrictEqual(camelRules[key]);
      });
    });
  });
});

describe("unicornConfig", () => {
  describe("config structure", () => {
    it("returns a valid ESLint config object", () => {
      const config = unicornConfig({});

      expect(config).toBeInstanceOf(Object);
      expect(config.name).toBe(configNames.unicorn);
    });

    it("includes unicorn plugin", () => {
      const config = unicornConfig({});

      expect(config.plugins?.unicorn).toBe(unicorn);
    });

    it("uses correct config name", () => {
      const config = unicornConfig({});

      expect(config.name).toBe(configNames.unicorn);
      expect(config.name).toBe("unicorn");
    });
  });

  describe("filenameCase option", () => {
    it("uses kebabCase by default", () => {
      const config = unicornConfig({});

      expect(config.rules?.["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "kebabCase" },
      ]);
    });

    it("accepts custom filenameCase", () => {
      const config = unicornConfig({ filenameCase: "camelCase" });

      expect(config.rules?.["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "camelCase" },
      ]);
    });

    it("accepts pascalCase", () => {
      const config = unicornConfig({ filenameCase: "pascalCase" });

      expect(config.rules?.["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "pascalCase" },
      ]);
    });

    it("accepts snakeCase", () => {
      const config = unicornConfig({ filenameCase: "snakeCase" });

      expect(config.rules?.["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "snakeCase" },
      ]);
    });
  });

  describe("rules", () => {
    it("includes all default Unicorn rules", () => {
      const config = unicornConfig({});

      // Spot check some key rules
      expect(config.rules?.["unicorn/better-regex"]).toBe("warn");
      expect(config.rules?.["unicorn/error-message"]).toBe("warn");
      expect(config.rules?.["unicorn/prefer-node-protocol"]).toBe("warn");
      expect(config.rules?.["unicorn/no-for-loop"]).toBe("warn");
    });

    it("includes all rules from rules() function", () => {
      const config = unicornConfig({});
      const expectedRules = rules();

      Object.keys(expectedRules).forEach((ruleKey) => {
        // @ts-expect-error - ruleKey is a string but we've validated it exists
        expect(config.rules?.[ruleKey]).toStrictEqual(expectedRules[ruleKey]);
      });
    });
  });

  describe("custom rules", () => {
    it("merges custom rules with default rules", () => {
      const customRules = {
        "unicorn/better-regex": "off" as const,
        "unicorn/custom-rule": "warn" as const,
      };

      const config = unicornConfig({ customRules });

      // Custom rule should override default
      expect(config.rules?.["unicorn/better-regex"]).toBe("off");
      // Custom rule should be added
      expect(config.rules?.["unicorn/custom-rule"]).toBe("warn");
      // Other rules should remain
      expect(config.rules?.["unicorn/error-message"]).toBe("warn");
    });

    it("works with both custom rules and custom filenameCase", () => {
      const customRules = {
        "unicorn/better-regex": "off" as const,
      };

      const config = unicornConfig({
        customRules,
        filenameCase: "pascalCase",
      });

      // Both filenameCase and custom rules should be applied
      expect(config.rules?.["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "pascalCase" },
      ]);
      expect(config.rules?.["unicorn/better-regex"]).toBe("off");
    });

    it("custom rules take precedence over rules() function", () => {
      const customRules = {
        "unicorn/filename-case": "off" as const,
      };

      const config = unicornConfig({
        customRules,
        filenameCase: "kebabCase",
      });

      // Custom rule should override the rules() function output
      expect(config.rules?.["unicorn/filename-case"]).toBe("off");
    });
  });

  describe("empty config", () => {
    it("works with empty options object", () => {
      const config = unicornConfig({});

      expect(config.name).toBe(configNames.unicorn);
      expect(config.plugins?.unicorn).toBeDefined();
      expect(config.rules).toBeDefined();
    });

    it("works with undefined customRules", () => {
      const config = unicornConfig({ customRules: undefined });

      expect(config.rules?.["unicorn/better-regex"]).toBe("warn");
    });

    it("works with undefined filenameCase", () => {
      const config = unicornConfig({ filenameCase: undefined });

      // Should use default kebabCase
      expect(config.rules?.["unicorn/filename-case"]).toStrictEqual([
        "warn",
        { case: "kebabCase" },
      ]);
    });
  });
});

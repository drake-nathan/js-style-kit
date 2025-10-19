import { describe, expect, it } from "bun:test";
import globals from "globals";

import { configNames } from "../constants.js";
import { reactEslintConfig } from "./config.js";
import { reactRules } from "./rules.js";

/**
 * Unit tests for React configuration
 * Tests reactEslintConfig() and reactRules() in isolation to verify:
 * - TypeScript option handling (prop-types conditional logic)
 * - React compiler rules inclusion/exclusion
 * - Function style mapping (arrow, declaration, expression, off)
 * - Config structure (plugins, globals, settings, parser options)
 * - Custom rules merging
 */
describe("reactRules", () => {
  describe("typescript option", () => {
    it("excludes prop-types rule when TypeScript is enabled", () => {
      const rules = reactRules({
        functionStyle: "arrow",
        reactCompiler: true,
        typescript: true,
      });

      expect(rules["react/prop-types"]).toBeUndefined();
    });

    it("includes prop-types rule when TypeScript is disabled", () => {
      const rules = reactRules({
        functionStyle: "arrow",
        reactCompiler: true,
        typescript: false,
      });

      expect(rules["react/prop-types"]).toBe("warn");
    });
  });

  describe("reactCompiler option", () => {
    it("includes React compiler rules when enabled", () => {
      const rules = reactRules({
        functionStyle: "arrow",
        reactCompiler: true,
        typescript: true,
      });

      // Core hooks rules should always be present
      expect(rules["react-hooks/rules-of-hooks"]).toBe("warn");
      expect(rules["react-hooks/exhaustive-deps"]).toBe("warn");

      // Compiler-specific rules
      expect(rules["react-hooks/purity"]).toBe("warn");
      expect(rules["react-hooks/immutability"]).toBe("warn");
      expect(rules["react-hooks/use-memo"]).toBe("warn");
      expect(rules["react-hooks/error-boundaries"]).toBe("warn");
      expect(rules["react-hooks/globals"]).toBe("warn");
      expect(rules["react-hooks/incompatible-library"]).toBe("warn");
      expect(rules["react-hooks/preserve-manual-memoization"]).toBe("warn");
      expect(rules["react-hooks/refs"]).toBe("warn");
      expect(rules["react-hooks/set-state-in-effect"]).toBe("warn");
      expect(rules["react-hooks/set-state-in-render"]).toBe("warn");
      expect(rules["react-hooks/unsupported-syntax"]).toBe("warn");
    });

    it("excludes React compiler rules when disabled", () => {
      const rules = reactRules({
        functionStyle: "arrow",
        reactCompiler: false,
        typescript: true,
      });

      // Core hooks rules should still be present
      expect(rules["react-hooks/rules-of-hooks"]).toBe("warn");
      expect(rules["react-hooks/exhaustive-deps"]).toBe("warn");

      // Compiler-specific rules should be absent
      expect(rules["react-hooks/purity"]).toBeUndefined();
      expect(rules["react-hooks/immutability"]).toBeUndefined();
      expect(rules["react-hooks/use-memo"]).toBeUndefined();
      expect(rules["react-hooks/error-boundaries"]).toBeUndefined();
      expect(rules["react-hooks/globals"]).toBeUndefined();
      expect(rules["react-hooks/incompatible-library"]).toBeUndefined();
      expect(rules["react-hooks/preserve-manual-memoization"]).toBeUndefined();
      expect(rules["react-hooks/refs"]).toBeUndefined();
      expect(rules["react-hooks/set-state-in-effect"]).toBeUndefined();
      expect(rules["react-hooks/set-state-in-render"]).toBeUndefined();
      expect(rules["react-hooks/unsupported-syntax"]).toBeUndefined();
    });
  });

  describe("functionStyle option", () => {
    it("configures arrow function style correctly", () => {
      const rules = reactRules({
        functionStyle: "arrow",
        reactCompiler: true,
        typescript: true,
      });

      expect(rules["react/function-component-definition"]).toStrictEqual([
        "warn",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ]);
    });

    it("configures function declaration style correctly", () => {
      const rules = reactRules({
        functionStyle: "declaration",
        reactCompiler: true,
        typescript: true,
      });

      expect(rules["react/function-component-definition"]).toStrictEqual([
        "warn",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "function-expression",
        },
      ]);
    });

    it("configures function expression style correctly", () => {
      const rules = reactRules({
        functionStyle: "expression",
        reactCompiler: true,
        typescript: true,
      });

      expect(rules["react/function-component-definition"]).toStrictEqual([
        "warn",
        {
          namedComponents: "function-expression",
          unnamedComponents: "function-expression",
        },
      ]);
    });

    it("disables function style enforcement when 'off'", () => {
      const rules = reactRules({
        functionStyle: "off",
        reactCompiler: true,
        typescript: true,
      });

      expect(rules["react/function-component-definition"]).toBe("off");
    });
  });

  describe("core React rules", () => {
    it("includes all expected core React rules", () => {
      const rules = reactRules({
        functionStyle: "arrow",
        reactCompiler: true,
        typescript: true,
      });

      // Sample of core React rules
      expect(rules["react/button-has-type"]).toBe("warn");
      expect(rules["react/jsx-key"]).toBe("warn");
      expect(rules["react/jsx-no-duplicate-props"]).toBe("warn");
      expect(rules["react/jsx-no-undef"]).toBe("warn");
      expect(rules["react/no-children-prop"]).toBe("warn");
      expect(rules["react/no-danger-with-children"]).toBe("warn");
      expect(rules["react/no-deprecated"]).toBe("warn");
      expect(rules["react/no-unstable-nested-components"]).toBe("warn");
      expect(rules["react/self-closing-comp"]).toBe("warn");
    });

    it("includes expected destructuring assignment rule", () => {
      const rules = reactRules({
        functionStyle: "arrow",
        reactCompiler: true,
        typescript: true,
      });

      expect(rules["react/destructuring-assignment"]).toStrictEqual([
        "warn",
        "always",
      ]);
    });

    it("includes expected JSX-specific rules with correct configuration", () => {
      const rules = reactRules({
        functionStyle: "arrow",
        reactCompiler: true,
        typescript: true,
      });

      expect(rules["react/jsx-boolean-value"]).toBe("warn");
      expect(rules["react/jsx-curly-brace-presence"]).toBe("warn");
      expect(rules["react/jsx-fragments"]).toBe("warn");
      expect(rules["react/jsx-no-leaked-render"]).toBe("warn");
      expect(rules["react/jsx-pascal-case"]).toBe("warn");

      expect(rules["react/jsx-no-target-blank"]).toStrictEqual([
        "warn",
        { allowReferrer: true },
      ]);

      expect(rules["react/jsx-no-useless-fragment"]).toStrictEqual([
        "warn",
        { allowExpressions: true },
      ]);
    });
  });
});

describe("reactEslintConfig", () => {
  it("returns a valid ESLint config object", () => {
    const config = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    expect(config).toBeInstanceOf(Object);
    expect(config.name).toBe(configNames.react);
  });

  it("includes React and React Hooks plugins", () => {
    const config = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    expect(config.plugins).toBeDefined();
    expect(config.plugins?.react).toBeDefined();
    expect(config.plugins?.["react-hooks"]).toBeDefined();
  });

  it("configures browser globals", () => {
    const config = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    expect(config.languageOptions?.globals).toStrictEqual(globals.browser);
  });

  it("enables JSX in parser options", () => {
    const config = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    const parserOptions = config.languageOptions?.parserOptions as
      | undefined
      | { ecmaFeatures?: { jsx?: boolean } };

    expect(parserOptions?.ecmaFeatures?.jsx).toBe(true);
  });

  it("configures React version detection in settings", () => {
    const config = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    // @ts-expect-error - this isn't typed
    expect(config.settings?.react?.version).toBe("detect");
  });

  it("merges custom rules correctly", () => {
    const customRules = {
      "react-hooks/exhaustive-deps": "off" as const,
      "react/button-has-type": "off" as const,
      "react/custom-rule": "warn" as const,
    };

    const config = reactEslintConfig({
      customRules,
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    // Custom rules should override defaults
    expect(config.rules?.["react/button-has-type"]).toBe("off");
    expect(config.rules?.["react-hooks/exhaustive-deps"]).toBe("off");
    // Custom rules should be added
    expect(config.rules?.["react/custom-rule"]).toBe("warn");
    // Other default rules should remain
    expect(config.rules?.["react/jsx-key"]).toBe("warn");
  });

  it("passes functionStyle to rules correctly", () => {
    const configArrow = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    expect(
      configArrow.rules?.["react/function-component-definition"],
    ).toStrictEqual([
      "warn",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ]);

    const configDeclaration = reactEslintConfig({
      functionStyle: "declaration",
      reactCompiler: true,
      typescript: true,
    });

    expect(
      configDeclaration.rules?.["react/function-component-definition"],
    ).toStrictEqual([
      "warn",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "function-expression",
      },
    ]);
  });

  it("passes reactCompiler option to rules correctly", () => {
    const configWithCompiler = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    expect(configWithCompiler.rules?.["react-hooks/purity"]).toBe("warn");

    const configWithoutCompiler = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: false,
      typescript: true,
    });

    expect(configWithoutCompiler.rules?.["react-hooks/purity"]).toBeUndefined();
  });

  it("passes typescript option to rules correctly", () => {
    const configWithTS = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: true,
    });

    expect(configWithTS.rules?.["react/prop-types"]).toBeUndefined();

    const configWithoutTS = reactEslintConfig({
      functionStyle: "arrow",
      reactCompiler: true,
      typescript: false,
    });

    expect(configWithoutTS.rules?.["react/prop-types"]).toBe("warn");
  });
});

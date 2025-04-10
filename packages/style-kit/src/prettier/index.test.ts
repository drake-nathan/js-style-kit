import type { SortJsonOptions as SortJsonPluginOptions } from "prettier-plugin-sort-json";
import type { PluginOptions as TailwindPluginOptions } from "prettier-plugin-tailwindcss";

import { describe, expect, it } from "bun:test";

import { prettierConfig } from "../index.js";

describe("prettierConfig", () => {
  it("should return base config with default options", () => {
    const config = prettierConfig();

    expect(config).toStrictEqual({
      experimentalTernaries: true,
      jsonRecursiveSort: true,
      plugins: [
        "prettier-plugin-css-order",
        "prettier-plugin-curly",
        "prettier-plugin-sort-json",
        "prettier-plugin-packagejson",
      ],
    });
  });

  it("should accept tailwind stylesheet path as a string", () => {
    const config = prettierConfig({
      tailwindPlugin: "./path/to/stylesheet.css",
    });

    expect(config.plugins).toContain("prettier-plugin-tailwindcss");
    expect(config.tailwindStylesheet).toBe("./path/to/stylesheet.css");
    expect(config.tailwindFunctions).toStrictEqual(["clsx", "cva", "cn"]);
  });

  it("should include tailwind plugin when enabled", () => {
    const config = prettierConfig({ tailwindPlugin: true });

    expect(config.plugins).toContain("prettier-plugin-tailwindcss");
    expect(config.tailwindFunctions).toStrictEqual(["clsx", "cva", "cn"]);
  });

  it("should set custom tailwind functions", () => {
    const config = prettierConfig({
      tailwindPlugin: {
        tailwindFunctions: ["customFn", "anotherFn"],
      },
    });

    expect(config.plugins).toContain("prettier-plugin-tailwindcss");
    expect(config.tailwindFunctions).toStrictEqual(["customFn", "anotherFn"]);
  });

  it("should accept tailwind plugin options as an object", () => {
    const tailwindOptions: TailwindPluginOptions = {
      tailwindAttributes: ["customAttr"],
      tailwindFunctions: ["customOnly"],
    };
    const config = prettierConfig({
      tailwindPlugin: tailwindOptions,
    });

    expect(config.plugins).toContain("prettier-plugin-tailwindcss");
    expect(config.tailwindFunctions).toStrictEqual(["customOnly"]);
    expect(config.tailwindAttributes).toStrictEqual(["customAttr"]);
  });

  it("should preserve default tailwind functions when not specified in options object", () => {
    const config = prettierConfig({
      tailwindPlugin: {
        tailwindAttributes: ["customAttr"],
      },
    });

    expect(config.plugins).toContain("prettier-plugin-tailwindcss");
    expect(config.tailwindFunctions).toStrictEqual(["clsx", "cva", "cn"]);
    expect(config.tailwindAttributes).toStrictEqual(["customAttr"]);
  });

  it("should disable JSON sort plugin when specified", () => {
    const config = prettierConfig({ jsonSortPlugin: false });

    expect(config.plugins).not.toContain("prettier-plugin-sort-json");
    expect(config.jsonRecursiveSort).toBeUndefined();
  });

  it("should disable package.json plugin when specified", () => {
    const config = prettierConfig({ packageJsonPlugin: false });

    expect(config.plugins).not.toContain("prettier-plugin-packagejson");
  });

  it("should accept JSON sort plugin options", () => {
    const jsonSortOptions: SortJsonPluginOptions = {
      jsonRecursiveSort: false,
      jsonSortOrder: {
        something: "caseInsensitiveReverseLexical",
      },
    };
    const config = prettierConfig({
      jsonSortPlugin: jsonSortOptions,
    });

    expect(config.plugins).toContain("prettier-plugin-sort-json");
    expect(config.jsonRecursiveSort).toBe(false);
    expect(config.jsonSortOrder).toStrictEqual({
      something: "caseInsensitiveReverseLexical",
    });
  });

  it("should pass through standard prettier options", () => {
    const config = prettierConfig({
      printWidth: 100,
      singleQuote: true,
      tabWidth: 4,
    });

    expect(config.tabWidth).toBe(4);
    expect(config.printWidth).toBe(100);
    expect(config.singleQuote).toBe(true);
  });

  it("should combine multiple plugin configurations correctly", () => {
    const config = prettierConfig({
      jsonSortPlugin: {
        jsonSortOrder: {
          something: "caseInsensitiveReverseLexical",
        },
      },
      tabWidth: 2,
      tailwindPlugin: true,
    });

    expect(config.plugins).toContain("prettier-plugin-sort-json");
    expect(config.plugins).toContain("prettier-plugin-packagejson");
    expect(config.plugins).toContain("prettier-plugin-tailwindcss");
    expect(config.jsonSortOrder).toStrictEqual({
      something: "caseInsensitiveReverseLexical",
    });
    expect(config.tailwindFunctions).toStrictEqual(["clsx", "cva", "cn"]);
    expect(config.tabWidth).toBe(2);
  });

  it("should include css order plugin by default", () => {
    const config = prettierConfig();

    expect(config.plugins).toContain("prettier-plugin-css-order");
  });

  it("should disable css order plugin when specified", () => {
    const config = prettierConfig({ cssOrderPlugin: false });

    expect(config.plugins).not.toContain("prettier-plugin-css-order");
  });

  it("should include curly plugin by default", () => {
    const config = prettierConfig();

    expect(config.plugins).toContain("prettier-plugin-curly");
  });

  it("should disable curly plugin when specified", () => {
    const config = prettierConfig({ curlyPlugin: false });

    expect(config.plugins).not.toContain("prettier-plugin-curly");
  });
});

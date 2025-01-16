import { describe, expect, it } from "vitest";

import { prettierConfig } from "../index.js";

describe("prettierConfig", () => {
  it("should return base config with default options", () => {
    const config = prettierConfig();

    expect(config).toEqual({
      experimentalTernaries: true,
      jsonRecursiveSort: true,
      plugins: ["prettier-plugin-json-sort", "prettier-plugin-packagejson"],
    });
  });

  it("should include tailwind plugin when enabled", () => {
    const config = prettierConfig({ tailwindPlugin: true });

    expect(config.plugins).toContain("prettier-plugin-tailwindcss");
    expect(config.tailwindFunctions).toEqual(["clsx", "cva", "cn"]);
  });

  it("should merge custom tailwind functions", () => {
    const config = prettierConfig({
      tailwindPlugin: ["customFn", "anotherFn"],
    });

    expect(config.plugins).toContain("prettier-plugin-tailwindcss");
    expect(config.tailwindFunctions).toEqual([
      "clsx",
      "cva",
      "cn",
      "customFn",
      "anotherFn",
    ]);
  });
});

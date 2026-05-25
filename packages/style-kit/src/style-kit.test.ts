import { describe, expect, it } from "bun:test";

import { styleKit } from "./style-kit.js";

describe("styleKit", () => {
  it("returns both an oxlint and oxfmt config", () => {
    const { oxfmt, oxlint } = styleKit();
    expect(oxlint).toBeDefined();
    expect(oxfmt).toBeDefined();
    expect(oxlint.plugins).toContain("eslint");
  });

  it("propagates tailwind to BOTH sides", () => {
    const { oxfmt, oxlint } = styleKit({ tailwind: true });
    // lint side: oxlint-tailwindcss JS plugin registered
    const linted = oxlint.jsPlugins?.some(
      (p) => typeof p !== "string" && p.name === "tailwindcss",
    );
    expect(linted).toBe(true);
    // fmt side: sortTailwindcss enabled
    expect(typeof oxfmt.sortTailwindcss).toBe("object");
  });

  it("propagates tailwind object config to both sides", () => {
    const { oxfmt, oxlint } = styleKit({
      tailwind: { functions: ["tw"], stylesheet: "./app.css" },
    });
    expect(oxlint.rules?.["tailwindcss/classnames-order"]).toBe("warn");
    if (
      typeof oxfmt.sortTailwindcss === "object" &&
      oxfmt.sortTailwindcss !== null
    ) {
      expect(oxfmt.sortTailwindcss.functions).toEqual(["tw"]);
      expect(oxfmt.sortTailwindcss.stylesheet).toBe("./app.css");
    }
  });

  it("routes react to oxlint only", () => {
    const { oxlint } = styleKit({ react: { framework: "next" } });
    expect(oxlint.plugins).toContain("react");
    expect(oxlint.plugins).toContain("nextjs");
  });

  it("routes ignores to oxlint only", () => {
    const { oxlint } = styleKit({ ignores: ["custom-ignored/**"] });
    expect(oxlint.ignorePatterns).toContain("custom-ignored/**");
  });

  it("typescript=false disables type-aware and the typescript plugin", () => {
    const { oxlint } = styleKit({ typescript: false });
    expect(oxlint.plugins).not.toContain("typescript");
    expect(oxlint.options?.typeAware).toBe(false);
  });

  it("lint escape-hatch passes through to oxlint", () => {
    const { oxlint } = styleKit({ lint: { sorting: false } });
    expect(oxlint.jsPlugins).not.toContain("eslint-plugin-perfectionist");
  });

  it("format escape-hatch passes through to oxfmt", () => {
    const { oxfmt } = styleKit({ format: { sortPackageJson: false } });
    expect(oxfmt.sortPackageJson).toBe(false);
  });

  it("convex/storybook/turbo flags register the respective JS plugins", () => {
    const { oxlint } = styleKit({
      convex: true,
      storybook: true,
      turbo: true,
    });
    const names = (oxlint.jsPlugins ?? []).map((p) =>
      typeof p === "string" ? p : p.name,
    );
    expect(names).toContain("convex");
    expect(names).toContain("turbo");
    expect(names).toContain("storybook");
    expect(
      oxlint.overrides?.some((o) =>
        o.files.some((f) => f.includes(".stories.")),
      ),
    ).toBe(true);
  });
});

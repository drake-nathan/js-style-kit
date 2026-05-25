import { describe, expect, it } from "bun:test";

import { oxfmtConfig } from "./index.js";

describe("oxfmtConfig", () => {
  it("defaults: sortImports on, sortPackageJson on, jsdoc off, tailwind off", () => {
    const cfg = oxfmtConfig();
    expect(cfg.sortImports).toBe(true);
    expect(cfg.sortPackageJson).toBe(true);
    expect(cfg.jsdoc).toBe(false);
    expect(cfg.sortTailwindcss).toBeUndefined();
  });

  it("passes sortImports object through", () => {
    const cfg = oxfmtConfig({
      sortImports: { groups: ["type", "external", "unknown"] },
    });
    expect(typeof cfg.sortImports).toBe("object");
    if (typeof cfg.sortImports === "object") {
      expect(cfg.sortImports.groups).toEqual(["type", "external", "unknown"]);
    }
  });

  it("can disable sortImports", () => {
    const cfg = oxfmtConfig({ sortImports: false });
    expect(cfg.sortImports).toBe(false);
  });

  it("enables sortTailwindcss with default functions when tailwind=true", () => {
    const cfg = oxfmtConfig({ tailwind: true });
    expect(typeof cfg.sortTailwindcss).toBe("object");
    if (
      typeof cfg.sortTailwindcss === "object" &&
      cfg.sortTailwindcss !== null
    ) {
      expect(cfg.sortTailwindcss.functions).toEqual(["clsx", "cva", "cn"]);
    }
  });

  it("respects user tailwind functions + stylesheet", () => {
    const cfg = oxfmtConfig({
      tailwind: {
        functions: ["tw", "cx"],
        stylesheet: "./app/globals.css",
      },
    });
    if (
      typeof cfg.sortTailwindcss === "object" &&
      cfg.sortTailwindcss !== null
    ) {
      expect(cfg.sortTailwindcss.functions).toEqual(["tw", "cx"]);
      expect(cfg.sortTailwindcss.stylesheet).toBe("./app/globals.css");
    }
  });

  it("turns sortPackageJson off when asked", () => {
    const cfg = oxfmtConfig({ sortPackageJson: false });
    expect(cfg.sortPackageJson).toBe(false);
  });

  it("enables jsdoc formatting when asked", () => {
    const cfg = oxfmtConfig({ jsdoc: true });
    expect(cfg.jsdoc).toBe(true);
  });

  it("passes jsdoc config object through", () => {
    const cfg = oxfmtConfig({ jsdoc: { multiline: true } });
    if (typeof cfg.jsdoc === "object" && cfg.jsdoc !== null) {
      expect((cfg.jsdoc as { multiline: boolean }).multiline).toBe(true);
    }
  });
});

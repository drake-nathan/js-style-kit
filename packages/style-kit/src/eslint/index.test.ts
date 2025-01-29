import { describe, expect, it } from "vitest";

import { configNames } from "./constants.js";
import { eslintConfig } from "./index.js";

describe("eslintConfig", () => {
  it("returns default configuration", () => {
    const config = eslintConfig();
    const names = config.map((c) => c.name);
    const expectedConfigs = [
      configNames.ignores,
      configNames.base,
      configNames.typescript,
      configNames.perfectionist,
      configNames.disableTypeChecked,
      // the disable type checked config comes with an additional un-named config
      undefined,
    ];

    expect(config).toBeInstanceOf(Array);
    expectedConfigs.forEach((expectedName) => {
      expect(names).toContain(expectedName);
    });
  });

  it("includes React config when enabled", () => {
    const config = eslintConfig({ react: true });

    expect(config.some((c) => c.name === configNames.react)).toBe(true);
  });

  it("excludes TypeScript config when disabled", () => {
    const config = eslintConfig({ typescript: false });

    expect(config.some((c) => c.name === configNames.typescript)).toBe(false);
  });

  it("excludes sorting config when disabled", () => {
    const config = eslintConfig({ sorting: false });

    expect(config.some((c) => c.name === configNames.perfectionist)).toBe(
      false,
    );
  });

  it("applies custom ignores", () => {
    const customIgnores = ["*.test.ts", "*.spec.ts"];
    const config = eslintConfig({ ignores: customIgnores });

    expect(config[0]?.ignores).toEqual(expect.arrayContaining(customIgnores));
  });
});

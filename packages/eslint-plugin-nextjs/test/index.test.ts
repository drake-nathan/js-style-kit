import { describe, expect, it } from "bun:test";

import plugin, { rules } from "../src";

describe("@next/eslint-plugin-next index", () => {
  Object.keys(rules ?? {}).forEach((ruleName) => {
    const rule = rules?.[ruleName];

    const isInRules = ruleName in (plugin.configs.recommended.rules ?? {});
    const isRecommended = rule?.meta?.docs?.recommended;

    it(`${ruleName}: recommend should be \`${rule?.meta?.docs?.recommended}\``, () => {
      expect(isInRules).toBe(Boolean(isRecommended));
    });
  });
});

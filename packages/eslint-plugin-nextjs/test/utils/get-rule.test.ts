import { describe, expect, it } from "bun:test";

import { getRule } from "./get-rule";

describe("getRule", () => {
  it("should return real rules when they exist", () => {
    // Test with a few common rules
    const rules = ["google-font-display", "no-img-element", "inline-script-id"];

    for (const ruleName of rules) {
      const rule = getRule(ruleName);

      // All real rules should have these properties
      expect(rule).toBeDefined();
      expect(rule).toHaveProperty("create");
      expect(rule).toHaveProperty("meta");
      expect(rule).toHaveProperty("meta.docs");
    }
  });

  it("should throw an error for non-existent rules", () => {
    // Arrange
    const ruleName = "non-existent-rule";

    // Act & Assert
    expect(() => getRule(ruleName)).toThrow("Rule non-existent-rule not found");
  });
});

import type { Rule } from "eslint";

import { describe, expect, it } from "bun:test";
import { mock } from "bun:test";

import { getRule } from "./get-rule";

// Create a mock version of the rules object with proper Rule.RuleModule structure
const mockRules: Record<string, Rule.RuleModule> = {
  "google-font-display": {
    create: () => ({}),
    meta: { docs: { description: "Test rule" } },
  },
  "no-img-element": {
    create: () => ({}),
    meta: { docs: { description: "Another test rule" } },
  },
};

// Setup the mock before tests
void mock.module("../../src", () => ({
  rules: mockRules,
}));

describe("getRule", () => {
  it("should return the rule when it exists", () => {
    // Arrange
    const ruleName = "google-font-display";
    
    // Act
    const result = getRule(ruleName);
    
    // Assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(mockRules[ruleName]);
  });

  it("should return another valid rule", () => {
    // Arrange
    const ruleName = "no-img-element";
    
    // Act
    const result = getRule(ruleName);
    
    // Assert
    expect(result).toBeDefined();
    expect(result).toStrictEqual(mockRules[ruleName]);
  });

  it("should throw an error when rule does not exist", () => {
    // Arrange
    const ruleName = "non-existent-rule";
    
    // Act & Assert
    expect(() => getRule(ruleName)).toThrow(`Rule ${ruleName} not found`);
  });
});
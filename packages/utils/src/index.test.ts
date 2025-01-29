import { describe, expect, it } from "vitest";

import { isArray, isBoolean, isNumber, isObject, isString } from "./index.js";

describe("utils", () => {
  describe("isBoolean", () => {
    it("should return true if `value` is a boolean", () => {
      expect(isBoolean(true)).toBe(true);
    });

    it("should return false if `value` is not a boolean", () => {
      expect(isBoolean("true")).toBe(false);
    });

    it("should return false if `value` is an object", () => {
      expect(isBoolean({})).toBe(false);
    });

    it("should return false if `value` is undefined", () => {
      expect(isBoolean(undefined)).toBe(false);
    });

    it("should return false if `value` is null", () => {
      expect(isBoolean(null)).toBe(false);
    });
  });

  describe("isString", () => {
    it("should return true if `value` is a string", () => {
      expect(isString("hello")).toBe(true);
    });

    it("should return false if `value` is not a string", () => {
      expect(isString(123)).toBe(false);
    });

    it("should return false if `value` is an object", () => {
      expect(isString({})).toBe(false);
    });

    it("should return false if `value` is undefined", () => {
      expect(isString(undefined)).toBe(false);
    });

    it("should return false if `value` is null", () => {
      expect(isString(null)).toBe(false);
    });
  });

  describe("isNumber", () => {
    it("should return true if `value` is a number", () => {
      expect(isNumber(123)).toBe(true);
    });

    it("should return false if `value` is not a number", () => {
      expect(isNumber("123")).toBe(false);
    });

    it("should return false if `value` is an object", () => {
      expect(isNumber({})).toBe(false);
    });

    it("should return false if `value` is undefined", () => {
      expect(isNumber(undefined)).toBe(false);
    });

    it("should return false if `value` is null", () => {
      expect(isNumber(null)).toBe(false);
    });
  });

  describe("isObject", () => {
    it("should return true if `value` is an object", () => {
      expect(isObject({})).toBe(true);
    });

    it("should return false if `value` is not an object", () => {
      expect(isObject("hello")).toBe(false);
    });

    it("should return false if `value` is an array", () => {
      expect(isObject(["hello"])).toBe(false);
    });

    it("should return false if `value` is a function", () => {
      expect(isObject(() => undefined)).toBe(false);
    });

    it("should return false if `value` is undefined", () => {
      expect(isObject(undefined)).toBe(false);
    });

    it("should return false if `value` is null", () => {
      expect(isObject(null)).toBe(false);
    });
  });

  describe("isArray", () => {
    it("should return true if `value` is an array", () => {
      expect(isArray([])).toBe(true);
    });

    it("should return false if `value` is an object", () => {
      expect(isArray({})).toBe(false);
    });

    it("should return false if `value` is a string", () => {
      expect(isArray("hello")).toBe(false);
    });

    it("should return false if `value` is a function", () => {
      expect(isArray(() => undefined)).toBe(false);
    });

    it("should return false if `value` is undefined", () => {
      expect(isArray(undefined)).toBe(false);
    });

    it("should return false if `value` is null", () => {
      expect(isArray(null)).toBe(false);
    });
  });
});

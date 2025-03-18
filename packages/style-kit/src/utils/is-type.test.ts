import { describe, expect, it } from "bun:test";

import {
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
} from "./is-type.js";

describe("isString", () => {
  it("returns true for string values", () => {
    expect(isString("hello")).toBe(true);
    expect(isString("")).toBe(true);
    expect(isString(String("world"))).toBe(true);
  });

  it("returns false for non-string values", () => {
    expect(isString(123)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(new Date())).toBe(false);
    expect(isString(() => null)).toBe(false);
  });
});

describe("isNumber", () => {
  it("returns true for number values", () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-456)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
    expect(isNumber(Number(789))).toBe(true);
  });

  it("returns false for NaN", () => {
    expect(isNumber(NaN)).toBe(false);
  });

  it("returns false for non-number values", () => {
    expect(isNumber("123")).toBe(false);
    expect(isNumber(true)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(new Date())).toBe(false);
    expect(isNumber(() => null)).toBe(false);
  });
});

describe("isBoolean", () => {
  it("returns true for boolean values", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(Boolean(1))).toBe(true);
  });

  it("returns false for non-boolean values", () => {
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean("true")).toBe(false);
    expect(isBoolean({})).toBe(false);
    expect(isBoolean([])).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean(new Date())).toBe(false);
    expect(isBoolean(() => null)).toBe(false);
  });
});

describe("isArray", () => {
  it("returns true for array values", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray([])).toBe(true);
  });

  it("returns false for non-array values", () => {
    expect(isArray({})).toBe(false);
    expect(isArray("array")).toBe(false);
    expect(isArray(123)).toBe(false);
    expect(isArray(true)).toBe(false);
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray(new Date())).toBe(false);
    expect(isArray(() => null)).toBe(false);
  });

  it("works with generic type", () => {
    const numberArray = [1, 2, 3];
    const stringArray = ["a", "b", "c"];

    /* eslint-disable jest/no-conditional-in-test */
    /* eslint-disable jest/no-conditional-expect */
    if (isArray<number>(numberArray)) {
      // This should compile without errors
      const sum = numberArray.reduce((a, b) => a + b, 0);

      expect(sum).toBe(6);
    } else {
      // This branch should never execute
      expect(false).toBe(true);
    }

    if (isArray<string>(stringArray)) {
      // This should compile without errors
      const joined = stringArray.join("");

      expect(joined).toBe("abc");
    } else {
      // This branch should never execute
      expect(false).toBe(true);
    }
  });
  /* eslint-enable jest/no-conditional-expect */
  /* eslint-enable jest/no-conditional-in-test */
});

describe("isObject", () => {
  it("returns true for object values", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: "value" })).toBe(true);
    expect(isObject({})).toBe(true);
  });

  it("returns false for null", () => {
    expect(isObject(null)).toBe(false);
  });

  it("returns false for arrays", () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it("returns false for other non-object values", () => {
    expect(isObject("object")).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(() => null)).toBe(false);
  });
});

describe("isFunction", () => {
  it("returns true for function values", () => {
    expect(isFunction(() => null)).toBe(true);
    expect(isFunction(String)).toBe(true);
  });

  it("returns false for non-function values", () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction("function")).toBe(false);
    expect(isFunction(123)).toBe(false);
    expect(isFunction(true)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(new Date())).toBe(false);
  });
});

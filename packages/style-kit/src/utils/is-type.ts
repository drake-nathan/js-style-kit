/**
 * Type predicate for string values
 *
 * @param value - The value to check
 * @returns True if the value is a string, false otherwise
 */
export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

/**
 * Type predicate for number values
 *
 * @param value - The value to check
 * @returns True if the value is a number and not NaN, false otherwise
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !Number.isNaN(value);
};

/**
 * Type predicate for boolean values
 *
 * @param value - The value to check
 * @returns True if the value is a boolean, false otherwise
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

/**
 * Type predicate for array values
 *
 * @param value - The value to check
 * @returns True if the value is an array, false otherwise
 */
export const isArray = <T = unknown>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

/**
 * Type predicate for object values (excluding null and arrays)
 *
 * @param value - The value to check
 * @returns True if the value is an object (not null and not an array), false otherwise
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * Type predicate for function values
 *
 * @param value - The value to check
 * @returns True if the value is a function, false otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (value: unknown): value is Function => {
  return typeof value === "function";
};

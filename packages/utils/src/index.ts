export const isBoolean = (value: unknown) => {
  return typeof value === "boolean";
};

export const isString = (value: unknown) => {
  return typeof value === "string";
};

export const isNumber = (value: unknown) => {
  return typeof value === "number";
};

export const isObject = (value: unknown): value is object => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

export const isArray = (value: unknown) => {
  return Array.isArray(value);
};

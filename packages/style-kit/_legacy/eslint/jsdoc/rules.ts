import type { JsdocRules } from "./types.js";

/**
 * Generates ESLint rules configuration for JSDoc comments.
 *
 * @param requireJsdoc - Whether to enforce JSDoc comments on functions and classes. Defaults to false.
 * @param typescript - Whether TypeScript is being used in the project. When true, some rules are adjusted to be more TypeScript-friendly. Defaults to true.
 * @returns An object containing ESLint rules configuration for JSDoc validation and formatting.
 */
export const jsdocRules = (
  requireJsdoc = false,
  typescript = true,
): JsdocRules => ({
  "jsdoc/check-access": "warn",
  "jsdoc/check-alignment": "warn",
  "jsdoc/check-param-names": [
    "warn",
    {
      checkDestructured: true,
      enableFixer: true,
    },
  ],
  "jsdoc/check-property-names": "warn",
  "jsdoc/check-tag-names": [
    "warn",
    {
      typed: true,
    },
  ],
  "jsdoc/check-types": "warn",
  "jsdoc/check-values": "warn",
  "jsdoc/empty-tags": "warn",
  "jsdoc/implements-on-classes": "warn",
  "jsdoc/multiline-blocks": "warn",
  "jsdoc/no-blank-block-descriptions": "off",
  "jsdoc/no-defaults": "warn",
  "jsdoc/no-multi-asterisks": "warn",
  "jsdoc/no-types": typescript ? "warn" : "off",
  "jsdoc/no-undefined-types": typescript ? "off" : "warn",
  "jsdoc/require-asterisk-prefix": "warn",
  "jsdoc/require-description": requireJsdoc ? "warn" : "off",
  "jsdoc/require-jsdoc":
    requireJsdoc ?
      [
        "warn",
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ]
    : "off",
  "jsdoc/require-param": requireJsdoc ? "warn" : "off",
  "jsdoc/require-param-description": "warn",
  "jsdoc/require-param-name": "warn",
  "jsdoc/require-property": requireJsdoc ? "warn" : "off",
  "jsdoc/require-property-description": "warn",
  "jsdoc/require-property-name": "warn",
  "jsdoc/require-returns": requireJsdoc ? "warn" : "off",
  "jsdoc/require-returns-check": "warn",
  "jsdoc/require-returns-description": "warn",
  "jsdoc/require-yields": "warn",
  "jsdoc/require-yields-check": "warn",
  "jsdoc/tag-lines": [
    "warn",
    "never",
    {
      startLines: 1, // Allow 1 line between description and first tag
      tags: {
        param: { lines: "never" }, // Enforce no lines between param tags
      },
    },
  ],
  "jsdoc/text-escaping": "off",
  "jsdoc/valid-types": "warn",
});

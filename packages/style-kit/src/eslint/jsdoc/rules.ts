import type { EslintRuleConfig } from "../types.js";

type JsdocRules = Record<`jsdoc/${string}`, EslintRuleConfig> & {
  "jsdoc/check-param-names": EslintRuleConfig<{
    allowExtraTrailingParamDocs?: boolean;
    checkDestructured?: boolean;
    checkRestProperty?: boolean;
    checkTypesPattern?: string;
    disableExtraPropertyReporting?: boolean;
    disableMissingParamChecks?: boolean;
    enableFixer?: boolean;
    useDefaultObjectProperties?: boolean;
  }>;
};

export const jsdocRules = (requireJsdoc = false): JsdocRules => ({
  "jsdoc/check-access": "warn",
  "jsdoc/check-alignment": "warn",
  "jsdoc/check-examples": "off",
  "jsdoc/check-indentation": "off",
  "jsdoc/check-line-alignment": "off",
  "jsdoc/check-param-names": [
    "warn",
    {
      checkDestructured: true,
      enableFixer: true,
    },
  ],
  "jsdoc/check-property-names": "warn",
  "jsdoc/check-syntax": "off",
  "jsdoc/check-tag-names": [
    "warn",
    {
      typed: true,
    },
  ],
  "jsdoc/check-template-names": "off",
  "jsdoc/check-types": "warn",
  "jsdoc/check-values": "warn",
  "jsdoc/convert-to-jsdoc-comments": "off",
  "jsdoc/empty-tags": "warn",
  "jsdoc/implements-on-classes": "warn",
  "jsdoc/imports-as-dependencies": "off",
  "jsdoc/informative-docs": "off",
  "jsdoc/lines-before-block": "off",
  "jsdoc/match-description": "off",
  "jsdoc/match-name": "off",
  "jsdoc/multiline-blocks": "warn",
  "jsdoc/no-bad-blocks": "off",
  "jsdoc/no-blank-block-descriptions": "off",
  "jsdoc/no-blank-blocks": "off",
  "jsdoc/no-defaults": "warn",
  "jsdoc/no-missing-syntax": "off",
  "jsdoc/no-multi-asterisks": "warn",
  "jsdoc/no-restricted-syntax": "off",
  "jsdoc/no-types": "off",
  "jsdoc/require-asterisk-prefix": "warn",
  "jsdoc/require-description": requireJsdoc ? "warn" : "off",
  "jsdoc/require-description-complete-sentence": "off",
  "jsdoc/require-file-overview": "off",
  "jsdoc/require-hyphen-before-param-description": "off",
  "jsdoc/require-jsdoc": requireJsdoc ? "warn" : "off",
  "jsdoc/require-param": "warn",
  "jsdoc/require-param-description": "warn",
  "jsdoc/require-param-name": "warn",
  "jsdoc/require-property": "warn",
  "jsdoc/require-property-description": "warn",
  "jsdoc/require-property-name": "warn",
  "jsdoc/require-returns": "warn",
  "jsdoc/require-returns-check": "warn",
  "jsdoc/require-returns-description": "warn",
  "jsdoc/require-template": "off",
  "jsdoc/require-throws": "off",
  "jsdoc/require-yields": "warn",
  "jsdoc/require-yields-check": "warn",
  "jsdoc/sort-tags": "off",
  "jsdoc/tag-lines": "warn",
  "jsdoc/text-escaping": "off",
  "jsdoc/valid-types": "warn",
});

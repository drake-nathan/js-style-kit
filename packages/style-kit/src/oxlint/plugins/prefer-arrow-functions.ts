import type { RulesRecord } from "../../types.js";

/**
 * `eslint-plugin-prefer-arrow-functions` rule. Only loaded when
 * `functionStyle === "arrow"`.
 */
export const buildPreferArrowRules = (): RulesRecord => ({
  "prefer-arrow-functions/prefer-arrow-functions": [
    "warn",
    { returnStyle: "unchanged", singleReturnOnly: false },
  ],
});

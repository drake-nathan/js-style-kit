import type { ConfigName } from "./constants.js"; // Ensure space after previous import
import type { EslintRuleConfig } from "./types.js";

import { configNames } from "./constants.js";

/**
 * Categorizes custom rules provided by the user based on plugin prefixes.
 *
 * @param customRules - The custom rules provided by the user.
 * @returns An object where keys are config names (e.g., 'base', 'typescript')
 *          and values are the corresponding rule subsets for that config.
 */
export const processCustomRules = (
  customRules: Record<string, EslintRuleConfig> | undefined,
): Partial<Record<ConfigName, Record<string, EslintRuleConfig>>> => {
  const categorizedRules: Partial<
    Record<ConfigName, Record<string, EslintRuleConfig>>
  > = {};

  if (!customRules) {
    return categorizedRules; // Return empty object if no custom rules
  }

  // NOTE: This map should ideally be kept in sync with constants.ts
  // and the configs actually generated in index.ts
  const prefixToConfigNameMap: Partial<Record<string, ConfigName>> = {
    "@typescript-eslint": configNames.typescript,
    import: configNames.import,
    "import-x": configNames.import,
    jsdoc: configNames.jsdoc,
    nextjs: configNames.nextjs,
    perfectionist: configNames.perfectionist,
    react: configNames.react,
    "react-compiler": configNames.reactCompiler,
    "react-hooks": configNames.react,
    "react-refresh": configNames.reactRefresh,
    storybook: configNames.storybook,
    turbo: configNames.turbo,
    unicorn: configNames.unicorn,
  };
  const prefixes = Object.keys(prefixToConfigNameMap);

  for (const [ruleKey, ruleValue] of Object.entries(customRules)) {
    let targetConfigName: ConfigName | undefined;

    // Check if the rule key starts with a known prefix
    for (const prefix of prefixes) {
      const checkPrefix =
        prefix.includes("/") || prefix.startsWith("@") ? prefix : `${prefix}/`;
      if (ruleKey.startsWith(checkPrefix)) {
        targetConfigName = prefixToConfigNameMap[prefix];
        break; // Found the corresponding prefix
      }
    }

    // Determine the final category name (specific plugin or 'base')
    const category = targetConfigName ?? configNames.base;

    // Ensure the category exists in the result object
    categorizedRules[category] ??= {};

    // Add the rule to the correct category
    const keyToUse = targetConfigName ? ruleKey : ruleKey;
    categorizedRules[category][keyToUse] = ruleValue;
  }

  return categorizedRules;
};

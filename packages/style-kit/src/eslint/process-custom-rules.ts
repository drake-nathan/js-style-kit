import type { ConfigName } from "./constants.js";
import type { EslintRuleConfig } from "./types.js";

import { configNames, pluginPrefixMap } from "./constants.js";

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
  // Initialize result object with all possible config categories
  const categorizedRules = Object.values(configNames).reduce<
    Record<ConfigName, Record<string, EslintRuleConfig>>
  >(
    (acc, configName) => {
      acc[configName] = {};
      return acc;
    },
    {} as Record<ConfigName, Record<string, EslintRuleConfig>>,
  );

  // Early return if no custom rules provided
  if (!customRules) {
    // Only return the base config to ensure it's always present
    return { [configNames.base]: categorizedRules[configNames.base] };
  }

  // Process each custom rule
  for (const [ruleKey, ruleValue] of Object.entries(customRules)) {
    // Quick check if rule has no prefix (no '/' or '@')
    // Rules without prefixes go directly to base config
    if (!ruleKey.includes("/") && !ruleKey.startsWith("@")) {
      categorizedRules[configNames.base][ruleKey] = ruleValue;
      continue;
    }

    // Extract the plugin prefix from the rule key
    let prefix: null | string = null;

    if (ruleKey.startsWith("@")) {
      // Handle scoped packages like @typescript-eslint/rule-name
      const firstSlashIndex = ruleKey.indexOf("/");
      if (firstSlashIndex !== -1) {
        prefix = ruleKey.substring(0, firstSlashIndex);
      }
    } else {
      // Handle regular plugins like eslint-plugin-react/rule-name
      const firstSlashIndex = ruleKey.indexOf("/");
      if (firstSlashIndex !== -1) {
        prefix = ruleKey.substring(0, firstSlashIndex);
      }
    }

    // Find the corresponding config name for this prefix
    const configName =
      prefix ?
        (pluginPrefixMap.get(prefix) ?? configNames.base)
      : configNames.base;

    // Add the rule to the appropriate config
    categorizedRules[configName][ruleKey] = ruleValue;
  }

  // Filter out empty config objects to save memory
  return Object.entries(categorizedRules).reduce<
    Partial<Record<ConfigName, Record<string, EslintRuleConfig>>>
  >((acc, [configName, rules]) => {
    if (Object.keys(rules).length > 0) {
      acc[configName as ConfigName] = rules;
    }
    return acc;
  }, {});
};

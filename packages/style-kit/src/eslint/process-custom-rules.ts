import type { ConfigName } from "./constants.js";
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
  // Initialize result object with empty base config
  const categorizedRules: Partial<
    Record<ConfigName, Record<string, EslintRuleConfig>>
  > = {
    [configNames.base]: {},
  };

  // Early return if no custom rules provided
  if (!customRules) {
    return categorizedRules;
  }

  // NOTE: This map should ideally be kept in sync with constants.ts
  // and the configs actually generated in index.ts
  const prefixToConfigNameMap: Record<string, ConfigName> = {
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

  // Process each custom rule
  for (const [ruleKey, ruleValue] of Object.entries(customRules)) {
    // Optimization: Quick check if rule has no prefix (no '/' or '@')
    // Rules without prefixes go directly to base config
    if (!ruleKey.includes("/") && !ruleKey.startsWith("@")) {
      // @ts-expect-error We know this exists because we initialized it above
      categorizedRules[configNames.base][ruleKey] = ruleValue;
      continue;
    }

    // Find matching prefix and corresponding config
    let targetConfig: ConfigName | undefined;

    for (const prefix of prefixes) {
      const checkPrefix =
        prefix.includes("/") || prefix.startsWith("@") ? prefix : `${prefix}/`;

      if (ruleKey.startsWith(checkPrefix)) {
        targetConfig = prefixToConfigNameMap[prefix];
        break; // Found the corresponding prefix
      }
    }

    // Use base config if no matching prefix was found
    const configName = targetConfig ?? configNames.base;

    // Initialize the config category if it doesn't exist yet
    categorizedRules[configName] ??= {};

    // Add the rule to the appropriate config
    categorizedRules[configName][ruleKey] = ruleValue;
  }

  return categorizedRules;
};

import type { Rule } from "eslint";

import { rules } from "../../src";

export const getRule = (ruleName: string): Rule.RuleModule => {
  const rule = rules?.[`@next/next/${ruleName}`];

  if (!rule) {
    throw new Error(`Rule @next/next/${ruleName} not found`);
  }

  return rule;
};

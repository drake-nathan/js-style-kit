import type { Rule } from "eslint";

import { rules } from "../../src";

export const getRule = (ruleName: string): Rule.RuleModule => {
  const rule = rules?.[ruleName];

  if (!rule) {
    throw new Error(`Rule ${ruleName} not found`);
  }

  return rule;
};

export type EslintRuleConfig<TOptions = Record<string, unknown>> =
  | [EslintSeverity, TOptions]
  | EslintSeverity;

export type EslintSeverity = 0 | 1 | 2 | "error" | "off" | "warn";

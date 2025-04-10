import type { EslintRuleConfig } from "../types.js";

export type TypescriptRules = Record<
  `@typescript-eslint/${string}`,
  EslintRuleConfig
> & {
  "@typescript-eslint/prefer-nullish-coalescing": EslintRuleConfig<{
    /** Unless this is set to `true`, the rule will error on every file whose `tsconfig.json` does _not_ have the `strictNullChecks` compiler option (or `strict`) set to `true`. */
    allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing?: boolean;
    /** Whether to ignore arguments to the `Boolean` constructor */
    ignoreBooleanCoercion?: boolean;
    /** Whether to ignore cases that are located within a conditional test. */
    ignoreConditionalTests?: boolean;
    /** Whether to ignore any if statements that could be simplified by using the nullish coalescing operator. */
    ignoreIfStatements?: boolean;
    /** Whether to ignore any logical or expressions that are part of a mixed logical expression (with `&&`). */
    ignoreMixedLogicalExpressions?: boolean;
    /** Whether to ignore all (`true`) or some (an object with properties) primitive types. */
    ignorePrimitives?:
      | true
      | {
          [k: string]: unknown;
          /** Ignore bigint primitive types. */
          bigint?: boolean;
          /** Ignore boolean primitive types. */
          boolean?: boolean;
          /** Ignore number primitive types. */
          number?: boolean;
          /** Ignore string primitive types. */
          string?: boolean;
        };
    /** Whether to ignore any ternary expressions that could be simplified by using the nullish coalescing operator. */
    ignoreTernaryTests?: boolean;
  }>;
};

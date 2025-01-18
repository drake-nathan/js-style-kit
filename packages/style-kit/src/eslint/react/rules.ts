import type { EslintRuleConfig, FunctionStyle } from "../../types.js";

type ReactFunctionDefinitions =
  | "arrow-function"
  | "function-declaration"
  | "function-expression";

type ReactRules = Record<`react/${string}`, EslintRuleConfig> & {
  "react/destructuring-assignment"?: EslintRuleConfig<
    "always" | "never",
    {
      destructureInSignature?: "always" | "ignore";
      ignoreClassFields?: boolean;
    }
  >;
  "react/function-component-definition"?: EslintRuleConfig<{
    namedComponents?: ReactFunctionDefinitions | ReactFunctionDefinitions[];
    unnamedComponents?:
      | "arrow-function"
      | "function-expression"
      | ("arrow-function" | "function-expression")[];
  }>;
};

export const reactRules = (
  functionStyle: FunctionStyle,
  typescript: boolean,
): ReactRules => {
  const functionStyleMap: Record<FunctionStyle, ReactFunctionDefinitions> = {
    arrow: "arrow-function",
    declaration: "function-declaration",
    expression: "function-expression",
  };

  return {
    /**
     * Disabled in favor of TypeScript for type checking, reducing build size
     */
    ...(typescript ? {} : { "react/prop-types": "warn" }),
    /**
     * Require an explicit type when using button elements.
     *
     * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
     */
    "react/button-has-type": "warn",
    "react/destructuring-assignment": ["warn", "always"],
    "react/display-name": "warn",
    /**
     * Require consistent function type for function components.
     *
     * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/HEAD/docs/rules/function-component-definition.md
     */
    "react/function-component-definition": [
      "warn",
      {
        namedComponents: functionStyleMap[functionStyle],
        unnamedComponents:
          functionStyle === "arrow" ? "arrow-function" : "function-expression",
      },
    ],
    /**
     * Require destructuring and symmetric naming of `useState` hook value and setter variables.
     *
     * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md
     */
    "react/hook-use-state": "warn",
    /**
     * Require consistent boolean attributes notation in JSX.
     *
     * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
     */
    "react/jsx-boolean-value": "warn",
    /**
     * Disallow unnecessary curly braces in JSX props and children.
     *
     * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
     */
    "react/jsx-curly-brace-presence": "warn",
    /**
     * Require using shorthand form for React fragments, unless required.
     *
     * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-fragments.md
     */
    "react/jsx-fragments": "warn",
    "react/jsx-key": "warn",
    "react/jsx-no-comment-textnodes": "warn",
    "react/jsx-no-duplicate-props": "warn",
    /**
     * Prevent problematic leaked values from being rendered.
     *
     * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md
     */
    "react/jsx-no-leaked-render": "warn",
    /**
     * Prevents usage of unsafe `target='_blank'`.
     *
     * This rule is a part of `react/recommended`, but we've modified it to
     * allow referrer.
     *
     * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md
     */
    "react/jsx-no-target-blank": [
      "warn",
      {
        allowReferrer: true,
      },
    ],
    "react/jsx-no-undef": "warn",
    /**
     * Disallow empty React fragments.
     *
     * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
     */
    "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
    /**
     * Require the use of PascalCase for user-defined JSX components.
     *
     * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
     */
    "react/jsx-pascal-case": "warn",
    "react/jsx-uses-react": "warn",
    "react/jsx-uses-vars": "warn",
    /**
     * Disallow usage of Array index in keys.
     *
     * � Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
     */
    "react/no-array-index-key": "warn",
    "react/no-children-prop": "warn",
    "react/no-danger-with-children": "warn",
    "react/no-deprecated": "warn",
    "react/no-direct-mutation-state": "warn",
    "react/no-find-dom-node": "warn",
    "react/no-is-mounted": "warn",
    "react/no-render-return-value": "warn",
    "react/no-string-refs": "warn",
    "react/no-unescaped-entities": "warn",
    "react/no-unknown-property": "warn",
    "react/no-unsafe": "warn",
    /**
     * Disallow creating unstable components inside components.
     *
     * 🚫 Not fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md
     */
    "react/no-unstable-nested-components": "warn",
    "react/prop-types": "warn",
    "react/react-in-jsx-scope": "warn",
    "react/require-render-return": "warn",
    /**
     * Disallow closing tags for components without children.
     *
     * 🔧 Fixable - https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
     */
    "react/self-closing-comp": "warn",
  };
};

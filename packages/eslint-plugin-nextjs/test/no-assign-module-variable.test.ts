import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-assign-module-variable");

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `
      let module = {};

      export default function MyComponent() {
        return <></>
      }
      `,
      errors: [
        {
          message:
            "Do not assign to the variable `module`. See: https://nextjs.org/docs/messages/no-assign-module-variable",
        },
      ],
      name: "should report error when assigning to module variable",
    },
  ],
  valid: [
    {
      code: `
      let myModule = {};

      export default function MyComponent() {
        return <></>
      }
    `,
      name: "should allow assignment to similarly named variables",
    },
  ],
};

new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
    },
    sourceType: "module",
  },
}).run("no-assign-module-variable", NextESLintRule, tests);

import { describe } from "bun:test";
import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-assign-module-variable");

const tests = {
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
    },
  ],
  valid: [
    `
      let myModule = {};

      export default function MyComponent() {
        return <></>
      }
    `,
  ],
};

describe("no-assign-module-variable", () => {
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
  }).run("eslint", NextESLintRule, tests);
});

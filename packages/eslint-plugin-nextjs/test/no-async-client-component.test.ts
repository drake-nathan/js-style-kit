import { describe } from "bun:test";
import { RuleTester as ESLintTesterV9 } from "eslint";
import { RuleTester as ESLintTesterV8 } from "eslint-v8";

import { getRule } from "./utils/get-rule";
const NextESLintRule = getRule("no-async-client-component");

const message =
  "Prevent client components from being async functions. See: https://nextjs.org/docs/messages/no-async-client-component";

const tests = {
  invalid: [
    {
      code: `
      // single line
      "use client"

      export default async function MyComponent() {
        return <></>
      }
      `,
      errors: [{ message }],
    },
    {
      code: `
      // single line capitalization
      "use client"

      export default async function MyFunction() {
        return ''
      }
      `,
      errors: [{ message }],
    },
    {
      code: `
      // multiple line
      "use client"

      async function MyComponent() {
        return <></>
      }

      export default MyComponent
      `,
      errors: [{ message }],
    },
    {
      code: `
      // multiple line capitalization
      "use client"

      async function MyFunction() {
        return ''
      }

      export default MyFunction
      `,
      errors: [{ message }],
    },
    {
      code: `
      // arrow function
      "use client"

      const MyFunction = async () => {
        return '123'
      }

      export default MyFunction
      `,
      errors: [{ message }],
    },
  ],
  valid: [
    `
    // single line
    export default async function MyComponent() {
      return <></>
    }
    `,
    `
    // single line capitalization
    "use client"

    export default async function myFunction() {
      return ''
    }
    `,
    `
    // multiple line
    async function MyComponent() {
      return <></>
    }

    export default MyComponent
    `,
    `
    // multiple line capitalization
    "use client"

    async function myFunction() {
      return ''
    }

    export default myFunction
    `,
    `
    // arrow function
    "use client"

    const myFunction = () => {
      return ''
    }

    export default myFunction
    `,
  ],
};

describe("no-async-client-component", () => {
  new ESLintTesterV8({
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
      ecmaVersion: 2018,
      sourceType: "module",
    },
  }).run("eslint-v8", NextESLintRule, tests);

  new ESLintTesterV9({
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
  }).run("eslint-v9", NextESLintRule, tests);
});

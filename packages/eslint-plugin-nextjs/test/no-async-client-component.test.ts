import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-async-client-component");

const message =
  "Prevent client components from being async functions. See: https://nextjs.org/docs/messages/no-async-client-component";

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
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
      name: "should report error for async client component with direct export",
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
      name: "should report error for async client function with direct export",
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
      name: "should report error for async client component with separate export",
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
      name: "should report error for async client function with separate export",
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
      name: "should report error for async arrow function in client component",
    },
  ],
  valid: [
    {
      code: `
    // single line
    export default async function MyComponent() {
      return <></>
    }
    `,
      name: "should allow async component without use client directive",
    },
    {
      code: `
    // single line capitalization
    "use client"

    export default async function myFunction() {
      return ''
    }
    `,
      name: "should allow async client function with lowercase name",
    },
    {
      code: `
    // multiple line
    async function MyComponent() {
      return <></>
    }

    export default MyComponent
    `,
      name: "should allow async component with separate export without use client directive",
    },
    {
      code: `
    // multiple line capitalization
    "use client"

    async function myFunction() {
      return ''
    }

    export default myFunction
    `,
      name: "should allow async client function with lowercase name and separate export",
    },
    {
      code: `
    // arrow function
    "use client"

    const myFunction = () => {
      return ''
    }

    export default myFunction
    `,
      name: "should allow non-async arrow function in client component",
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
}).run("no-async-client-component", NextESLintRule, tests);

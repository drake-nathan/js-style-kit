import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-typos");

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `
        export default function Page() {
          return <div></div>;
        }
        export const getStaticpaths = async () => {};
        export const getStaticProps = async () => {};
      `,
      errors: [
        {
          message: "getStaticpaths may be a typo. Did you mean getStaticPaths?",
          type: "ExportNamedDeclaration",
        },
      ],
      filename: "pages/index.js",
      name: "should report error for getStaticpaths typo",
    },
    {
      code: `
        export default function Page() {
          return <div></div>;
        }
        export async function getStaticPathss(){};
        export async function getStaticPropss(){};
      `,
      errors: [
        {
          message:
            "getStaticPathss may be a typo. Did you mean getStaticPaths?",
          type: "ExportNamedDeclaration",
        },
        {
          message:
            "getStaticPropss may be a typo. Did you mean getStaticProps?",
          type: "ExportNamedDeclaration",
        },
      ],
      filename: "pages/index.js",
      name: "should report errors for multiple typos in the same file",
    },
    {
      code: `
        export default function Page() {
          return <div></div>;
        }
        export async function getServurSideProps(){};
      `,
      errors: [
        {
          message:
            "getServurSideProps may be a typo. Did you mean getServerSideProps?",
          type: "ExportNamedDeclaration",
        },
      ],
      filename: "pages/index.js",
      name: "should report error for getServurSideProps typo in function declaration",
    },
    {
      code: `
        export default function Page() {
          return <div></div>;
        }
        export const getServurSideProps = () => {};
      `,
      errors: [
        {
          message:
            "getServurSideProps may be a typo. Did you mean getServerSideProps?",
          type: "ExportNamedDeclaration",
        },
      ],
      filename: "pages/index.js",
      name: "should report error for getServurSideProps typo in const declaration",
    },
    // Test case for when n = 0 in the minDistance algorithm
    {
      code: `
        export default function Page() {
          return <div></div>;
        }
        export async function getStaticPath(){};
      `,
      errors: [
        {
          message: "getStaticPath may be a typo. Did you mean getStaticPaths?",
          type: "ExportNamedDeclaration",
        },
      ],
      filename: "pages/index.js",
      name: "should report error for getStaticPath typo (missing 's')",
    },
  ],
  valid: [
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export const getStaticPaths = async () => {};
      export const getStaticProps = async () => {};
    `,
      name: "should allow correct getStaticPaths and getStaticProps",
    },
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export const getServerSideProps = async () => {};
    `,
      name: "should allow correct getServerSideProps as const",
    },
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export async function getStaticPaths() {};
      export async function getStaticProps() {};
    `,
      name: "should allow correct getStaticPaths and getStaticProps as functions",
    },
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export async function getServerSideProps() {};
    `,
      name: "should allow correct getServerSideProps as function",
    },
    // detect only typo that is one operation away from the correct one
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export async function getServerSidePropsss() {};
    `,
      name: "should allow function names that are too different from data fetching functions",
    },
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export async function getstatisPath() {};
    `,
      name: "should allow function names that are too different from getStaticPaths",
    },
    // Test case for API routes
    {
      code: `
      export default function handler(req, res) {
        res.status(200).json({ message: 'API route' });
      }
      export async function getStaticPath() {};
    `,
      name: "should allow data fetching functions in API routes",
    },
    // Test case for non-identifier declarations (line 86)
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export const [getServurSideProps] = useState(() => {});
    `,
      name: "should allow typo-like names in destructuring patterns",
    },
    // Test case for API routes with typo
    {
      code: `
      export default function handler(req, res) {
        res.status(200).json({ message: 'API route' });
      }
      export async function getServurSideProps(){};
    `,
      name: "should allow typos in API routes",
    },
    // Test case for when both strings are completely different
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export async function someTotallyDifferentFunction() {};
    `,
      name: "should allow completely different function names",
    },
    // Test case for empty string comparison in minDistance
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export async function getServerSideProps() {};
      export const a = '';
    `,
      name: "should allow empty string exports",
    },
    // Test case for when a declaration has a different type (lines 91-93)
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export class MyClass {}
    `,
      name: "should allow class exports",
    },
    // Test case for destructuring patterns (line 86)
    {
      code: `
      export default function Page() {
        return <div></div>;
      }
      export const { getStaticpaths } = { getStaticpaths: () => {} };
    `,
      name: "should allow typo-like names in object destructuring",
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
}).run("no-typos", NextESLintRule, tests);

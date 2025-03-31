import { describe } from "bun:test";
import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-typos");

const tests = {
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
    },
  ],
  valid: [
    `
      export default function Page() {
        return <div></div>;
      }
      export const getStaticPaths = async () => {};
      export const getStaticProps = async () => {};
    `,
    `
      export default function Page() {
        return <div></div>;
      }
      export const getServerSideProps = async () => {};
    `,
    `
      export default function Page() {
        return <div></div>;
      }
      export async function getStaticPaths() {};
      export async function getStaticProps() {};
    `,
    `
      export default function Page() {
        return <div></div>;
      }
      export async function getServerSideProps() {};
    `,
    // detect only typo that is one operation away from the correct one
    `
      export default function Page() {
        return <div></div>;
      }
      export async function getServerSidePropsss() {};
    `,
    `
      export default function Page() {
        return <div></div>;
      }
      export async function getstatisPath() {};
    `,
    // Test case for API routes
    `
      export default function handler(req, res) {
        res.status(200).json({ message: 'API route' });
      }
      export async function getStaticPath() {};
    `,
    // Test case for non-identifier declarations (line 86)
    `
      export default function Page() {
        return <div></div>;
      }
      export const [getServurSideProps] = useState(() => {});
    `,
    // Test case for API routes with typo
    `
      export default function handler(req, res) {
        res.status(200).json({ message: 'API route' });
      }
      export async function getServurSideProps(){};
    `,
    // Test case for when both strings are completely different
    `
      export default function Page() {
        return <div></div>;
      }
      export async function someTotallyDifferentFunction() {};
    `,
    // Test case for empty string comparison in minDistance
    `
      export default function Page() {
        return <div></div>;
      }
      export async function getServerSideProps() {};
      export const a = '';
    `,
    // Test case for when a declaration has a different type (lines 91-93)
    `
      export default function Page() {
        return <div></div>;
      }
      export class MyClass {}
    `,
    // Test case for destructuring patterns (line 86)
    `
      export default function Page() {
        return <div></div>;
      }
      export const { getStaticpaths } = { getStaticpaths: () => {} };
    `,
  ],
};

describe("no-typos", () => {
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

import { describe } from "bun:test";
import { RuleTester as ESLintTesterV9 } from "eslint";
import { RuleTester as ESLintTesterV8 } from "eslint-v8";

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
  ],
};

describe("no-typos", () => {
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

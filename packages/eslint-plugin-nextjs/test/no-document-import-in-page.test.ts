import { describe } from "bun:test";
import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-document-import-in-page");

const tests = {
  invalid: [
    {
      code: `import Document from "next/document"

      export const Test = () => <p>Test</p>
      `,
      errors: [
        {
          message:
            "`<Document />` from `next/document` should not be imported outside of `pages/_document.js`. See: https://nextjs.org/docs/messages/no-document-import-in-page",
          type: "ImportDeclaration",
        },
      ],
      filename: "components/test.js",
    },
    {
      code: `import Document from "next/document"

      export const Test = () => <p>Test</p>
      `,
      errors: [
        {
          message:
            "`<Document />` from `next/document` should not be imported outside of `pages/_document.js`. See: https://nextjs.org/docs/messages/no-document-import-in-page",
          type: "ImportDeclaration",
        },
      ],
      filename: "pages/test.js",
    },
  ],
  valid: [
    {
      code: `import Document from "next/document"

    export default class MyDocument extends Document {
      render() {
        return (
          <Html>
          </Html>
        );
      }
    }
    `,
      filename: "pages/_document.js",
    },
    {
      code: `import Document from "next/document"

    export default class MyDocument extends Document {
      render() {
        return (
          <Html>
          </Html>
        );
      }
    }
    `,
      filename: "pages/_document.page.tsx",
    },
    {
      code: `import NDocument from "next/document"

    export default class Document extends NDocument {
      render() {
        return (
          <Html>
          </Html>
        );
      }
    }
    `,
      filename: "pages/_document/index.js",
    },
    {
      code: `import NDocument from "next/document"

    export default class Document extends NDocument {
      render() {
        return (
          <Html>
          </Html>
        );
      }
    }
    `,
      filename: "pages/_document/index.tsx",
    },
    {
      code: `import Document from "next/document"

    export default class MyDocument extends Document {
      render() {
        return (
          <Html>
          </Html>
        );
      }
    }
    `,
      filename: "pagesapp/src/pages/_document.js",
    },
  ],
};

describe("no-document-import-in-page", () => {
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

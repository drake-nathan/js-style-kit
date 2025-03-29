import { describe } from "bun:test";
import { RuleTester as ESLintTesterV9 } from "eslint";
import { RuleTester as ESLintTesterV8 } from "eslint-v8";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-css-tags");

const message =
  "Do not include stylesheets manually. See: https://nextjs.org/docs/messages/no-css-tags";

const tests = {
  invalid: [
    {
      code: `
      import {Head} from 'next/document';

        export class Blah extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <link href="/_next/static/css/styles.css" rel="stylesheet" />
              </div>
            );
          }
      }`,
      errors: [
        {
          message,
          type: "JSXOpeningElement",
        },
      ],
    },
    {
      code: `
      <div>
        <link href="/_next/static/css/styles.css" rel="stylesheet" />
      </div>`,
      errors: [
        {
          message,
          type: "JSXOpeningElement",
        },
      ],
    },
  ],

  valid: [
    `import {Head} from 'next/document';

      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
            </div>
          );
        }
    }`,

    `import {Head} from 'next/document';
      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet" />
            </div>
          );
        }
    }`,

    `import {Head} from 'next/document';
      export class Blah extends Head {
        render(props) {
          return (
            <div>
              <h1>Hello title</h1>
              <link {...props} />
            </div>
          );
        }
    }`,

    `import {Head} from 'next/document';
      export class Blah extends Head {
        render(props) {
          return (
            <div>
              <h1>Hello title</h1>
              <link rel="stylesheet" {...props} />
            </div>
          );
        }
    }`,
  ],
};

describe("no-css-tags", () => {
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

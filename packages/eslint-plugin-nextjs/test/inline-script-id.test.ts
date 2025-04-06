import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("inline-script-id");

const errorMessage =
  "`next/script` components with inline content must specify an `id` attribute. See: https://nextjs.org/docs/messages/inline-script-id";

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `import Script from 'next/script';

        export default function TestPage() {
          return (
            <Script>
              {\`console.log('Hello world');\`}
            </Script>
          )
        }`,
      errors: [
        {
          message: errorMessage,
          type: "JSXElement",
        },
      ],
      name: "should report error when Script component has inline content without id",
    },
    {
      code: `import Script from 'next/script';

        export default function TestPage() {
          return (
            <Script
              dangerouslySetInnerHTML={{
                __html: \`console.log('Hello world');\`
              }}
            />
          )
        }`,
      errors: [
        {
          message: errorMessage,
          type: "JSXElement",
        },
      ],
      name: "should report error when Script component has dangerouslySetInnerHTML without id",
    },
    {
      code: `import MyScript from 'next/script';

        export default function TestPage() {
          return (
            <MyScript>
              {\`console.log('Hello world');\`}
            </MyScript>
          )
        }`,
      errors: [
        {
          message: errorMessage,
          type: "JSXElement",
        },
      ],
      name: "should report error when renamed Script component has inline content without id",
    },
    {
      code: `import MyScript from 'next/script';

        export default function TestPage() {
          return (
            <MyScript
              dangerouslySetInnerHTML={{
                __html: \`console.log('Hello world');\`
              }}
            />
          )
        }`,
      errors: [
        {
          message: errorMessage,
          type: "JSXElement",
        },
      ],
      name: "should report error when renamed Script component has dangerouslySetInnerHTML without id",
    },
  ],
  valid: [
    {
      code: `import Script from 'next/script';

      export default function TestPage() {
        return (
          <Script id="test-script">
            {\`console.log('Hello world');\`}
          </Script>
        )
      }`,
      name: "should allow Script component with inline content and id",
    },
    {
      code: `import Script from 'next/script';

      export default function TestPage() {
        return (
          <Script
            id="test-script"
            dangerouslySetInnerHTML={{
              __html: \`console.log('Hello world');\`
            }}
          />
        )
      }`,
      name: "should allow Script component with dangerouslySetInnerHTML and id",
    },
    {
      code: `import Script from 'next/script';

      export default function TestPage() {
        return (
          <Script src="https://example.com" />
        )
      }`,
      name: "should allow Script component with src attribute and no id",
    },
    {
      code: `import MyScript from 'next/script';

      export default function TestPage() {
        return (
          <MyScript id="test-script">
            {\`console.log('Hello world');\`}
          </MyScript>
        )
      }`,
      name: "should allow renamed Script component with inline content and id",
    },
    {
      code: `import MyScript from 'next/script';

      export default function TestPage() {
        return (
          <MyScript
            id="test-script"
            dangerouslySetInnerHTML={{
              __html: \`console.log('Hello world');\`
            }}
          />
        )
      }`,
      name: "should allow renamed Script component with dangerouslySetInnerHTML and id",
    },
    {
      code: `import Script from 'next/script';

      export default function TestPage() {
        return (
          <Script {...{ strategy: "lazyOnload" }} id={"test-script"}>
            {\`console.log('Hello world');\`}
          </Script>
        )
      }`,
      name: "should allow Script component with spread attributes and separate id",
    },
    {
      code: `import Script from 'next/script';

      export default function TestPage() {
        return (
          <Script {...{ strategy: "lazyOnload", id: "test-script" }}>
            {\`console.log('Hello world');\`}
          </Script>
        )
      }`,
      name: "should allow Script component with id in spread attributes",
    },
    {
      code: `import Script from 'next/script';
      const spread = { strategy: "lazyOnload" }
      export default function TestPage() {
        return (
          <Script {...spread} id={"test-script"}>
            {\`console.log('Hello world');\`}
          </Script>
        )
      }`,
      name: "should allow Script component with variable spread attributes and separate id",
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
}).run("inline-script-id", NextESLintRule, tests);

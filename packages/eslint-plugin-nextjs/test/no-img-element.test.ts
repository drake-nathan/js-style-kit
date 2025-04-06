import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-img-element");

const message =
  "Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element";

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `
      export class MyComponent {
        render() {
          return (
            <div>
              <img
                src="/test.png"
                alt="Test picture"
                width={500}
                height={500}
              />
            </div>
          );
        }
      }`,
      errors: [{ message, type: "JSXOpeningElement" }],
      name: "should report error when using img element in a div",
    },
    {
      code: `
      export class MyComponent {
        render() {
          return (
            <img
              src="/test.png"
              alt="Test picture"
              width={500}
              height={500}
            />
          );
        }
      }`,
      errors: [{ message, type: "JSXOpeningElement" }],
      name: "should report error when using img element directly",
    },
    {
      code: `\
import { ImageResponse } from "next/og";

export default function Image() {
return new ImageResponse(
  (
    <img
      alt="avatar"
      style={{ borderRadius: "100%" }}
      width="100%"
      height="100%"
      src="https://example.com/image.png"
    />
  )
);
}
`,
      errors: [{ message, type: "JSXOpeningElement" }],
      filename: `some/non-metadata-route-image.tsx`,
      name: "should report error when using img element in ImageResponse outside metadata routes",
    },
  ],
  valid: [
    {
      code: `import { Image } from 'next/image';

      export class MyComponent {
        render() {
          return (
            <div>
              <Image
                src="/test.png"
                alt="Test picture"
                width={500}
                height={500}
              />
            </div>
          );
        }
      }`,
      name: "should allow Image component from next/image",
    },
    {
      code: `export class MyComponent {
        render() {
          return (
            <picture>
              <img
                src="/test.png"
                alt="Test picture"
                width={500}
                height={500}
              />
            </picture>
          );
        }
      }`,
      name: "should allow img element inside picture element",
    },
    {
      code: `export class MyComponent {
        render() {
          return (
            <div>
              <picture>
                <source media="(min-width:650px)" srcset="/test.jpg"/>
                <img
                  src="/test.png"
                  alt="Test picture"
                  style="width:auto;"
                />
              </picture>
            </div>
          );
        }
      }`,
      name: "should allow img element inside picture element with source",
    },
    {
      code: `\
import { ImageResponse } from "next/og";

export default function icon() {
  return new ImageResponse(
    (
      <img
        alt="avatar"
        style={{ borderRadius: "100%" }}
        width="100%"
        height="100%"
        src="https://example.com/image.png"
      />
    )
  );
}
`,
      filename: `src/app/icon.js`,
      name: "should allow img element in icon.js metadata route",
    },
    {
      code: `\
import { ImageResponse } from "next/og";

export default function Image() {
  return new ImageResponse(
    (
      <img
        alt="avatar"
        style={{ borderRadius: "100%" }}
        width="100%"
        height="100%"
        src="https://example.com/image.png"
      />
    )
  );
}
`,
      filename: `app/opengraph-image.tsx`,
      name: "should allow img element in opengraph-image.tsx metadata route",
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
}).run("no-img-element", NextESLintRule, tests);

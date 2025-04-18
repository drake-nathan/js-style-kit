import type { RuleDefinition } from "@eslint/core";

const name = "no-unwanted-polyfillio";
const url = `https://nextjs.org/docs/messages/${name}`;

// Keep in sync with next.js polyfills file : https://github.com/vercel/next.js/blob/master/packages/next-polyfill-nomodule/src/index.js
const NEXT_POLYFILLED_FEATURES = [
  "Array.prototype.@@iterator",
  "Array.prototype.at",
  "Array.prototype.copyWithin",
  "Array.prototype.fill",
  "Array.prototype.find",
  "Array.prototype.findIndex",
  "Array.prototype.flatMap",
  "Array.prototype.flat",
  "Array.from",
  "Array.prototype.includes",
  "Array.of",
  "Function.prototype.name",
  "fetch",
  "Map",
  "Number.EPSILON",
  "Number.Epsilon",
  "Number.isFinite",
  "Number.isNaN",
  "Number.isInteger",
  "Number.isSafeInteger",
  "Number.MAX_SAFE_INTEGER",
  "Number.MIN_SAFE_INTEGER",
  "Number.parseFloat",
  "Number.parseInt",
  "Object.assign",
  "Object.entries",
  "Object.fromEntries",
  "Object.getOwnPropertyDescriptor",
  "Object.getOwnPropertyDescriptors",
  "Object.hasOwn",
  "Object.is",
  "Object.keys",
  "Object.values",
  "Reflect",
  "Set",
  "Symbol",
  "Symbol.asyncIterator",
  "String.prototype.codePointAt",
  "String.prototype.endsWith",
  "String.fromCodePoint",
  "String.prototype.includes",
  "String.prototype.@@iterator",
  "String.prototype.padEnd",
  "String.prototype.padStart",
  "String.prototype.repeat",
  "String.raw",
  "String.prototype.startsWith",
  "String.prototype.trimEnd",
  "String.prototype.trimStart",
  "URL",
  "URL.prototype.toJSON",
  "URLSearchParams",
  "WeakMap",
  "WeakSet",
  "Promise",
  "Promise.prototype.finally",
  "es2015", // Should be covered by babel-preset-env instead.
  "es2016", // contains polyfilled 'Array.prototype.includes', 'String.prototype.padEnd' and 'String.prototype.padStart'
  "es2017", // contains polyfilled 'Object.entries', 'Object.getOwnPropertyDescriptors', 'Object.values', 'String.prototype.padEnd' and 'String.prototype.padStart'
  "es2018", // contains polyfilled 'Promise.prototype.finally' and ''Symbol.asyncIterator'
  "es2019", // Contains polyfilled 'Object.fromEntries' and polyfilled 'Array.prototype.flat', 'Array.prototype.flatMap', 'String.prototype.trimEnd' and 'String.prototype.trimStart'
  "es5", // Should be covered by babel-preset-env instead.
  "es6", // Should be covered by babel-preset-env instead.
  "es7", // contains polyfilled 'Array.prototype.includes', 'String.prototype.padEnd' and 'String.prototype.padStart'
];

type MessageId = "noUnwantedPolyfillio";

export const noUnwantedPolyfillio: RuleDefinition = {
  create: (context) => {
    let scriptImport: null | string = null;

    return {
      ImportDeclaration: (node: any) => {
        if (node.source.value === "next/script" && node.specifiers.length > 0) {
          const specifier = node.specifiers[0];
          if (specifier && specifier.type === "ImportDefaultSpecifier") {
            scriptImport = specifier.local.name;
          }
        }
      },
      JSXOpeningElement: (node: any) => {
        if (
          node.name.type !== "JSXIdentifier" ||
          (node.name.name !== "script" && node.name.name !== scriptImport)
        ) {
          return;
        }
        if (node.attributes.length === 0) {
          return;
        }

        const srcNode = node.attributes.find(
          (attr: any) =>
            attr.type === "JSXAttribute" &&
            attr.name.type === "JSXIdentifier" &&
            attr.name.name === "src",
        );
        if (
          !srcNode?.value ||
          srcNode.value.type !== "Literal" ||
          typeof srcNode.value.value !== "string"
        ) {
          return;
        }
        const src = srcNode.value.value;
        if (
          src.startsWith("https://cdn.polyfill.io/v2/") ||
          src.startsWith("https://polyfill.io/v3/") ||
          // https://community.fastly.com/t/new-options-for-polyfill-io-users/2540
          src.startsWith("https://polyfill-fastly.net/") ||
          src.startsWith("https://polyfill-fastly.io/") ||
          // https://blog.cloudflare.com/polyfill-io-now-available-on-cdnjs-reduce-your-supply-chain-risk
          src.startsWith("https://cdnjs.cloudflare.com/polyfill/")
        ) {
          const featureQueryString = new URL(src).searchParams.get("features");
          const featuresRequested = featureQueryString?.split(",") ?? [""];
          const unwantedFeatures = featuresRequested.filter((feature: string) =>
            NEXT_POLYFILLED_FEATURES.includes(feature),
          );
          if (unwantedFeatures.length > 0) {
            context.report({
              data: {
                features: unwantedFeatures.join(", "),
                url,
                verb: unwantedFeatures.length > 1 ? "are" : "is",
              },
              messageId: "noUnwantedPolyfillio",
              node,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Prevent duplicate polyfills from Polyfill.io.",
      url,
    },
    messages: {
      noUnwantedPolyfillio:
        "No duplicate polyfills from Polyfill.io are allowed. {{features}} {{verb}} already shipped with Next.js. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};

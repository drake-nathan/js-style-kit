import type { RuleDefinition } from "@eslint/core";

import { posix, sep } from "node:path";

import NodeAttributes from "../utils/node-attributes.js";

const name = "no-page-custom-font";
const url = `https://nextjs.org/docs/messages/${name}`;

const isIdentifierMatch = (id1: any, id2: any): boolean | null =>
  (id1 === null && id2 === null) || (id1 && id2 && id1.name === id2.name);

type MessageId = "noPageCustomFont" | "noPageCustomFontOutsideHead";

/**
 * Rule to prevent page-only custom fonts
 */
export const noPageCustomFont: RuleDefinition = {
  create: (context) => {
    const { sourceCode } = context;
    const paths = context.filename.split("pages");
    const page = paths[paths.length - 1];

    // outside of a file within `pages`, bail
    if (!page) {
      return {};
    }

    const isDocument =
      page.startsWith(`${sep}_document`) ||
      page.startsWith(`${posix.sep}_document`);

    let documentImportName: string | undefined;
    let localDefaultExportId: any = null;
    let exportDeclarationType: any;

    return {
      ExportDefaultDeclaration: (node): void => {
        exportDeclarationType = node.declaration.type;

        if (node.declaration.type === "FunctionDeclaration") {
          localDefaultExportId = node.declaration.id;
          return;
        }

        if (
          node.declaration.type === "ClassDeclaration" &&
          node.declaration.superClass &&
          node.declaration.superClass.type === "Identifier" &&
          node.declaration.superClass.name === documentImportName
        ) {
          localDefaultExportId = node.declaration.id;
        }
      },

      ImportDeclaration: (node): void => {
        if (node.source.value === "next/document") {
          const documentImport = node.specifiers.find(
            (specifier: any) => specifier.type === "ImportDefaultSpecifier",
          );
          if (documentImport?.local) {
            documentImportName = documentImport.local.name;
          }
        }
      },

      JSXOpeningElement: (node): void => {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "link") {
          return;
        }

        const ancestors = (sourceCode as any).getAncestors(node);

        // if `export default <n>` is further down within the file after the
        // currently traversed component, then `localDefaultExportName` will
        // still be undefined
        if (!localDefaultExportId) {
          // find the top level of the module
          const program = ancestors.find(
            (ancestor: any) => ancestor.type === "Program",
          );

          if (!program?.tokens) {
            return;
          }

          // go over each token to find the combination of `export default <n>`
          for (let i = 0; i <= program.tokens.length - 1; i++) {
            if (localDefaultExportId) {
              break;
            }

            const token = program.tokens[i];

            // TODO: fix

            if (token?.type === "Keyword" && token.value === "export") {
              const nextToken = program.tokens[i + 1];

              if (nextToken && nextToken.value === "default") {
                const maybeIdentifier = program.tokens[i + 2];

                // TODO: fix

                if (maybeIdentifier && maybeIdentifier.type === "Identifier") {
                  // Create a simple identifier with the name
                  // This is a simplification and may not be fully type-safe
                  // but works for our comparison purposes
                  localDefaultExportId = {
                    decorators: [],
                    loc: {
                      end: { column: 0, line: 0 },
                      start: { column: 0, line: 0 },
                    },
                    name: maybeIdentifier.value,
                    optional: false,
                    range: [0, 0],
                    type: "Identifier",
                  };
                }
              }
            }
          }
        }

        const parentComponent = ancestors.find((ancestor: any) => {
          // export default class ... extends ...
          if (exportDeclarationType === "ClassDeclaration") {
            return (
              ancestor.type === exportDeclarationType &&
              "superClass" in ancestor &&
              ancestor.superClass &&
              ancestor.superClass.type === "Identifier" &&
              ancestor.superClass.name === documentImportName
            );
          }

          if ("id" in ancestor) {
            // export default function ...
            if (exportDeclarationType === "FunctionDeclaration") {
              return (
                ancestor.type === exportDeclarationType &&
                isIdentifierMatch(ancestor.id, localDefaultExportId)
              );
            }

            // function ...() {} export default ...
            // class ... extends ...; export default ...
            return isIdentifierMatch(ancestor.id, localDefaultExportId);
          }

          return false;
        });

        // file starts with _document and this <link /> is within the default export
        if (isDocument && parentComponent) {
          return;
        }

        const attributes = new NodeAttributes(node);
        if (!attributes.has("href") || !attributes.hasValue("href")) {
          return;
        }

        const hrefValue = attributes.value("href");
        const isGoogleFont =
          typeof hrefValue === "string" &&
          hrefValue.startsWith("https://fonts.googleapis.com/css");

        if (isGoogleFont) {
          // No longer needed as we use messageId

          // Determine which message to use based on context

          context.report({
            data: { url },
            messageId:
              isDocument ? "noPageCustomFontOutsideHead" : "noPageCustomFont",
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Prevent page-only custom fonts.",
      recommended: true,
      url,
    },
    messages: {
      noPageCustomFont:
        "Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: {{url}}",
      noPageCustomFontOutsideHead:
        "Using `<link />` outside of `<Head>` will disable automatic font optimization. This is discouraged. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};

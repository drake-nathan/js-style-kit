import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { posix, sep } from "node:path";

import NodeAttributes from "../utils/node-attributes.js";

const name = "no-page-custom-font";
const url = `https://nextjs.org/docs/messages/${name}`;

const isIdentifierMatch = (
  id1: null | TSESTree.Identifier,
  id2: null | TSESTree.Identifier,
): boolean | null =>
  (id1 === null && id2 === null) || (id1 && id2 && id1.name === id2.name);

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noPageCustomFont" | "noPageCustomFontOutsideHead";

/**
 * Rule to prevent page-only custom fonts
 */
export const noPageCustomFont = createRule<Options, MessageId>({
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
    let localDefaultExportId: null | TSESTree.Identifier = null;
    let exportDeclarationType: AST_NODE_TYPES | undefined;

    return {
      ExportDefaultDeclaration: (
        node: TSESTree.ExportDefaultDeclaration,
      ): void => {
        exportDeclarationType = node.declaration.type;

        if (node.declaration.type === AST_NODE_TYPES.FunctionDeclaration) {
          localDefaultExportId = node.declaration.id;
          return;
        }

        if (
          node.declaration.type === AST_NODE_TYPES.ClassDeclaration &&
          node.declaration.superClass &&
          node.declaration.superClass.type === AST_NODE_TYPES.Identifier &&
          node.declaration.superClass.name === documentImportName
        ) {
          localDefaultExportId = node.declaration.id;
        }
      },

      ImportDeclaration: (node: TSESTree.ImportDeclaration): void => {
        if (node.source.value === "next/document") {
          const documentImport = node.specifiers.find(
            (specifier): specifier is TSESTree.ImportDefaultSpecifier =>
              specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier,
          );
          if (documentImport?.local) {
            documentImportName = documentImport.local.name;
          }
        }
      },

      JSXOpeningElement: (node: TSESTree.JSXOpeningElement): void => {
        if (
          node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.name.name !== "link"
        ) {
          return;
        }

        const ancestors = sourceCode.getAncestors(node);

        // if `export default <n>` is further down within the file after the
        // currently traversed component, then `localDefaultExportName` will
        // still be undefined
        if (!localDefaultExportId) {
          // find the top level of the module
          const program = ancestors.find(
            (ancestor): ancestor is TSESTree.Program =>
              ancestor.type === AST_NODE_TYPES.Program,
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            if (token?.type === "Keyword" && token.value === "export") {
              const nextToken = program.tokens[i + 1];

              if (nextToken && nextToken.value === "default") {
                const maybeIdentifier = program.tokens[i + 2];

                // TODO: fix
                // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
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
                    type: AST_NODE_TYPES.Identifier,
                    // TODO: fix
                  } as unknown as TSESTree.Identifier;
                }
              }
            }
          }
        }

        const parentComponent = ancestors.find((ancestor) => {
          // export default class ... extends ...
          if (exportDeclarationType === AST_NODE_TYPES.ClassDeclaration) {
            return (
              ancestor.type === exportDeclarationType &&
              "superClass" in ancestor &&
              ancestor.superClass &&
              ancestor.superClass.type === AST_NODE_TYPES.Identifier &&
              ancestor.superClass.name === documentImportName
            );
          }

          if ("id" in ancestor) {
            // export default function ...
            if (exportDeclarationType === AST_NODE_TYPES.FunctionDeclaration) {
              return (
                ancestor.type === exportDeclarationType &&
                isIdentifierMatch(ancestor.id, localDefaultExportId)
              );
            }

            // function ...() {} export default ...
            // class ... extends ...; export default ...
            // @ts-expect-error TODO: fix this
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
  defaultOptions: [],
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
    },
    schema: [],
    type: "problem",
  },
  name,
});

import type { RuleDefinition } from "@eslint/core";

const name = "no-duplicate-head";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noDuplicateHead";

/**
 * Rule to prevent duplicate usage of <Head> in pages/_document.js
 */
export const noDuplicateHead: RuleDefinition = {
  create: (context) => {
    const { sourceCode } = context;
    let documentImportName: null | string = null;
    return {
      ImportDeclaration: (node) => {
        if (node.source.value === "next/document") {
          const documentImport = node.specifiers.find(
            (specifier: any) => specifier.type === "ImportDefaultSpecifier",
          );
          if (documentImport?.local) {
            documentImportName = documentImport.local.name;
          }
        }
      },
      ReturnStatement: (node) => {
        const ancestors = (sourceCode as any).getAncestors(node);
        const documentClass = ancestors.find(
          (ancestorNode: any) =>
            ancestorNode.type === "ClassDeclaration" &&
            ancestorNode.superClass &&
            ancestorNode.superClass.type === "Identifier" &&
            ancestorNode.superClass.name === documentImportName,
        );

        if (!documentClass) {
          return;
        }

        if (node.argument && node.argument.type === "JSXElement") {
          const headComponents = node.argument.children
            .filter(
              (childrenNode: any) =>
                childrenNode.type === "JSXElement" &&
                childrenNode.openingElement.name.type === "JSXIdentifier" &&
                childrenNode.openingElement.name.name === "Head",
            )
            // Ensure we have valid nodes for reporting
            .filter(Boolean);

          if (headComponents.length > 1) {
            for (let i = 1; i < headComponents.length; i++) {
              context.report({
                data: { url },
                messageId: "noDuplicateHead",
                node: headComponents[i],
              });
            }
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Prevent duplicate usage of `<Head>` in `pages/_document.js`.",
      recommended: true,
      url,
    },
    messages: {
      noDuplicateHead:
        "Do not include multiple instances of `<Head/>`. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};

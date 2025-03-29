import { defineRule } from "../utils/define-rule.js";
const url = "https://nextjs.org/docs/messages/no-duplicate-head";

export const noDuplicateHead = defineRule({
  create: (context) => {
    const { sourceCode } = context;
    let documentImportName: null | string = null;
    return {
      ImportDeclaration: (node) => {
        if (node.source.value === "next/document") {
          const documentImport = node.specifiers.find(
            ({ type }) => type === "ImportDefaultSpecifier",
          );
          if (documentImport?.local) {
            documentImportName = documentImport.local.name;
          }
        }
      },
      ReturnStatement: (node) => {
        const ancestors = sourceCode.getAncestors(node);
        const documentClass = ancestors.find(
          (ancestorNode) =>
            ancestorNode.type === "ClassDeclaration" &&
            ancestorNode.superClass &&
            "name" in ancestorNode.superClass &&
            ancestorNode.superClass.name === documentImportName,
        );

        if (!documentClass) {
          return;
        }

        if (
          node.argument &&
          "children" in node.argument &&
          node.argument.children
        ) {
          // @ts-expect-error - `node.argument` could be a `JSXElement` which has property `children`
          const headComponents = node.argument.children.filter(
            (childrenNode: any) =>
              childrenNode.openingElement?.name &&
              childrenNode.openingElement.name.name === "Head",
          );

          if (headComponents.length > 1) {
            for (let i = 1; i < headComponents.length; i++) {
              context.report({
                message: `Do not include multiple instances of \`<Head/>\`. See: ${url}`,
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
    schema: [],
    type: "problem",
  },
});

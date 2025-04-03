import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

const name = "no-duplicate-head";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noDuplicateHead";

/**
 * Rule to prevent duplicate usage of <Head> in pages/_document.js
 */
export const noDuplicateHead = createRule<Options, MessageId>({
  create: (context) => {
    const { sourceCode } = context;
    let documentImportName: null | string = null;
    return {
      ImportDeclaration: (node: TSESTree.ImportDeclaration) => {
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
      ReturnStatement: (node: TSESTree.ReturnStatement) => {
        const ancestors = sourceCode.getAncestors(node);
        const documentClass = ancestors.find(
          (ancestorNode): ancestorNode is TSESTree.ClassDeclaration =>
            // @ts-expect-error initial override, TODO: fix
            ancestorNode.type === AST_NODE_TYPES.ClassDeclaration &&
            ancestorNode.superClass &&
            ancestorNode.superClass.type === AST_NODE_TYPES.Identifier &&
            ancestorNode.superClass.name === documentImportName,
        );

        if (!documentClass) {
          return;
        }

        if (node.argument && node.argument.type === AST_NODE_TYPES.JSXElement) {
          const headComponents = node.argument.children
            .filter(
              (childrenNode): childrenNode is TSESTree.JSXElement =>
                childrenNode.type === AST_NODE_TYPES.JSXElement &&
                childrenNode.openingElement.name.type ===
                  AST_NODE_TYPES.JSXIdentifier &&
                childrenNode.openingElement.name.name === "Head",
            )
            // Ensure we have valid nodes for reporting
            .filter(Boolean);

          if (headComponents.length > 1) {
            for (let i = 1; i < headComponents.length; i++) {
              context.report({
                data: { url },
                messageId: "noDuplicateHead",
                // @ts-expect-error initial override, TODO: fix
                node: headComponents[i],
              });
            }
          }
        }
      },
    };
  },
  defaultOptions: [],
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
    },
    schema: [],
    type: "problem",
  },
  name,
});

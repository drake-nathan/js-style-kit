import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

const name = "no-title-in-document-head";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noTitleInDocumentHead";

/**
 * Rule to prevent usage of <title> with Head component from next/document
 */
export const noTitleInDocumentHead = createRule<Options, MessageId>({
  create: (context) => {
    let headFromNextDocument = false;
    return {
      ImportDeclaration: (node: TSESTree.ImportDeclaration) => {
        if (node.source.value === "next/document") {
          if (
            node.specifiers.some(
              (specifier) =>
                specifier.type === AST_NODE_TYPES.ImportSpecifier &&
                specifier.local.name === "Head",
            )
          ) {
            headFromNextDocument = true;
          }
        }
      },
      JSXElement: (node: TSESTree.JSXElement) => {
        if (!headFromNextDocument) {
          return;
        }

        if (
          node.openingElement.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.openingElement.name.name !== "Head"
        ) {
          return;
        }

        const titleTag = node.children.find(
          (child): child is TSESTree.JSXElement =>
            child.type === AST_NODE_TYPES.JSXElement &&
            child.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier &&
            child.openingElement.name.name === "title",
        );

        if (titleTag) {
          context.report({
            data: { url },
            messageId: "noTitleInDocumentHead",
            node: titleTag,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Prevent usage of `<title>` with `Head` component from `next/document`.",
      recommended: true,
      url,
    },
    messages: {
      noTitleInDocumentHead:
        "Do not use `<title>` element with `<Head />` component from `next/document`. Titles should defined at the page-level using `<Head />` from `next/head` instead. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

const name = "no-script-component-in-head";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noScriptComponentInHead";

/**
 * Rule to prevent usage of next/script in next/head component
 */
export const noScriptComponentInHead = createRule<Options, MessageId>({
  create: (context) => {
    let isNextHead: null | string = null;

    return {
      ImportDeclaration: (node: TSESTree.ImportDeclaration) => {
        if (node.source.value === "next/head") {
          isNextHead = node.source.value;
        }
      },
      JSXElement: (node: TSESTree.JSXElement) => {
        if (!isNextHead) {
          return;
        }

        if (
          node.openingElement.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.openingElement.name.name !== "Head"
        ) {
          return;
        }

        const scriptTag = node.children.find(
          (child): child is TSESTree.JSXElement =>
            child.type === AST_NODE_TYPES.JSXElement &&
            child.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier &&
            child.openingElement.name.name === "Script",
        );

        if (scriptTag) {
          context.report({
            data: { url },
            messageId: "noScriptComponentInHead",
            node,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: "Prevent usage of `next/script` in `next/head` component.",
      recommended: true,
      url,
    },
    messages: {
      noScriptComponentInHead:
        "`next/script` should not be used in `next/head` component. Move `<Script />` outside of `<Head>` instead. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});

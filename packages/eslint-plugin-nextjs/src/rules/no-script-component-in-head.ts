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

    /**
     * Recursively find Script components inside a node's children
     */
    const findNestedScriptComponent = (
      node: TSESTree.Node,
    ): null | TSESTree.JSXElement => {
      if (node.type !== AST_NODE_TYPES.JSXElement) {
        return null;
      }

      // Check if current element is a Script component
      if (
        node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier &&
        node.openingElement.name.name === "Script"
      ) {
        return node;
      }

      // Recursively check all children
      for (const child of node.children) {
        const scriptComponent = findNestedScriptComponent(child);
        if (scriptComponent) {
          return scriptComponent;
        }
      }

      return null;
    };

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

        // Use recursive function to find any nested Script component
        const scriptTag = findNestedScriptComponent(node);

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

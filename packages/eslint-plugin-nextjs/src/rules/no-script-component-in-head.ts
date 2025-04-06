import type { RuleDefinition } from "@eslint/core";

const name = "no-script-component-in-head";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noScriptComponentInHead";

/**
 * Rule to prevent usage of next/script in next/head component
 */
export const noScriptComponentInHead: RuleDefinition = {
  create: (context) => {
    let isNextHead: null | string = null;

    /**
     * Recursively find Script components inside a node's children
     */
    const findNestedScriptComponent = (node: any): any => {
      if (node.type !== "JSXElement") {
        return null;
      }

      // Check if current element is a Script component
      if (
        node.openingElement.name.type === "JSXIdentifier" &&
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
      ImportDeclaration: (node: any) => {
        if (node.source.value === "next/head") {
          isNextHead = node.source.value;
        }
      },
      JSXElement: (node: any) => {
        if (!isNextHead) {
          return;
        }

        if (
          node.openingElement.name.type !== "JSXIdentifier" ||
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
  meta: {
    docs: {
      description: "Prevent usage of `next/script` in `next/head` component.",
      recommended: true,
      url,
    },
    messages: {
      noScriptComponentInHead:
        "`next/script` should not be used in `next/head` component. Move `<Script />` outside of `<Head>` instead. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};

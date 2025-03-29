import { defineRule } from "../utils/define-rule.js";
const url = "https://nextjs.org/docs/messages/no-script-component-in-head";

export const noScriptComponentInHead = defineRule({
  create: (context: any) => {
    let isNextHead: null | string = null;

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
          node.openingElement?.name &&
          node.openingElement.name.name !== "Head"
        ) {
          return;
        }

        const scriptTag = node.children.find(
          (child: any) =>
            child.openingElement?.name &&
            child.openingElement.name.name === "Script",
        );

        if (scriptTag) {
          context.report({
            message: `\`next/script\` should not be used in \`next/head\` component. Move \`<Script />\` outside of \`<Head>\` instead. See: ${url}`,
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
    schema: [],
    type: "problem",
  },
});

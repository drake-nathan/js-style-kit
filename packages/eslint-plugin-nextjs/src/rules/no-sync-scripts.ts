import { defineRule } from "../utils/define-rule.js";

const url = "https://nextjs.org/docs/messages/no-sync-scripts";

export const noSyncScripts = defineRule({
  create: (context: any) => ({
      JSXOpeningElement: (node: any) => {
        if (node.name.name !== "script") {
          return;
        }
        if (node.attributes.length === 0) {
          return;
        }
        const attributeNames = node.attributes
          .filter((attr: any) => attr.type === "JSXAttribute")
          .map((attr: any) => attr.name.name);
        if (
          attributeNames.includes("src") &&
          !attributeNames.includes("async") &&
          !attributeNames.includes("defer")
        ) {
          context.report({
            message: `Synchronous scripts should not be used. See: ${url}`,
            node,
          });
        }
      },
    }),
  meta: {
    docs: {
      description: "Prevent synchronous scripts.",
      recommended: true,
      url,
    },
    schema: [],
    type: "problem",
  },
});

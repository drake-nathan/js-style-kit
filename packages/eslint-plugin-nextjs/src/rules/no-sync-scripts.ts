import type { RuleDefinition } from "@eslint/core";

const name = "no-sync-scripts";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noSyncScripts";

/**
 * Rule to prevent synchronous scripts
 */
export const noSyncScripts: RuleDefinition = {
  create: (context) => ({
    JSXOpeningElement: (node: any) => {
      if (node.name.type !== "JSXIdentifier" || node.name.name !== "script") {
        return;
      }
      if (node.attributes.length === 0) {
        return;
      }
      const attributeNames = node.attributes
        .filter(
          (attr: any) =>
            attr.type === "JSXAttribute" && attr.name.type === "JSXIdentifier",
        )
        .map((attr: any) => attr.name.name);
      if (
        attributeNames.includes("src") &&
        !attributeNames.includes("async") &&
        !attributeNames.includes("defer")
      ) {
        context.report({
          data: { url },
          messageId: "noSyncScripts",
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
    messages: {
      noSyncScripts: "Synchronous scripts should not be used. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};

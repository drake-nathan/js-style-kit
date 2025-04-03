import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

const name = "no-sync-scripts";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noSyncScripts";

/**
 * Rule to prevent synchronous scripts
 */
export const noSyncScripts = createRule<Options, MessageId>({
  create: (context) => ({
    JSXOpeningElement: (node: TSESTree.JSXOpeningElement) => {
      if (
        node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
        node.name.name !== "script"
      ) {
        return;
      }
      if (node.attributes.length === 0) {
        return;
      }
      const attributeNames = node.attributes
        .filter(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === AST_NODE_TYPES.JSXAttribute &&
            attr.name.type === AST_NODE_TYPES.JSXIdentifier,
        )
        .map((attr) => attr.name.name);
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
  defaultOptions: [],
  meta: {
    docs: {
      description: "Prevent synchronous scripts.",
      recommended: true,
      url,
    },
    messages: {
      noSyncScripts: "Synchronous scripts should not be used. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});

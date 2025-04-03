import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

const name = "no-css-tags";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noCssTags";

/**
 * Rule to prevent manual stylesheet tags
 */
export const noCssTags = createRule<Options, MessageId>({
  create: (context) => ({
    JSXOpeningElement: (node: TSESTree.JSXOpeningElement) => {
      if (
        node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
        node.name.name !== "link"
      ) {
        return;
      }
      if (node.attributes.length === 0) {
        return;
      }

      const attributes = node.attributes.filter(
        (attr): attr is TSESTree.JSXAttribute =>
          attr.type === AST_NODE_TYPES.JSXAttribute,
      );
      if (
        attributes.find(
          (attr) =>
            attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
            attr.name.name === "rel" &&
            attr.value &&
            attr.value.type === AST_NODE_TYPES.Literal &&
            attr.value.value === "stylesheet",
        ) &&
        attributes.find(
          (attr) =>
            attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
            attr.name.name === "href" &&
            attr.value &&
            attr.value.type === AST_NODE_TYPES.Literal &&
            typeof attr.value.value === "string" &&
            !/^https?/.test(attr.value.value),
        )
      ) {
        context.report({
          data: { url },
          messageId: "noCssTags",
          node,
        });
      }
    },
  }),
  defaultOptions: [],
  meta: {
    docs: {
      description: "Prevent manual stylesheet tags.",
      recommended: true,
      url,
    },
    messages: {
      noCssTags: "Do not include stylesheets manually. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import * as path from "node:path";

const name = "no-styled-jsx-in-document";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noStyledJsxInDocument";

/**
 * Rule to prevent usage of styled-jsx in pages/_document.js
 */
export const noStyledJsxInDocument = createRule<Options, MessageId>({
  create: (context) => ({
    JSXOpeningElement: (node: TSESTree.JSXOpeningElement) => {
      const document = context.filename.split("pages", 2)[1];
      if (!document) {
        return;
      }
      const { dir, name } = path.parse(document);

      if (
        !(
          name.startsWith("_document") ||
          (dir === "/_document" && name === "index")
        )
      ) {
        return;
      }

      if (
        node.name.type === AST_NODE_TYPES.JSXIdentifier &&
        node.name.name === "style" &&
        node.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === AST_NODE_TYPES.JSXAttribute &&
            attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
            attr.name.name === "jsx",
        )
      ) {
        context.report({
          data: { url },
          messageId: "noStyledJsxInDocument",
          node,
        });
      }
    },
  }),
  defaultOptions: [],
  meta: {
    docs: {
      description: "Prevent usage of `styled-jsx` in `pages/_document.js`.",
      recommended: true,
      url,
    },
    messages: {
      noStyledJsxInDocument:
        "`styled-jsx` should not be used in `pages/_document.js`. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});

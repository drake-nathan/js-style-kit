import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

const name = "inline-script-id";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "missingId";

/**
 * Rule to enforce id attribute on next/script components with inline content
 */
export const inlineScriptId = createRule<Options, MessageId>({
  create: (context) => {
    let nextScriptImportName: null | string = null;

    return {
      ImportDeclaration: (node: TSESTree.ImportDeclaration) => {
        if (node.source.value === "next/script" && node.specifiers.length > 0) {
          const specifier = node.specifiers[0];
          if (
            specifier &&
            specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier
          ) {
            nextScriptImportName = specifier.local.name;
          }
        }
      },
      JSXElement: (node: TSESTree.JSXElement) => {
        if (nextScriptImportName === null) {
          return;
        }

        if (
          node.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier &&
          node.openingElement.name.name !== nextScriptImportName
        ) {
          return;
        }

        const attributeNames = new Set<string>();

        let hasNonCheckableSpreadAttribute = false;
        node.openingElement.attributes.forEach((attribute) => {
          // Early return if we already have a non-checkable spread attribute, for better performance
          if (hasNonCheckableSpreadAttribute) {
            return;
          }

          if (attribute.type === AST_NODE_TYPES.JSXAttribute) {
            if (attribute.name.type === AST_NODE_TYPES.JSXIdentifier) {
              attributeNames.add(attribute.name.name);
            }
            // TODO: fix
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          } else if (attribute.type === AST_NODE_TYPES.JSXSpreadAttribute) {
            if (attribute.argument.type === AST_NODE_TYPES.ObjectExpression) {
              attribute.argument.properties.forEach((property) => {
                if (
                  property.type === AST_NODE_TYPES.Property &&
                  property.key.type === AST_NODE_TYPES.Identifier
                ) {
                  attributeNames.add(property.key.name);
                }
              });
            } else {
              // JSXSpreadAttribute without properties is not checkable
              hasNonCheckableSpreadAttribute = true;
            }
          }
        });

        // https://github.com/vercel/next.js/issues/34030
        // If there is a non-checkable spread attribute, we simply ignore them, TODO: fix
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (hasNonCheckableSpreadAttribute) {
          return;
        }

        if (
          node.children.length > 0 ||
          attributeNames.has("dangerouslySetInnerHTML")
        ) {
          if (!attributeNames.has("id")) {
            context.report({
              data: { url },
              messageId: "missingId",
              node,
            });
          }
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Enforce `id` attribute on `next/script` components with inline content.",
      recommended: true,
      url,
    },
    messages: {
      missingId:
        "`next/script` components with inline content must specify an `id` attribute. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});

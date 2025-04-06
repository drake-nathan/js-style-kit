import type { RuleDefinition } from "@eslint/core";
const name = "inline-script-id";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "missingId";

/**
 * Rule to enforce id attribute on next/script components with inline content
 */
export const inlineScriptId: RuleDefinition = {
  create: (context) => {
    let nextScriptImportName: null | string = null;

    return {
      ImportDeclaration: (node) => {
        if (node.source.value === "next/script" && node.specifiers.length > 0) {
          const specifier = node.specifiers[0];
          if (specifier && specifier.type === "ImportDefaultSpecifier") {
            nextScriptImportName = specifier.local.name;
          }
        }
      },
      JSXElement: (node) => {
        if (nextScriptImportName === null) {
          return;
        }

        if (
          node.openingElement.name.type === "JSXIdentifier" &&
          node.openingElement.name.name !== nextScriptImportName
        ) {
          return;
        }

        const attributeNames = new Set<string>();

        let hasNonCheckableSpreadAttribute = false;
        node.openingElement.attributes.forEach((attribute: any) => {
          // Early return if we already have a non-checkable spread attribute, for better performance
          if (hasNonCheckableSpreadAttribute) {
            return;
          }

          if (attribute.type === "JSXAttribute") {
            if (attribute.name.type === "JSXIdentifier") {
              attributeNames.add(attribute.name.name);
            }
          } else if (attribute.type === "JSXSpreadAttribute") {
            if (attribute.argument.type === "ObjectExpression") {
              attribute.argument.properties.forEach((property: any) => {
                if (
                  property.type === "Property" &&
                  property.key.type === "Identifier"
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
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};

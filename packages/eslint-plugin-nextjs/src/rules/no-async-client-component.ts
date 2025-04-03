import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

const name = "no-async-client-component";
const url = `https://nextjs.org/docs/messages/${name}`;
const description = "Prevent client components from being async functions.";

const isCapitalized = (str: string): boolean => /[A-Z]/.test(str[0] ?? "");

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noAsyncClientComponent";

/**
 * Rule to prevent client components from being async functions
 */
export const noAsyncClientComponent = createRule<Options, MessageId>({
  create: (context) => ({
    Program: (node: TSESTree.Program) => {
      let isClientComponent = false;

      for (const block of node.body) {
        if (
          block.type === AST_NODE_TYPES.ExpressionStatement &&
          block.expression.type === AST_NODE_TYPES.Literal &&
          block.expression.value === "use client"
        ) {
          isClientComponent = true;
        }

        if (
          block.type === AST_NODE_TYPES.ExportDefaultDeclaration &&
          isClientComponent
        ) {
          // export default async function MyComponent() {...}
          if (
            block.declaration.type === AST_NODE_TYPES.FunctionDeclaration &&
            block.declaration.async &&
            block.declaration.id &&
            isCapitalized(block.declaration.id.name)
          ) {
            context.report({
              data: { url },
              messageId: "noAsyncClientComponent",
              node: block,
            });
          }

          // async function MyComponent() {...}; export default MyComponent;
          if (
            block.declaration.type === AST_NODE_TYPES.Identifier &&
            isCapitalized(block.declaration.name)
          ) {
            const targetName = block.declaration.name;

            const functionDeclaration = node.body.find((localBlock) => {
              if (
                localBlock.type === AST_NODE_TYPES.FunctionDeclaration &&
                localBlock.id.name === targetName
              ) {
                return true;
              }

              if (
                localBlock.type === AST_NODE_TYPES.VariableDeclaration &&
                localBlock.declarations.find(
                  (declaration) =>
                    declaration.id.type === AST_NODE_TYPES.Identifier &&
                    declaration.id.name === targetName,
                )
              ) {
                return true;
              }

              return false;
            });

            if (
              functionDeclaration?.type ===
                AST_NODE_TYPES.FunctionDeclaration &&
              functionDeclaration.async
            ) {
              context.report({
                data: { url },
                messageId: "noAsyncClientComponent",
                node: functionDeclaration,
              });
            }

            if (
              functionDeclaration?.type === AST_NODE_TYPES.VariableDeclaration
            ) {
              const varDeclarator = functionDeclaration.declarations.find(
                (declaration) =>
                  declaration.id.type === AST_NODE_TYPES.Identifier &&
                  declaration.id.name === targetName,
              );

              if (
                varDeclarator?.init?.type ===
                  AST_NODE_TYPES.ArrowFunctionExpression &&
                varDeclarator.init.async
              ) {
                context.report({
                  data: { url },
                  messageId: "noAsyncClientComponent",
                  node: functionDeclaration,
                });
              }
            }
          }
        }
      }
    },
  }),

  defaultOptions: [],
  meta: {
    docs: {
      description,
      recommended: true,
      url,
    },
    messages: {
      noAsyncClientComponent:
        "Prevent client components from being async functions. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});

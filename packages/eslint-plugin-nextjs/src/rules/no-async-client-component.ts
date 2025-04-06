import type { RuleDefinition } from "@eslint/core";

const name = "no-async-client-component";
const url = `https://nextjs.org/docs/messages/${name}`;
const description = "Prevent client components from being async functions.";

const isCapitalized = (str: string): boolean => /[A-Z]/.test(str[0] ?? "");

type MessageId = "noAsyncClientComponent";

/**
 * Rule to prevent client components from being async functions
 */
export const noAsyncClientComponent: RuleDefinition = {
  create: (context) => ({
    Program: (node) => {
      let isClientComponent = false;

      for (const block of node.body) {
        if (
          block.type === "ExpressionStatement" &&
          block.expression.type === "Literal" &&
          block.expression.value === "use client"
        ) {
          isClientComponent = true;
        }

        if (block.type === "ExportDefaultDeclaration" && isClientComponent) {
          // export default async function MyComponent() {...}
          if (
            block.declaration.type === "FunctionDeclaration" &&
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
            block.declaration.type === "Identifier" &&
            isCapitalized(block.declaration.name)
          ) {
            const targetName = block.declaration.name;

            const functionDeclaration = node.body.find((localBlock: any) => {
              if (
                localBlock.type === "FunctionDeclaration" &&
                localBlock.id.name === targetName
              ) {
                return true;
              }

              if (
                localBlock.type === "VariableDeclaration" &&
                localBlock.declarations.find(
                  (declaration: any) =>
                    declaration.id.type === "Identifier" &&
                    declaration.id.name === targetName,
                )
              ) {
                return true;
              }

              return false;
            });

            if (
              functionDeclaration?.type === "FunctionDeclaration" &&
              functionDeclaration.async
            ) {
              context.report({
                data: { url },
                messageId: "noAsyncClientComponent",
                node: functionDeclaration,
              });
            }

            if (functionDeclaration?.type === "VariableDeclaration") {
              const varDeclarator = functionDeclaration.declarations.find(
                (declaration: any) =>
                  declaration.id.type === "Identifier" &&
                  declaration.id.name === targetName,
              );

              if (
                varDeclarator?.init?.type === "ArrowFunctionExpression" &&
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
  meta: {
    docs: {
      description,
      recommended: true,
      url,
    },
    messages: {
      noAsyncClientComponent:
        "Prevent client components from being async functions. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

const name = "no-assign-module-variable";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noAssignModule";

/**
 * Rule to prevent assignment to the module variable
 */
export const noAssignModuleVariable = createRule<Options, MessageId>({
  create: (context) => ({
    VariableDeclaration: (node: TSESTree.VariableDeclaration) => {
      // Checks node.declarations array for variable with id.name of `module`
      const moduleVariableFound = node.declarations.some((declaration) => {
        if (
          declaration.id.type === AST_NODE_TYPES.Identifier &&
          declaration.id.name === "module"
        ) {
          return true;
        }
        return false;
      });

      // Return early if no `module` variable is found
      if (!moduleVariableFound) {
        return;
      }

      context.report({
        data: { url },
        messageId: "noAssignModule",
        node,
      });
    },
  }),

  defaultOptions: [],
  meta: {
    docs: {
      description: "Prevent assignment to the `module` variable.",
      recommended: true,
      url,
    },
    messages: {
      noAssignModule: "Do not assign to the variable `module`. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});

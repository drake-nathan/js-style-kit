import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import * as path from "node:path";

const NEXT_EXPORT_FUNCTIONS = [
  "getStaticProps",
  "getStaticPaths",
  "getServerSideProps",
];

// 0 is the exact match
const THRESHOLD = 1;

const name = "no-typos";
const url = `https://nextjs.org/docs/messages/${name}`;

// the minimum number of operations required to convert string a to string b.
const minDistance = (a: string, b: string): number | undefined => {
  const m = a.length;
  const n = b.length;

  if (m < n) {
    return minDistance(b, a);
  }

  if (n === 0) {
    return m;
  }

  let previousRow = Array.from({ length: n + 1 }, (_, i) => i);

  for (let i = 0; i < m; i++) {
    const s1 = a[i];
    // Initialize with first value
    const currentRow: number[] = [i + 1];
    for (let j = 0; j < n; j++) {
      const s2 = b[j];
      // These values are guaranteed to exist because of how we initialize and build the arrays
      const insertions = (previousRow[j + 1] ?? Infinity) + 1;
      const deletions = (currentRow[j] ?? Infinity) + 1;
      const substitutions = (previousRow[j] ?? Infinity) + Number(s1 !== s2);
      currentRow.push(Math.min(insertions, deletions, substitutions));
    }
    previousRow = currentRow;
  }
  return previousRow[previousRow.length - 1];
};

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noTypos";

/**
 * Rule to prevent common typos in Next.js data fetching functions
 */
export const noTypos = createRule<Options, MessageId>({
  create: (context) => {
    const checkTypos = (node: TSESTree.Node, functionName: string) => {
      if (NEXT_EXPORT_FUNCTIONS.includes(functionName)) {
        return;
      }

      const potentialTypos = NEXT_EXPORT_FUNCTIONS.map((o) => ({
        distance: minDistance(o, functionName) ?? Infinity,
        option: o,
      }))
        .filter(({ distance }) => distance <= THRESHOLD && distance > 0)
        .sort((a, b) => a.distance - b.distance);

      if (potentialTypos.length) {
        context.report({
          data: { functionName, suggestion: potentialTypos[0]?.option },
          messageId: "noTypos",
          node,
        });
      }
    };
    return {
      ExportNamedDeclaration: (node: TSESTree.ExportNamedDeclaration) => {
        const page = context.filename.split("pages", 2)[1];
        if (!page || path.parse(page).dir.startsWith("/api")) {
          return;
        }

        const decl = node.declaration;

        if (!decl) {
          return;
        }

        switch (decl.type) {
          case AST_NODE_TYPES.FunctionDeclaration: {
            if (decl.id) {
              checkTypos(node, decl.id.name);
            }
            break;
          }
          case AST_NODE_TYPES.VariableDeclaration: {
            decl.declarations.forEach((d) => {
              if (d.id.type === AST_NODE_TYPES.Identifier) {
                checkTypos(node, d.id.name);
              }
            });
            break;
          }
          default: {
            break;
          }
        }
      },
    };
  },

  defaultOptions: [],
  meta: {
    docs: {
      description: "Prevent common typos in Next.js data fetching functions.",
      recommended: true,
      url,
    },
    messages: {
      noTypos: "{{functionName}} may be a typo. Did you mean {{suggestion}}?",
    },
    schema: [],
    type: "problem",
  },
  name,
});

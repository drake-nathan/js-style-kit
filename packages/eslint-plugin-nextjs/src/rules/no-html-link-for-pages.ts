import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import * as fs from "node:fs";
import * as path from "node:path";

import { getRootDirs } from "../utils/get-root-dirs.js";
import {
  execOnce,
  getUrlFromAppDirectory,
  getUrlFromPagesDirectories,
  normalizeURL,
} from "../utils/url.js";

const pagesDirWarning = execOnce((pagesDirs) => {
  console.warn(
    `Pages directory cannot be found at ${pagesDirs.join(" or ")}. ` +
      "If using a custom path, please configure with the `no-html-link-for-pages` rule in your eslint config file.",
  );
});

// Cache for fs.existsSync lookup.
// Prevent multiple blocking IO requests that have already been calculated.
const fsExistsSyncCache: Record<string, boolean> = {};

// Properly typed memoize function for the specific functions we use
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

const memoize = <F extends AnyFunction>(fn: F): F => {
  const cache = new Map<string, ReturnType<F>>();

  const memoized = (...args: Parameters<F>): ReturnType<F> => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    // We know the key exists because we just set it if it didn't
    const value = cache.get(key);
    // This cast is safe because we know the key exists
    return value as ReturnType<F>;
  };

  return memoized as F;
};

const cachedGetUrlFromPagesDirectories = memoize(getUrlFromPagesDirectories);
const cachedGetUrlFromAppDirectory = memoize(getUrlFromAppDirectory);

const name = "no-html-link-for-pages";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Category of the rule
   */
  category: string;
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [string | string[] | undefined];
type MessageId = "noHtmlLinkForPages";

/**
 * Rule to prevent usage of <a> elements to navigate to internal Next.js pages
 */
export const noHtmlLinkForPages = createRule<Options, MessageId>({
  /**
   * Creates an ESLint rule listener.
   */
  create: (context) => {
    const [customPagesDirectory] = context.options;

    // @ts-expect-error this is a discrepancy between tseslint and eslint, nbd
    const rootDirs = getRootDirs(context);

    const pagesDirs = (
      customPagesDirectory ?
        [customPagesDirectory]
      : rootDirs.map((dir) => [
          path.join(dir, "pages"),
          path.join(dir, "src", "pages"),
        ])).flat();

    const foundPagesDirs = pagesDirs.filter((dir) => {
      fsExistsSyncCache[dir] ??= fs.existsSync(dir);
      return fsExistsSyncCache[dir];
    });

    const appDirs = rootDirs
      .map((dir) => [path.join(dir, "app"), path.join(dir, "src", "app")])
      .flat();

    const foundAppDirs = appDirs.filter((dir) => {
      fsExistsSyncCache[dir] ??= fs.existsSync(dir);
      return fsExistsSyncCache[dir];
    });

    // warn if there are no pages and app directories
    if (foundPagesDirs.length === 0 && foundAppDirs.length === 0) {
      pagesDirWarning(pagesDirs);
      return {};
    }

    const pageUrls = cachedGetUrlFromPagesDirectories("/", foundPagesDirs);
    const appDirUrls = cachedGetUrlFromAppDirectory("/", foundAppDirs);
    const allUrlRegex = [...pageUrls, ...appDirUrls];

    return {
      JSXOpeningElement: (node: TSESTree.JSXOpeningElement) => {
        if (
          node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.name.name !== "a"
        ) {
          return;
        }

        if (node.attributes.length === 0) {
          return;
        }

        const target = node.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === AST_NODE_TYPES.JSXAttribute &&
            attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
            attr.name.name === "target",
        );

        if (
          target?.value?.type === AST_NODE_TYPES.Literal &&
          target.value.value === "_blank"
        ) {
          return;
        }

        const href = node.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === AST_NODE_TYPES.JSXAttribute &&
            attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
            attr.name.name === "href",
        );

        if (!href?.value || href.value.type !== AST_NODE_TYPES.Literal) {
          return;
        }

        const hasDownloadAttr = node.attributes.find(
          (attr): attr is TSESTree.JSXAttribute =>
            attr.type === AST_NODE_TYPES.JSXAttribute &&
            attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
            attr.name.name === "download",
        );

        if (hasDownloadAttr) {
          return;
        }

        // We've already checked that href.value exists and is a Literal
        const hrefPath = normalizeURL(href.value.value as string);
        // Outgoing links are ignored

        if (/^(?<temp1>https?:\/\/|\/\/)/.test(hrefPath as string)) {
          return;
        }

        allUrlRegex.forEach((foundUrl) => {
          if (hrefPath && foundUrl.test(normalizeURL(hrefPath) as string)) {
            context.report({
              data: { hrefPath, url },
              messageId: "noHtmlLinkForPages",
              node,
            });
          }
        });
      },
    };
  },

  defaultOptions: [undefined],
  meta: {
    docs: {
      category: "HTML",
      description:
        "Prevent usage of `<a>` elements to navigate to internal Next.js pages.",
      recommended: true,
      url,
    },
    messages: {
      noHtmlLinkForPages:
        "Do not use an `<a>` element to navigate to `{{hrefPath}}`. Use `<Link />` from `next/link` instead. See: {{url}}",
    },
    schema: [
      {
        oneOf: [
          {
            type: "string",
          },
          {
            items: {
              type: "string",
            },
            type: "array",
            uniqueItems: true,
          },
        ],
      },
    ],
    type: "problem",
  },
  name,
});

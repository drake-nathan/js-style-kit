import * as fs from "node:fs";
import * as path from "node:path";

import { defineRule } from "../utils/define-rule.js";
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

const memoize = <T = any>(fn: (...args: any[]) => T) => {
  const cache: Record<string, T> = {};
  return (...args: any[]): T => {
    const key = JSON.stringify(args);
    cache[key] ??= fn(...args);
    return cache[key];
  };
};

const cachedGetUrlFromPagesDirectories = memoize(getUrlFromPagesDirectories);
const cachedGetUrlFromAppDirectory = memoize(getUrlFromAppDirectory);

const url = "https://nextjs.org/docs/messages/no-html-link-for-pages";

export const noHtmlLinkForPages = defineRule({
  /**
   * Creates an ESLint rule listener.
   */
  create: (context) => {
    // @ts-expect-error initial override, TODO: fix
    const ruleOptions: (string | string[])[] = context.options;
    const [customPagesDirectory] = ruleOptions;

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
      JSXOpeningElement: (node: any) => {
        if (node.name.name !== "a") {
          return;
        }

        if (node.attributes.length === 0) {
          return;
        }

        const target = node.attributes.find(
          (attr: any) =>
            attr.type === "JSXAttribute" && attr.name.name === "target",
        );

        if (target && target.value.value === "_blank") {
          return;
        }

        const href = node.attributes.find(
          (attr: any) =>
            attr.type === "JSXAttribute" && attr.name.name === "href",
        );

        if (!href || (href.value && href.value.type !== "Literal")) {
          return;
        }

        const hasDownloadAttr = node.attributes.find(
          (attr: any) =>
            attr.type === "JSXAttribute" && attr.name.name === "download",
        );

        if (hasDownloadAttr) {
          return;
        }

        const hrefPath = normalizeURL(href.value.value);
        // Outgoing links are ignored

        if (/^(?<temp1>https?:\/\/|\/\/)/.test(hrefPath as string)) {
          return;
        }

        allUrlRegex.forEach((foundUrl) => {
          if (hrefPath && foundUrl.test(normalizeURL(hrefPath) as string)) {
            context.report({
              message: `Do not use an \`<a>\` element to navigate to \`${hrefPath}\`. Use \`<Link />\` from \`next/link\` instead. See: ${url}`,
              node,
            });
          }
        });
      },
    };
  },

  meta: {
    docs: {
      category: "HTML",
      description:
        "Prevent usage of `<a>` elements to navigate to internal Next.js pages.",
      recommended: true,
      url,
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
});

import * as fs from "node:fs";
import * as path from "node:path";

// Cache for fs.readdirSync lookup.
// Prevent multiple blocking IO requests that have already been calculated.
const fsReadDirSyncCache: Record<string, fs.Dirent[]> = {};

/**
 * Recursively parse directory for page URLs.
 */
const parseUrlForPages = (urlprefix: string, directory: string) => {
  fsReadDirSyncCache[directory] ??= fs.readdirSync(directory, {
    withFileTypes: true,
  });
  const res: string[] = [];
  fsReadDirSyncCache[directory].forEach((dirent) => {
    // TODO: this should account for all page extensions
    // not just js(x) and ts(x)
    if (/(?<temp2>\.(?<temp1>j|t)sx?)$/.test(dirent.name)) {
      if (/^index(?<temp2>\.(?<temp1>j|t)sx?)$/.test(dirent.name)) {
        res.push(
          `${urlprefix}${dirent.name.replace(/^index(?<temp2>\.(?<temp1>j|t)sx?)$/, "")}`,
        );
      }
      res.push(
        `${urlprefix}${dirent.name.replace(/(?<temp2>\.(?<temp1>j|t)sx?)$/, "")}`,
      );
    } else {
      const dirPath = path.join(directory, dirent.name);
      if (dirent.isDirectory() && !dirent.isSymbolicLink()) {
        res.push(...parseUrlForPages(`${urlprefix + dirent.name}/`, dirPath));
      }
    }
  });
  return res;
};

/**
 * Recursively parse app directory for URLs.
 */
const parseUrlForAppDir = (urlprefix: string, directory: string) => {
  fsReadDirSyncCache[directory] ??= fs.readdirSync(directory, {
    withFileTypes: true,
  });
  const res: string[] = [];
  fsReadDirSyncCache[directory].forEach((dirent) => {
    // TODO: this should account for all page extensions
    // not just js(x) and ts(x)
    if (/(?<temp2>\.(?<temp1>j|t)sx?)$/.test(dirent.name)) {
      if (/^page(?<temp2>\.(?<temp1>j|t)sx?)$/.test(dirent.name)) {
        res.push(
          `${urlprefix}${dirent.name.replace(/^page(?<temp2>\.(?<temp1>j|t)sx?)$/, "")}`,
        );
      } else if (!/^layout(?<temp2>\.(?<temp1>j|t)sx?)$/.test(dirent.name)) {
        res.push(
          `${urlprefix}${dirent.name.replace(/(?<temp2>\.(?<temp1>j|t)sx?)$/, "")}`,
        );
      }
    } else {
      const dirPath = path.join(directory, dirent.name);
      // @ts-expect-error - types suggest this shouldn't take an arg, but I don't want to change anything
      if (dirent.isDirectory(dirPath) && !dirent.isSymbolicLink()) {
        res.push(...parseUrlForPages(`${urlprefix + dirent.name}/`, dirPath));
      }
    }
  });
  return res;
};

/**
 * Takes a URL and does the following things.
 *  - Replaces `index.html` with `/`
 *  - Makes sure all URLs are have a trailing `/`
 *  - Removes query string
 */
export const normalizeURL = (url: string) => {
  if (!url) {
    return;
  }
  url = url.split("?", 1)[0] as string;
  url = url.split("#", 1)[0] as string;
  url = url.replace(/(?<temp1>\/index\.html)$/, "/");
  // Empty URLs should not be trailed with `/`, e.g. `#heading`
  if (url === "") {
    return url;
  }
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

/**
 * Normalizes an app route so it represents the actual request path. Essentially
 * performing the following transformations:
 *
 * - `/(dashboard)/user/[id]/page` to `/user/[id]`
 * - `/(dashboard)/account/page` to `/account`
 * - `/user/[id]/page` to `/user/[id]`
 * - `/account/page` to `/account`
 * - `/page` to `/`
 * - `/(dashboard)/user/[id]/route` to `/user/[id]`
 * - `/(dashboard)/account/route` to `/account`
 * - `/user/[id]/route` to `/user/[id]`
 * - `/account/route` to `/account`
 * - `/route` to `/`
 * - `/` to `/`
 *
 * @param route the app route to normalize
 * @returns the normalized pathname
 */
export const normalizeAppPath = (route: string) =>
  ensureLeadingSlash(
    route.split("/").reduce((pathname, segment, index, segments) => {
      // Empty segments are ignored.
      if (!segment) {
        return pathname;
      }

      // Groups are ignored.
      if (isGroupSegment(segment)) {
        return pathname;
      }

      // Parallel segments are ignored.
      if (segment.startsWith("@")) {
        return pathname;
      }

      // The last segment (if it's a leaf) should be ignored.
      if (
        (segment === "page" || segment === "route") &&
        index === segments.length - 1
      ) {
        return pathname;
      }

      return `${pathname}/${segment}`;
    }, ""),
  );

/**
 * Gets the possible URLs from a directory.
 */
export const getUrlFromPagesDirectories = (
  urlPrefix: string,
  directories: string[],
) =>
  Array.from(
    // De-duplicate similar pages across multiple directories.
    new Set(
      directories
        .flatMap((directory) => parseUrlForPages(urlPrefix, directory))
        .map(
          // Since the URLs are normalized we add `^` and `$` to the RegExp to make sure they match exactly.
          (url) => `^${normalizeURL(url)}$`,
        ),
    ),
  ).map((urlReg) => {
    urlReg = urlReg.replaceAll(/\[.*]/g, "((?!.+?\\..+?).*?)");
    return new RegExp(urlReg);
  });

export const getUrlFromAppDirectory = (
  urlPrefix: string,
  directories: string[],
) =>
  Array.from(
    // De-duplicate similar pages across multiple directories.
    new Set(
      directories
        .map((directory) => parseUrlForAppDir(urlPrefix, directory))
        .flat()
        .map(
          // Since the URLs are normalized we add `^` and `$` to the RegExp to make sure they match exactly.
          (url) => `^${normalizeAppPath(url)}$`,
        ),
    ),
  ).map((urlReg) => {
    urlReg = urlReg.replaceAll(/\[.*]/g, "((?!.+?\\..+?).*?)");
    return new RegExp(urlReg);
  });

export const execOnce = <TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
): ((...args: TArgs) => TResult) => {
  let used = false;
  let result: TResult;

  return (...args: TArgs) => {
    if (!used) {
      used = true;
      result = fn(...args);
    }
    return result;
  };
};

const ensureLeadingSlash = (route: string) =>
  route.startsWith("/") ? route : `/${route}`;

const isGroupSegment = (segment: string) =>
  segment.startsWith("(") && segment.endsWith(")");

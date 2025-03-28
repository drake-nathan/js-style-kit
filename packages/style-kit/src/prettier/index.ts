import type { Config as PrettierConfig } from "prettier";
import type { SortJsonOptions as SortJsonPluginOptions } from "prettier-plugin-sort-json";
import type { PluginOptions as TailwindPluginOptions } from "prettier-plugin-tailwindcss";

import { isObject, isString } from "../utils/is-type.js";
import { patchTailwindPlugin } from "./patch-tailwind-plugin.js";

export interface PrettierConfigOptions extends PrettierConfig {
  cssOrderPlugin?: boolean;
  curlyPlugin?: boolean;
  jsonSortPlugin?: boolean | SortJsonPluginOptions;
  packageJsonPlugin?: boolean;
  tailwindPlugin?: boolean | string | TailwindPluginOptions;
}

export interface PrettierConfigWithPlugins
  extends PrettierConfig,
    SortJsonPluginOptions,
    TailwindPluginOptions {}

/**
 * Creates a Prettier configuration object with optional Tailwind support
 *
 * @param options - Configuration options for Prettier
 * @param options.cssOrderPlugin CSS order sorting support
 * @param options.curlyPlugin Enforce curly braces for all control statements
 * @param options.jsonSortPlugin JSON sorting support
 * @param options.packageJsonPlugin Package.json sorting support
 * @param options.tailwindPlugin Tailwind CSS formatting support
 * @returns Prettier configuration object with:
 * - Default Prettier configuration
 * - Experimental ternaries enabled
 * - CSS order plugin
 * - Curly braces plugin
 * - JSON sorting plugin
 * - Package.json sorting plugin
 * - Optional Tailwind plugin and functions
 */
export const prettierConfig = (
  options: PrettierConfigOptions = {},
): PrettierConfigWithPlugins => {
  const {
    cssOrderPlugin = true,
    curlyPlugin = true,
    jsonSortPlugin = true,
    packageJsonPlugin = true,
    tailwindPlugin = false,
    ...rest
  } = options;

  const plugins: string[] = [];
  const config: PrettierConfigWithPlugins = {
    experimentalTernaries: true,
    ...rest,
  };

  if (cssOrderPlugin) {
    plugins.push("prettier-plugin-css-order");
  }

  if (curlyPlugin) {
    plugins.push("prettier-plugin-curly");
  }

  if (jsonSortPlugin) {
    plugins.push("prettier-plugin-sort-json");

    if (isObject(jsonSortPlugin)) {
      Object.assign(config, jsonSortPlugin);
    } else {
      config.jsonRecursiveSort = true;
    }
  }

  if (packageJsonPlugin) {
    plugins.push("prettier-plugin-packagejson");
  }

  if (tailwindPlugin) {
    plugins.push("prettier-plugin-tailwindcss");
    const defaultTailwindFunctions = ["clsx", "cva", "cn"];

    if (isString(tailwindPlugin)) {
      // then it's the path to the stylesheet
      config.tailwindStylesheet = tailwindPlugin;
      config.tailwindFunctions = defaultTailwindFunctions;
    } else if (isObject(tailwindPlugin)) {
      Object.assign(config, tailwindPlugin);

      // Ensure defaultTailwindFunctions is applied if tailwindFunctions wasn't specified
      if (!tailwindPlugin.tailwindFunctions) {
        config.tailwindFunctions = defaultTailwindFunctions;
      }
    } else {
      config.tailwindFunctions = defaultTailwindFunctions;
    }

    // Patch the Tailwind plugin declaration file to remove unsafe declare statement
    patchTailwindPlugin();
  }

  // Set plugins after all configurations are done
  config.plugins = plugins;

  return config;
};

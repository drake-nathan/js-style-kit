import type { Config as PrettierConfig } from "prettier";
import type { SortJsonOptions as SortJsonPluginOptions } from "prettier-plugin-sort-json";
import type { PluginOptions as TailwindPluginOptions } from "prettier-plugin-tailwindcss";

interface PrettierConfigOptions extends PrettierConfig {
  jsonSortPlugin?: boolean | SortJsonPluginOptions;
  packageJsonPlugin?: boolean;
  tailwindPlugin?: boolean | string[] | TailwindPluginOptions;
}

export interface PrettierConfigWithPlugins
  extends PrettierConfig,
    SortJsonPluginOptions,
    TailwindPluginOptions {}

/**
 * Creates a Prettier configuration object with optional Tailwind support
 * @param options - Configuration options for Prettier
 * @param options.tailwind Tailwind CSS formatting support
 * @param options.jsonSort JSON sorting support
 * @param options.packageJson Package.json sorting support
 * @returns Prettier configuration object with:
 * - Default Prettier configuration
 * - Experimental ternaries enabled
 * - JSON sorting plugin
 * - Package.json sorting plugin
 * - Optional Tailwind plugin and functions
 */
export const prettierConfig = (
  options: PrettierConfigOptions = {},
): PrettierConfigWithPlugins => {
  const {
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

  if (jsonSortPlugin) {
    plugins.push("prettier-plugin-json-sort");
    config.jsonRecursiveSort = true;
  }

  if (packageJsonPlugin) {
    plugins.push("prettier-plugin-packagejson");
  }

  if (tailwindPlugin) {
    plugins.push("prettier-plugin-tailwindcss");
    const defaultTailwindFunctions = ["clsx", "cva", "cn"];

    if (Array.isArray(tailwindPlugin)) {
      config.tailwindFunctions = [
        ...defaultTailwindFunctions,
        ...tailwindPlugin,
      ];
    } else if (typeof tailwindPlugin === "object") {
      Object.assign(config, tailwindPlugin);
    } else {
      config.tailwindFunctions = defaultTailwindFunctions;
    }
  }

  // Set plugins after all configurations are done
  config.plugins = plugins;

  return config;
};

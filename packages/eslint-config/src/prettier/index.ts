import type { Config } from "prettier";
import type { PluginOptions as TailwindPluginOptions } from "prettier-plugin-tailwindcss";

enum CategorySort {
  CaseInsensitiveLexical = "caseInsensitiveLexical",
  CaseInsensitiveNumeric = "caseInsensitiveNumeric",
  CaseInsensitiveReverseLexical = "caseInsensitiveReverseLexical",
  CaseInsensitiveReverseNumeric = "caseInsensitiveReverseNumeric",
  Lexical = "lexical",
  None = "none",
  Numeric = "numeric",
  ReverseLexical = "reverseLexical",
  ReverseNumeric = "reverseNumeric",
}

interface SortJsonOptions {
  jsonRecursiveSort?: boolean;
  jsonSortOrder?: Record<string, CategorySort | null>;
}

export type PrettierConfigWithTailwind = PrettierConfig & TailwindPluginOptions;
export type PrettierConfig = Config & SortJsonOptions;

interface PrettierConfigOptions {
  tailwind?: boolean;
}

/**
 * Creates a Prettier configuration object with optional Tailwind support
 * @param options - Configuration options for Prettier
 * @param options.tailwind Tailwind CSS formatting support
 * @returns Prettier configuration object with:
 * - Default Prettier configuration
 * - Experimental ternaries enabled
 * - JSON sorting plugin
 * - Package.json sorting plugin
 * - Optional Tailwind plugin and functions
 */
export const prettierConfig = (
  options: PrettierConfigOptions = {},
): PrettierConfigWithTailwind => {
  const { tailwind = false } = options;

  const plugins = ["prettier-plugin-sort-json", "prettier-plugin-packagejson"];

  const config: PrettierConfigWithTailwind = {
    experimentalTernaries: true,
    jsonRecursiveSort: true,
    plugins,
  };

  if (tailwind) {
    plugins.push("prettier-plugin-tailwindcss");
    config.tailwindFunctions = ["clsx", "cva", "cn"];
  }

  return config;
};

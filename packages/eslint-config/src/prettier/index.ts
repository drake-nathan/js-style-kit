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

export const prettierConfig = ({
  tailwind,
}: PrettierConfigOptions = {}): PrettierConfigWithTailwind => {
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

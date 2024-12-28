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

export type PrettierConfigWithTailwind = PrettierConfig & TailwindPluginOptions;
export type PrettierConfig = Config & SortJsonOptions;

interface SortJsonOptions {
  jsonRecursiveSort?: boolean;
  jsonSortOrder?: Record<string, CategorySort | null>;
}

export const prettier = {
  experimentalTernaries: true,
  jsonRecursiveSort: true,
  plugins: ["prettier-plugin-sort-json", "prettier-plugin-packagejson"],
} satisfies PrettierConfig;

export const prettierWithTailwind = {
  ...prettier,
  plugins: [...prettier.plugins, "prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cva", "cn"],
} satisfies PrettierConfigWithTailwind;

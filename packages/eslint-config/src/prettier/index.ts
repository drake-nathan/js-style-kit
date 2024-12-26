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

export type PrettierConfig = Config & SortJsonOptions;

export type PrettierConfigWithTailwind = PrettierConfig & TailwindPluginOptions;

export const prettier = {
  experimentalTernaries: true,
  jsonRecursiveSort: true,
  plugins: ["prettier-plugin-sort-json", "prettier-plugin-packagejson"],
} satisfies PrettierConfig;

export const prettierTailwind = {
  ...prettier,
  plugins: [...prettier.plugins, "prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cva", "cn"],
} satisfies PrettierConfigWithTailwind;

import tailwindEslint from "eslint-plugin-tailwindcss";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";

type TailwindRules = Record<`tailwindcss/${string}`, EslintRuleConfig>;

export const tailwindConfig: EslintConfigObject = {
  name: configNames.tailwind,
  plugins: {
    tailwind: tailwindEslint,
  },
  rules: {
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/enforces-negative-arbitrary-values": "warn",
    "tailwindcss/enforces-shorthand": "warn",
    "tailwindcss/no-contradicting-classname": "warn",
    "tailwindcss/no-custom-classname": "warn",
    "tailwindcss/no-unnecessary-arbitrary-value": "warn",
  } satisfies TailwindRules,
};

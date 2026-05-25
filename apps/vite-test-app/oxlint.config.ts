import { styleKit } from "js-style-kit";

const { oxlint } = styleKit({
  react: { framework: "vite" },
});

export default {
  ...oxlint,
  rules: {
    ...oxlint.rules,
    "unicorn/filename-case": [
      "error",
      { cases: { camelCase: true, pascalCase: true } },
    ],
  },
};

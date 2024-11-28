/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  experimentalTernaries: true,
  jsonRecursiveSort: true,
  plugins: [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-sort-json",
    "prettier-plugin-packagejson",
  ],
  tailwindFunctions: ["clsx", "cva", "cn"],
};

export default config;

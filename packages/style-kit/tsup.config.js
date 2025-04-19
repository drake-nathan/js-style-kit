import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entryPoints: ["src/index.ts"],
    external: [
      // Node built-ins
      "path",
      "fs",
      "os",
      "tty",
      "util",
      "stream",
      "process",
      "net",
      // Dependencies that should be resolved at runtime
      "eslint",
      "globals",
      "typescript-eslint",
      "@typescript-eslint/parser",
      "eslint-plugin-import-x", // Add the new plugin
      "debug",
      "typescript",
      // Match common plugin patterns
      /^eslint-plugin-/,
      /^@typescript-eslint\//,
      // prettier stuff
      "prettier",
      /^prettier-plugin-/,
    ],
    format: ["esm"],
    outDir: "dist",
    platform: "node",
    sourcemap: true,
    splitting: false,
  },
  {
    banner: {
      js: "#!/usr/bin/env node",
    },
    clean: false,
    dts: false,
    entryPoints: ["bin/index.ts"],
    format: ["esm"],
    noExternal: ["commander"],
    outDir: "dist/bin",
    sourcemap: true,
    splitting: false,
  },
]);

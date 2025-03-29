import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entryPoints: ["src/**/*", "!src/**/*.test.ts"],
    format: ["esm"],
    outDir: "dist",
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

import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entryPoints: ["src/**/*"],
    format: ["esm"],
    outDir: "dist",
    sourcemap: true,
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
  },
  {
    clean: false,
    dts: false,
    entryPoints: ["scripts/postinstall.js"],
    format: ["esm"],
    outDir: "dist/scripts",
    sourcemap: true,
  },
]);

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
      "fast-glob",
    ],
    format: ["esm"],
    outDir: "dist",
    platform: "node",
    sourcemap: true,
    splitting: false,
  },
]);

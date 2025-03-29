import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entryPoints: ["src/**/*", "!src/**/*.test.ts"],
    format: ["esm"],
    outDir: "dist",
    sourcemap: true,
  },
]);

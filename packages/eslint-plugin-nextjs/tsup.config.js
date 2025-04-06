import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    entryPoints: ["src/**/*", "!test/**/*"],
    format: ["esm", "cjs"],
    outDir: "dist",
    sourcemap: true,
    splitting: false,
  },
]);

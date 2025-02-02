import { defineConfig } from "tsup";

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['./api/index.ts'],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true
});

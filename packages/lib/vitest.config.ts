import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    globalSetup: "./setupGlobals.ts",
    setupFiles: ["./setupTests.ts"],
  },
});

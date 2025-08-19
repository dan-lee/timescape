import { defineConfig, devices } from "@playwright/test";

const TEST_PORT = Number(process.env.TEST_PORT) || 61782;

// See https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: `http://localhost:${TEST_PORT}/integrations.html`,
    trace: "on-first-retry",
    timezoneId: "UTC",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: `pnpm vite --port ${TEST_PORT}`,
    port: TEST_PORT,
    reuseExistingServer: !process.env.CI,
  },
});

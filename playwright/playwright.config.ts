import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  /* Run tests in files in the order they are defined. */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only. */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.VUE_APP_BASE_URL || 'http://localhost:8088/',

    // Custom environment variables for your tests
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8089/',
    VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL || 'http://localhost:8088/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
});

import { defineConfig, devices } from "@playwright/test";

/**
 * Release matrix.
 *
 * The site leans on native `<dialog>`, `:has()`, container queries, `dvh`/`svh`,
 * scroll snapping and scripted focus/scroll — precisely the features that differ
 * between engines. Chromium alone was never evidence that any of it worked, so
 * current Safari, iOS Safari and Firefox run the same suite.
 *
 * Browsers: `npx playwright install`
 * One engine while iterating: `npm run test:e2e -- --project=desktop`
 */
export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results/playwright",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: "http://localhost:3100",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { browserName: "chromium", viewport: { width: 1440, height: 1000 } },
    },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "firefox",
      use: { browserName: "firefox", viewport: { width: 1280, height: 900 } },
    },
    {
      name: "safari",
      use: { browserName: "webkit", viewport: { width: 1280, height: 900 } },
    },
    {
      // iOS Safari is the riskiest surface for dvh/svh and dialog focus.
      name: "ios",
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: {
    // The release matrix runs against the release artifact. The dev server
    // recompiles per route and re-optimises every image on demand, which turns
    // a 20-plate gallery into a timeout that says nothing about the build.
    command: "npm run build && npm run start -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});

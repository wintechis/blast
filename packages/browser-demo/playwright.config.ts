import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // gamble.xml's randomized loop and requests.xml's third-party calls can
  // comfortably run past Playwright's 30s default.
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  // The dev server serves public/assets/blast/*.js and public/assets/tds/*.json
  // straight from the committed prebuilt copies, so plain `vite` is enough -
  // no `bun run build` / copy-blast / copy-tds needed first.
  webServer: {
    command: 'bun run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

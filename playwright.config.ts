import { defineConfig, devices } from '@playwright/test'

const webURL = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
const apiURL = process.env.API_BASE_URL || 'http://127.0.0.1:3333'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: webURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'api', testMatch: '**/api/**/*.spec.ts', use: { baseURL: apiURL } },
    { name: 'audit', testMatch: '**/audit/**/*.spec.ts', use: { baseURL: apiURL } },
    { name: 'chromium', testMatch: '**/e2e/**/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
  ],
})

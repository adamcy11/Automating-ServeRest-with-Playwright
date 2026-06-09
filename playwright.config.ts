import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'api-setup',
      testDir: './support',
      testMatch: /global-setup\.ts/,
    },
    {
      name: 'api',
      testDir: './tests/api',
      dependencies: ['api-setup'],
      teardown: 'api-teardown',
    },
    {
      name: 'api-teardown',
      testDir: './support',
      testMatch: /global-teardown\.ts/,
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL ?? 'https://front.serverest.dev',
      },
    },
  ],
})

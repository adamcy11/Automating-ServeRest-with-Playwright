import { test as base, type Page } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage.js'
import { HomePage } from '../../pages/HomePage.js'

type UiFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<UiFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page)
    const home = new HomePage(page)

    await login.open()
    await login.login(process.env.UI_ADMIN_EMAIL!, process.env.UI_ADMIN_PASSWORD!)
    await home.checkHomePage()

    await use(page)
  },
})

export { expect } from '@playwright/test'

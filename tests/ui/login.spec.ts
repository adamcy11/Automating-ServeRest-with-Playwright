import { test, expect } from '../../support/fixtures/ui.fixture.js'
import { LoginPage } from '../../pages/LoginPage.js'
import { HomePage } from '../../pages/HomePage.js'
import { loginData } from '../../support/data/credentials.js'

test.describe('Login', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const homePage = new HomePage(page)

    await loginPage.open()
    await loginPage.login(process.env.UI_ADMIN_EMAIL!, process.env.UI_ADMIN_PASSWORD!)

    await homePage.checkHomePage()
  })

  test('should logout successfully', async ({ authenticatedPage }) => {
    const homePage = new HomePage(authenticatedPage)

    await homePage.logout()

    await expect(authenticatedPage).toHaveURL(/login/)
  })

  test('should show error when email is empty', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.open()
    await loginPage.login('', process.env.UI_ADMIN_PASSWORD!)

    await loginPage.checkEmailBlankError()
  })

  test('should show error when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.open()
    await loginPage.login(process.env.UI_ADMIN_EMAIL!, '')

    await loginPage.checkPasswordBlankError()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.open()
    await loginPage.login(loginData.invalidCredentials.email, loginData.invalidCredentials.password)

    await loginPage.checkInvalidCredentialsError()
  })
})

import { expect, type Page, type Locator } from '@playwright/test'
import { LOGIN_MESSAGES } from '../support/constants/messages.js'

export class LoginPage {
  private readonly emailField: Locator
  private readonly passwordField: Locator
  private readonly submitButton: Locator
  private readonly alerts: Locator

  constructor(private page: Page) {
    this.emailField = page.getByTestId('email')
    this.passwordField = page.getByTestId('senha')
    this.submitButton = page.getByTestId('entrar')
    this.alerts = page.getByRole('alert').locator('span:not([aria-hidden])')
  }

  async open() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailField.clear()
    await this.passwordField.clear()
    await this.emailField.fill(email)
    await this.passwordField.fill(password)
    await this.submitButton.click()
  }

  async checkEmailBlankError() {
    await expect(this.alerts.first()).toHaveText(LOGIN_MESSAGES.EMAIL_BLANK)
  }

  async checkPasswordBlankError() {
    await expect(this.alerts.first()).toHaveText(LOGIN_MESSAGES.PASSWORD_BLANK)
  }

  async checkInvalidCredentialsError() {
    await expect(this.alerts.first()).toHaveText(LOGIN_MESSAGES.INVALID_CREDENTIALS)
  }
}

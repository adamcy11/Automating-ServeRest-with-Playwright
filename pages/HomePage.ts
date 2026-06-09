import { expect, type Page, type Locator } from '@playwright/test'

export class HomePage {
  private readonly logoutButton: Locator

  constructor(private page: Page) {
    this.logoutButton = page.getByTestId('logout')
  }

  async checkHomePage() {
    await expect(this.page).toHaveURL(/admin\/home/)
  }

  async logout() {
    await this.logoutButton.click()
  }
}
import { expect, type Page, type Locator } from '@playwright/test'

export class HomePage {
  private readonly logoutButton: Locator
  private readonly addProductButton: Locator

  constructor(private page: Page) {
    this.logoutButton = page.getByTestId('logout')
    this.addProductButton = page.getByTestId('cadastrarProdutos')
  }

  async checkHomePage() {
    await expect(this.page).toHaveURL(/admin\/home/)
  }

  async accessAddProductPage() {
    await this.addProductButton.click()
  }

  async logout() {
    await this.logoutButton.click()
  }
}

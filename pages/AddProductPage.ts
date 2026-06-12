import { expect, type Page, type Locator } from '@playwright/test'
import type { Product } from '../support/types/serverest.types.js'
import { PRODUCT_MESSAGES } from '../support/constants/messages.js'

export class AddProductPage {
  private readonly nameField: Locator
  private readonly priceField: Locator
  private readonly descriptionField: Locator
  private readonly quantityField: Locator
  private readonly submitButton: Locator
  private readonly alerts: Locator

  constructor(private page: Page) {
    this.nameField = page.getByTestId('nome')
    this.priceField = page.getByTestId('preco')
    this.descriptionField = page.getByTestId('descricao')
    this.quantityField = page.getByTestId('quantity')
    this.submitButton = page.getByTestId('cadastarProdutos')
    this.alerts = page.getByRole('alert').locator('span:not([aria-hidden])')
  }

  private async clearAndFill(field: Locator, value: string) {
    await field.clear()
    await field.fill(value)
  }

  async checkAddProductPage() {
    await expect(this.page).toHaveURL(/admin\/cadastrarprodutos/)
  }

  async addProduct(product: Product) {
    await this.clearAndFill(this.nameField, product.nome)
    await this.clearAndFill(this.priceField, String(product.preco))
    await this.clearAndFill(this.descriptionField, product.descricao)
    await this.clearAndFill(this.quantityField, String(product.quantidade))
  }

  async saveForm() {
    await this.submitButton.click()
  }

  async checkNameBlankError() {
    await expect(this.alerts.first()).toHaveText(PRODUCT_MESSAGES.NAME_BLANK)
  }

  async checkPriceBlankError() {
    await expect(this.alerts.first()).toHaveText(PRODUCT_MESSAGES.PRICE_BLANK)
  }

  async checkDescriptionBlankError() {
    await expect(this.alerts.first()).toHaveText(PRODUCT_MESSAGES.DESCRIPTION_BLANK)
  }

  async checkQuantityBlankError() {
    await expect(this.alerts.first()).toHaveText(PRODUCT_MESSAGES.QUANTITY_BLANK)
  }

  async checkPriceNegativeError() {
    await expect(this.alerts.first()).toHaveText(PRODUCT_MESSAGES.PRICE_NEGATIVE)
  }

  async checkQuantityNegativeError() {
    await expect(this.alerts.first()).toHaveText(PRODUCT_MESSAGES.QUANTITY_NEGATIVE)
  }
}

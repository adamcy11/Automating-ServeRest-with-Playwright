import { test } from '../../support/fixtures/ui.fixture.js'
import { buildProduct } from '../../support/data/products.js'
import { AddProductPage } from '../../pages/AddProductPage.js'
import { HomePage } from '../../pages/HomePage.js'

test.describe('Product', () => {
  test('Should register the product successfully', async ({ authenticatedPage }) => {
    const homePage = new HomePage(authenticatedPage)
    const addProductPage = new AddProductPage(authenticatedPage)
    const product = buildProduct()

    await homePage.accessAddProductPage()
    await addProductPage.checkAddProductPage()
    await addProductPage.addProduct(product)
    await addProductPage.saveForm()
  })
})

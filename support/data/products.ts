import { faker } from '@faker-js/faker'
import type { Product } from '../types/serverest.types.js'

export function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    nome: faker.commerce.productName(),
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
    ...overrides,
  }
}

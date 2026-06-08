import type { Product } from '../types/serverest.types.js'

export function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    nome: `Test Product ${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    preco: 100,
    descricao: 'Product created for automated testing',
    quantidade: 10,
    ...overrides,
  }
}
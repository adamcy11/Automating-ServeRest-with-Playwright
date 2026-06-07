import type { User } from '../types/serverest.types.js'

export function buildUser(overrides: Partial<User> = {}): User {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 1000)}`

  return {
    nome: 'Test User',
    email: `test.user.${unique}@example.com`,
    password: 'password123',
    administrador: 'false',
    ...overrides,
  }
}
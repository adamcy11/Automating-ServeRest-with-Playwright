import { faker } from '@faker-js/faker'
import type { User } from '../types/serverest.types.js'

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 }),
    administrador: 'false',
    ...overrides,
  }
}

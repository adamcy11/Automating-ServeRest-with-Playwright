import { test as base, request, expect, type APIRequestContext } from '@playwright/test'

import type { LoginResponse } from '../types/serverest.types.js'

type AuthFixtures = {
  apiAsAdmin: APIRequestContext
}

export const test = base.extend<AuthFixtures>({
  apiAsAdmin: async ({ baseURL }, use) => {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env or environment')
    }

    const loginContext = await request.newContext({ baseURL })
    const loginRes = await loginContext.post('/login', { data: { email, password } })

    expect(loginRes.ok(), 'Admin login failed during fixture setup').toBeTruthy()

    const { authorization }: LoginResponse = await loginRes.json()
    await loginContext.dispose()

    const api = await request.newContext({
      baseURL,
      extraHTTPHeaders: { Authorization: authorization },
    })

    await use(api)

    await api.dispose()
  },
})

export { expect } from '@playwright/test'
import { test as teardown, request } from '@playwright/test'
import { readFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { AUTH_FILE } from './helpers/auth-file.js'
import type { LoginResponse } from './types/serverest.types.js'

teardown('delete admin user', async () => {
  const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password || !existsSync(AUTH_FILE)) return

  const { id } = JSON.parse(await readFile(AUTH_FILE, 'utf-8'))
  const api = await request.newContext({ baseURL })

  try {
    const loginRes = await api.post('/login', { data: { email, password } })
    const { authorization }: LoginResponse = await loginRes.json()

    await api.delete(`/usuarios/${id}`, {
      headers: { Authorization: authorization },
    })
  } finally {
    await api.dispose()
    await rm(AUTH_FILE)
  }
})

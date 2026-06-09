import { test as setup, request } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import type { CreateUserResponse, ListUsersResponse } from './types/serverest.types.js'
import { AUTH_FILE } from './helpers/auth-file.js'

setup('create admin user', async () => {
  const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env or environment')
  }

  const api = await request.newContext({ baseURL })

  const createRes = await api.post('/usuarios', {
    data: { nome: 'Admin QA', email, password, administrador: 'true' },
  })

  let userId: string

  if (createRes.ok()) {
    const body: CreateUserResponse = await createRes.json()
    userId = body._id
  } else {
    const listRes = await api.get('/usuarios', { params: { email } })
    const body: ListUsersResponse = await listRes.json()

    if (!body.usuarios?.length) {
      throw new Error(`Admin user not found and could not be created: ${email}`)
    }

    userId = body.usuarios[0]._id
  }

  await mkdir(AUTH_FILE.replace('admin.json', ''), { recursive: true })
  await writeFile(AUTH_FILE, JSON.stringify({ id: userId }))

  await api.dispose()
})

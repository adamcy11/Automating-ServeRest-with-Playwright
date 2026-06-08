import { test, expect } from '../../support/fixtures/auth.fixture.js'
import { buildUser } from '../../support/data/user.js'
import type { CreateUserResponse, ListUsersResponse } from '../../support/types/serverest.types.js'

test.describe('POST /usuarios', () => {
  test('should create a user successfully with valid data', async ({ apiAsAdmin }) => {
    const newUser = buildUser()

    const response = await apiAsAdmin.post('/usuarios', { data: newUser })
    const body: CreateUserResponse = await response.json()

    expect(response.status()).toBe(201)
    expect(body).toHaveProperty('_id')
    expect(body.message).toBe('Cadastro realizado com sucesso')
  })

  test('should not create a user with an email that already exists', async ({ apiAsAdmin }) => {
    const existingUser = buildUser()
    await apiAsAdmin.post('/usuarios', { data: existingUser })

    const duplicateUser = buildUser({ email: existingUser.email })
    const response = await apiAsAdmin.post('/usuarios', { data: duplicateUser })
    const body = await response.json()

    expect(response.status(), 'API should enforce email uniqueness across users').toBe(400)
    expect(body.message).toBe('Este email já está sendo usado')
  })

  test('should not create a user when required fields are missing', async ({ apiAsAdmin }) => {
    const response = await apiAsAdmin.post('/usuarios', { data: {} })
    const body = await response.json()

    expect(response.status(), 'API should reject payloads missing required fields').toBe(400)
    expect(body.nome).toBe('nome é obrigatório')
    expect(body.email).toBe('email é obrigatório')
    expect(body.password).toBe('password é obrigatório')
    expect(body.administrador).toBe('administrador é obrigatório')
  })
})

test.describe('GET /usuarios', () => {
  test('should list all users', async ({ apiAsAdmin }) => {
    const response = await apiAsAdmin.get('/usuarios')
    const body: ListUsersResponse = await response.json()

    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('quantidade')
    expect(Array.isArray(body.usuarios)).toBe(true)
  })

  test('should get a user by id', async ({ apiAsAdmin }) => {
    const newUser = buildUser()
    const createResponse = await apiAsAdmin.post('/usuarios', { data: newUser })
    const created: CreateUserResponse = await createResponse.json()

    const response = await apiAsAdmin.get(`/usuarios/${created._id}`)
    const body = await response.json()

    expect(response.status()).toBe(200)
    expect(body.nome, 'Name should match creation data').toBe(newUser.nome)
    expect(body.email, 'Email should match creation data').toBe(newUser.email)
    expect(body.administrador, 'Administrator flag should be preserved').toBe(newUser.administrador)
  })

  test('should return a validation error when id has invalid format', async ({ apiAsAdmin }) => {
    const response = await apiAsAdmin.get('/usuarios/idNotExist123')
    const body = await response.json()

    expect(response.status(), 'API should reject malformed ids').toBe(400)
    expect(body.id).toBe('id deve ter exatamente 16 caracteres alfanuméricos')
  })

  test('should return an error when user id does not exist', async ({ apiAsAdmin }) => {
    const response = await apiAsAdmin.get('/usuarios/1234567890abcdef')
    const body = await response.json()

    expect(response.status(), 'API should return error for non-existent id').toBe(400)
    expect(body.message).toBe('Usuário não encontrado')
  })

  test('should filter users by email query param', async ({ apiAsAdmin }) => {
    const newUser = buildUser()
    await apiAsAdmin.post('/usuarios', { data: newUser })

    const response = await apiAsAdmin.get(`/usuarios?email=${newUser.email}`)
    const body: ListUsersResponse = await response.json()

    expect(response.status()).toBe(200)
    expect(body.usuarios, 'Filtering by email should return exactly one result').toHaveLength(1)
    expect(body.usuarios[0].email).toBe(newUser.email)
  })
})

test.describe('PUT /usuarios/{id}', () => {
  test('should update an existing user successfully', async ({ apiAsAdmin }) => {
    const newUser = buildUser()
    const createResponse = await apiAsAdmin.post('/usuarios', { data: newUser })
    const created: CreateUserResponse = await createResponse.json()

    const updatedData = buildUser()
    const response = await apiAsAdmin.put(`/usuarios/${created._id}`, { data: updatedData })
    const body = await response.json()

    expect(response.status()).toBe(200)
    expect(body.message).toBe('Registro alterado com sucesso')

    const getResponse = await apiAsAdmin.get(`/usuarios/${created._id}`)
    const updatedUser = await getResponse.json()

    expect(updatedUser.nome, 'Updated name should be persisted').toBe(updatedData.nome)
    expect(updatedUser.email, 'Updated email should be persisted').toBe(updatedData.email)
    expect(updatedUser.administrador, 'Admin flag should persist').toBe(updatedData.administrador)
  })

  test('should upsert when id does not exist', async ({ apiAsAdmin }) => {
    const newUser = buildUser()
    const response = await apiAsAdmin.put('/usuarios/1234567890abcdef', { data: newUser })
    const body = await response.json()

    expect(response.status()).toBe(201)
    expect(body.message).toBe('Cadastro realizado com sucesso')
  })

  test('should not update to an already used email', async ({ apiAsAdmin }) => {
    const userA = buildUser()
    await apiAsAdmin.post('/usuarios', { data: userA })

    const userB = buildUser()
    const createResponseB = await apiAsAdmin.post('/usuarios', { data: userB })
    const createdB: CreateUserResponse = await createResponseB.json()

    const response = await apiAsAdmin.put(`/usuarios/${createdB._id}`, {
      data: { ...userB, email: userA.email },
    })
    const body = await response.json()

    expect(response.status()).toBe(400)
    expect(body.message).toBe('Este email já está sendo usado')
  })
})

test.describe('DELETE /usuarios/{id}', () => {
  test('should delete an existing user successfully', async ({ apiAsAdmin }) => {
    const newUser = buildUser()
    const createResponse = await apiAsAdmin.post('/usuarios', { data: newUser })
    const created: CreateUserResponse = await createResponse.json()

    const response = await apiAsAdmin.delete(`/usuarios/${created._id}`)
    const body = await response.json()

    expect(response.status()).toBe(200)
    expect(body.message).toBe('Registro excluído com sucesso')

    const getResponse = await apiAsAdmin.get(`/usuarios/${created._id}`)
    expect(getResponse.status()).toBe(400)
  })

  test('should return success when deleting a non-existent user id', async ({ apiAsAdmin }) => {
    const response = await apiAsAdmin.delete('/usuarios/abcdef1234567890')
    const body = await response.json()

    expect(response.status(), 'API should return 200 even for non-existent ids').toBe(200)
    expect(body.message).toBe('Nenhum registro excluído')
  })
})

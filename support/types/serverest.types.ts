export interface CreateUserResponse {
  _id: string
  message: string
}

export interface ListUsersResponse {
  quantidade: number
  usuarios: Array<{ _id: string; nome: string; email: string }>
}

export interface LoginResponse {
  authorization: string
  message: string
}
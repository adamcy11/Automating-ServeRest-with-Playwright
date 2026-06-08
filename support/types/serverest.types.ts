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

export interface Product {
  nome: string
  preco: number
  descricao: string
  quantidade: number
}

export interface User {
  nome: string
  email: string
  password: string
  administrador: string
}

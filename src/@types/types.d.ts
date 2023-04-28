export type User = {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: Date | string
  role: string
}

export type UserCreateInput = {
  id?: string
  name: string
  email: string
  password_hash: string
  created_at?: Date | string
  role?: string
}

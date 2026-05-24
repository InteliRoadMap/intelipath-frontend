export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "student" | "mentor" | "admin"
}

export interface RegisterPayload {
  email: string
  password: string
  fullName: string
}

export interface LoginPayload {
  email: string
  password: string
}
export interface LoginResponse {
  status: number
  message: string
  token: string
}

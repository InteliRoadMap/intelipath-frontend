import api from "../api/StoreApi"

type LoginResponse = {
  status: number
  message: string
  data: {
    accessToken: string
    userId: string
    email: string
    fullName: string
    role: string
  }
}

type RegisterData = {
  fullName: string
  email: string
  password: string
}

// Authentication service to handle login, registration, and logout
export const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/auth/login", {
    // Send the email and password to the backend API for authentication
    email,
    password
  })
  // Store the access token in localStorage for future authenticated requests
  localStorage.setItem("accessToken", response.data.data.accessToken)
  return response.data
}
// Registration function to create a new user account
export const register = async (data: RegisterData) => {
  try {
    const response = await api.post("/auth/register", data) // Send the registration data to the backend API
    return response.data
  } catch (error: any) {
    console.error(
      "Register error:",
      error.response?.status,
      error.response?.data
    )
    throw error
  }
}
// Logout function to clear the access token from localStorage
export const logout = () => {
  localStorage.removeItem("accessToken")
}
// Export the authService object containing the authentication functions
const authService = {
  login,
  register,
  logout
}
export default authService

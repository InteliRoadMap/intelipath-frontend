import axiosClient from "../api/StoreApi"
import { API_ENDPOINTS } from "../api/endpoints"
import type { LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth"
import { removeToken } from "./TokenService"
// Login function that sends a POST request to the login endpoint with the provided payload
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN, // Endpoint for login
    payload // Payload containing email and password
  )

  return response.data
}
// Register function that sends a POST request to the register endpoint with the provided payload
export const register = async (
  payload: RegisterPayload // Payload containing full name, email, and password for registration
): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.REGISTER, // Endpoint for register
    payload // Payload containing user registration details
  )

  return response.data
}
// Logout function that removes the access token from local storage
export const logout = () => {
  removeToken()
}

const authService = {
  login,
  register,
  logout
}

export default authService

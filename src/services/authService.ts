import axiosClient from "../api/StoreApi"
import { API_ENDPOINTS } from "../api/endpoints"
import type { LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth"
// Login function that sends a POST request to the login endpoint with the provided payload
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    payload
  )

  return response.data
}
// Register function that sends a POST request to the register endpoint with the provided payload
export const register = async (
  payload: RegisterPayload
): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    payload
  )

  return response.data
}
// Logout function that removes the access token from local storage
export const logout = () => {
  localStorage.removeItem("accessToken")
}

const authService = {
  login,
  register,
  logout
}

export default authService

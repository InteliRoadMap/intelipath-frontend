import { publicClient, mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const authApi = {
  login: async (email: string, password: string) => {
    return await publicClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
  },

  register: async (data: { email: string; password: string; fullName: string }) => {
    return await publicClient.post(ENDPOINTS.AUTH.REGISTER, data)
  },

  forgotPassword: async (email: string) => {
    return await publicClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    return await publicClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, data)
  },

  refreshToken: async (refreshToken: string) => {
    return await publicClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken })
  },

  logout: async () => {
    return await mainClient.post(ENDPOINTS.AUTH.LOGOUT)
  }
}

export default authApi

import { publicClient, mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Authentication API Service
 * Handles user authentication flows: Login, Register, Password Reset.
 */
const authApi = {
  //[POST] Login
  login: async (email: string, password: string) => {
    try {
      console.log("[authApi.login] Đang đăng nhập với email:", email)
      return await publicClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
    } catch (error) {
      console.error("[authApi.login] Lỗi đăng nhập:", error)
      throw error
    }
  },

  //[POST] Register
  register: async (data: { email: string; password: string; fullName: string }) => {
    try {
      console.log("[authApi.register] Đang đăng ký tài khoản:", {
        email: data.email,
        fullName: data.fullName,
        password: "••••••••"
      })
      return await publicClient.post(ENDPOINTS.AUTH.REGISTER, data)
    } catch (error) {
      console.error("[authApi.register] Lỗi đăng ký:", error)
      throw error
    }
  },

  //[POST] Forgot Password
  forgotPassword: async (email: string) => {
    try {
      console.log("[authApi.forgotPassword] Gửi OTP reset password đến:", email)
      return await publicClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    } catch (error) {
      console.error("[authApi.forgotPassword] Lỗi forgot password:", error)
      throw error
    }
  },

  //[POST] Reset Password
  resetPassword: async (data: {
    email: string
    otp: string
    newPassword: string
  }) => {
    try {
      console.log("[authApi.resetPassword] Reset password cho:", data.email)
      return await publicClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword
      })
    } catch (error) {
      console.error("[authApi.resetPassword] Lỗi reset password:", error)
      throw error
    }
  },

  //[POST] Refresh Token
  refreshToken: async (refreshToken: string) => {
    try {
      console.log("[authApi.refreshToken] Đang làm mới token...")
      return await publicClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken })
    } catch (error) {
      console.error("[authApi.refreshToken] Lỗi làm mới token:", error)
      throw error
    }
  },

  //[POST] Logout
  logout: async () => {
    try {
      console.log("[authApi.logout] Đang đăng xuất...")
      return await mainClient.post(ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error("[authApi.logout] Lỗi đăng xuất:", error)
      throw error
    }
  }
}

export default authApi

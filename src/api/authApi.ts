import { publicClient, mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Authentication API Service
 * Handles user authentication flows: Login, Register, Password Reset.
 */
const authApi = {
  //[POST] Login
  login: (email: string, password: string) => {
    console.log("[authApi.login] Đang đăng nhập với email:", email)
    return publicClient.post(ENDPOINTS.AUTH.LOGIN, { email, password })
  },

  //[POST] Register
  register: (data: { email: string; password: string; fullName: string }) => {
    console.log("[authApi.register] Đang đăng ký tài khoản:", {
      email: data.email,
      fullName: data.fullName,
      password: "••••••••"
    })
    return publicClient.post(ENDPOINTS.AUTH.REGISTER, data)
  },

  //[POST] Forgot Password
  // Backend sends an OTP to the user's email
  forgotPassword: (email: string) => {
    console.log("[authApi.forgotPassword] Gửi OTP reset password đến:", email)
    return publicClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  },

  //[POST] Reset Password
  resetPassword: (data: {
    email: string
    otp: string
    newPassword: string
  }) => {
    console.log("[authApi.resetPassword] Reset password cho:", data.email)
    return publicClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword
    })
  },

  //[POST] Logout
  // Uses mainClient because logging out usually requires the authorization token
  logout: () => {
    console.log("[authApi.logout] Đang đăng xuất...")
    return mainClient.post(ENDPOINTS.AUTH.LOGOUT)
  }
}

export default authApi

import axiosInstance from './axiosInstance'

const authApi = {

  // ── POST /api/v1/auth/login ────────────────────────────────────────────
  login: (email: string, password: string) => {
    console.log('🔐 [authApi.login] Đang đăng nhập với email:', email)
    return axiosInstance.post('/auth/login', { email, password })
  },

  // ── POST /api/v1/auth/register ────────────────────────────────────────
  // Body JSON: { email, password, fullName }
  register: (data: { email: string; password: string; fullName: string }) => {
    console.log('📝 [authApi.register] Đang đăng ký tài khoản:', {
      email:    data.email,
      fullName: data.fullName,
      password: '••••••••'
    })
    return axiosInstance.post('/auth/register', data)
  },

  // ── POST /api/v1/auth/forgot-password ─────────────────────────────────
  // Body JSON: { email }
  // Backend gửi OTP về email của user
  forgotPassword: (email: string) => {
    console.log('📧 [authApi.forgotPassword] Gửi OTP reset password đến:', email)
    return axiosInstance.post('/auth/forgot-password', { email })
  },

  // ── POST /api/v1/auth/reset-password ──────────────────────────────────
  // Body JSON: { email, otp, newPassword }
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => {
    console.log('🔑 [authApi.resetPassword] Reset password cho:', data.email)
    return axiosInstance.post('/auth/reset-password', {
      email:       data.email,
      otp:         data.otp,
      newPassword: data.newPassword
    })
  },

  // ── POST /api/v1/auth/logout ───────────────────────────────────────────
  logout: () => {
    console.log('🚪 [authApi.logout] Đang đăng xuất...')
    return axiosInstance.post('/auth/logout')
  },

}

export default authApi

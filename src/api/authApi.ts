import axiosInstance from './axiosInstance'

const authApi = {

  // ── POST /api/v1/auth/login ────────────────────────────────────────────
  login: (email: string, password: string) => {
    console.log(' [authApi.login] Đang đăng nhập với email:', email)
    return axiosInstance.post('/auth/login', { email, password })
  },

  // ── POST /api/v1/auth/register
  // Body JSON: { email, password, fullName }
  register: (data: { email: string; password: string; fullName: string }) => {
    console.log(' [authApi.register] Đang đăng ký tài khoản:', {
      email:    data.email,
      fullName: data.fullName,
      password: '••••••••'   // ẩn password khi log
    })
    return axiosInstance.post('/auth/register', data)
  },

  // ── POST /api/v1/auth/logout ───────────────────────────────────────────
  logout: () => {
    console.log(' [authApi.logout] Đang đăng xuất...')
    return axiosInstance.post('/auth/logout')
  },

  // ── POST /api/v1/auth/refresh ─────────────────────────────────────────
  // (Commented out — session-based auth không cần refresh token)
  /*
  refreshToken: (refreshToken: string) => {
    console.log('🔄 [authApi.refreshToken] Refreshing access token...')
    return axiosInstance.post('/auth/refresh', { refreshToken })
  },
  */
}

export default authApi

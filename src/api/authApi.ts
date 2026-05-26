import axiosInstance from './axiosInstance'

const authApi = {
  // POST /api/v1/auth/login
  login: (email, password) => {
    return axiosInstance.post('/auth/login', { email, password })
  },

  // POST /api/v1/auth/register
  register: (data) => {
    return axiosInstance.post('/auth/register', data)
  },

  // POST /api/v1/auth/refresh (Commented out for session-based auth)
  /*
  refreshToken: (refreshToken) => {
    return axiosInstance.post('/auth/refresh', { refreshToken })
  },
  */

  // POST /api/v1/auth/logout
  logout: () => {
    return axiosInstance.post('/auth/logout')
  }
}

export default authApi

import axios from "axios"
import { getToken } from "../services/TokenService"

// Create an Axios instance with default configuration
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})
// Add a request interceptor to include the access token in headers
axiosClient.interceptors.request.use((config) => {
  const token = getToken()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosClient

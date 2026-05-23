import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080"
console.log(import.meta.env.VITE_API_URL)
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json"
  }
})

api.interceptors.request.use((config) => {
  // Gắn token cho các endpoint cần auth
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api

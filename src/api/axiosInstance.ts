import axios from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Gửi cookie (nếu có) cùng request để hỗ trợ authentication/session
  headers: {
    "Content-Type": "application/json"
  }
})

// ─────────────────────────────────────────────
// REQUEST interceptor — log mọi request gửi đi
// ─────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    console.group(
      ` [API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    )
    console.log("Headers :", config.headers)
    if (config.data) {
      // Ẩn password khi log để bảo mật
      const safeData = { ...config.data }
      if (safeData.password) safeData.password = "••••••••"
      if (safeData.confirmPassword) safeData.confirmPassword = "••••••••"
      console.log("Body    :", safeData)
    }
    console.groupEnd()
    return config
  },
  (error) => {
    console.error(" [API REQUEST ERROR]", error)
    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────
// RESPONSE interceptor — log response hoặc lỗi
// ─────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    console.group(
      `%c [API RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      "color: #10b981; font-weight: bold"
    )
    console.log("Status  :", response.status, response.statusText)
    console.log("Data    :", response.data)
    console.groupEnd()
    return response
  },
  (error) => {
    const res = error.response
    if (res) {
      console.group(
        `%c [API ERROR] ${res.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        "color: #ef4444; font-weight: bold"
      )
      console.log("Status  :", res.status, res.statusText)
      console.log("Message :", res.data?.message || res.data)
      console.log("Full    :", res.data)
      console.groupEnd()
    } else {
      // Network error / server không phản hồi
      console.group(
        "%c [API ERROR] Network / No Response",
        "color: #ef4444; font-weight: bold"
      )
      console.log("Error   :", error.message)
      console.log(
        "Hint    :",
        "Kiểm tra server đang chạy và BASE_URL đúng:",
        import.meta.env.VITE_API_BASE_URL ||
          "(fallback) http://localhost:8080/api/v1"
      )
      console.groupEnd()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

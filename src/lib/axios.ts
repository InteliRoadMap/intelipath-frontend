import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig
} from "axios"

// ============ Types ============
export interface ApiClientConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
  getToken?: () => string | null
  getRefreshToken?: () => string | null
  onUnauthorized?: (error?: AxiosError) => void
  onForbidden?: (error?: AxiosError) => void
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// ============ Config & State ============
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"

let isRefreshing = false

interface FailedQueueItem {
  resolve: (token: string | null) => void
  reject: (error: AxiosError | null) => void
}

let failedQueue: FailedQueueItem[] = []

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// ============ Auth Helpers (Default) ============
export const getStoredToken = () => localStorage.getItem("accessToken")
const defaultGetRefreshToken = () => localStorage.getItem("refreshToken")

export const handleUnauthorized = (error?: AxiosError) => {
  if (error) {
    console.error("[AUTH ERROR] Session Expired / Unauthorized", {
      url: error.config?.url,
      status: error.response?.status
    })
  }

  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("user")

  // We check window to avoid redirect loops
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/login")
  ) {
    window.location.href = "/login"
  }
}

// ============ Factory Function ============
export function createApiClient({
  baseURL = API_BASE_URL,
  timeout = 300000,
  headers = {},
  withCredentials = true,
  getToken = getStoredToken,
  getRefreshToken = defaultGetRefreshToken,
  onUnauthorized = handleUnauthorized,
  onForbidden
}: ApiClientConfig = {}): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout,
    withCredentials,
    headers: { "Content-Type": "application/json", ...headers }
  })

  // 1. Request Interceptor: Attach Token & Beautiful Logging
  // Api request interceptor to log requests and attach auth token
  client.interceptors.request.use(
    (config) => {
      // --- LOGGING ---
      console.group(
        `[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      )
      console.log("Headers :", config.headers)
      if (config.data) {
        // Hide password in logs for security
        const safeData = { ...config.data }
        if (safeData.password) safeData.password = "••••••••"
        if (safeData.confirmPassword) safeData.confirmPassword = "••••••••"
        console.log("Body    :", safeData)
      }
      console.groupEnd()

      // --- ATTACH TOKEN ---
      const token = getToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      console.error(" [API REQUEST ERROR]", error)
      return Promise.reject(error)
    }
  )

  // 2. Response Interceptor: Handle Errors & Refresh Token & Beautiful Logging
  client.interceptors.response.use(
    (response) => {
      // --- SUCCESS LOGGING ---
      console.group(
        `%c [API RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
        "color: #10b981; font-weight: bold"
      )
      console.log("Status  :", response.status, response.statusText)
      console.log("Data    :", response.data)
      console.groupEnd()

      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig
      const res = error.response
      const status = res?.status

      // --- ERROR LOGGING ---
      if (res) {
        console.group(
          `%c [API ERROR] ${res.status} ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
          "color: #ef4444; font-weight: bold"
        )
        console.log("Status  :", res.status, res.statusText)
        console.log("Message :", (res.data as any)?.message || res.data)
        console.log("Full    :", res.data)
        console.groupEnd()
      } else {
        console.group(
          "%c [API ERROR] Network / No Response",
          "color: #ef4444; font-weight: bold"
        )
        console.log("Error   :", error.message)
        console.log("Hint    :", "Check if backend is running at:", baseURL)
        console.groupEnd()
      }

      // --- 403 Forbidden ---
      if (status === 403) {
        if (onForbidden) {
          onForbidden(error)
        } else {
          onUnauthorized(error)
        }
        return Promise.reject(error)
      }
      //Refresh token when access token expired (401 Unauthorized)
      // --- 401 Unauthorized (Token Expiry & Refresh Logic) ---
      if (status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return client(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = getRefreshToken()
          // Use a fresh axios instance to avoid infinite interceptor loops
          const refreshResponse = await axios.post(
            `${baseURL}/auth/refresh-token`,
            {
              refreshToken
            }
          )

          const { accessToken } = refreshResponse.data

          if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
            }
            processQueue(null, accessToken)
            return client(originalRequest)
          } else {
            throw new Error("No access token returned from refresh endpoint.")
          }
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null)
          onUnauthorized(refreshError as AxiosError)
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )

  return client
}

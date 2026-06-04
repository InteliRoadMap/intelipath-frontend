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
    if (import.meta.env.DEV) {
      console.group("[AUTH REFRESH] Sending refresh token to backend")
      console.log("endpoint:", ENDPOINTS.AUTH.REFRESH_TOKEN)
      console.log("refreshToken:", refreshToken)
      console.groupEnd()
    }

    const response = await publicClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken })

    if (!response.data?.accessToken) {
      const contentType = response.headers["content-type"]
      const receivedHtml =
        typeof response.data === "string" &&
        response.data.trimStart().toLowerCase().startsWith("<!doctype html")

      console.error("[AUTH REFRESH] Invalid backend response", {
        endpoint: ENDPOINTS.AUTH.REFRESH_TOKEN,
        contentType,
        receivedHtml,
        hint: receivedHtml
          ? "Backend redirected /auth/refresh to /login. Permit the refresh endpoint in SecurityConfig."
          : "Backend response must contain accessToken."
      })

      throw new Error("Backend did not return a new access token.")
    }

    return response
  },

  logout: async () => {
    return await mainClient.post(ENDPOINTS.AUTH.LOGOUT)
  }
}

export default authApi

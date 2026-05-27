import {
  API_BASE_URL,
  createApiClient,
  getStoredToken,
  handleUnauthorized
} from "../lib/axios"

/**
 * Public Auth Client
 * - For APIs that do not require authentication (Login, Register, Forgot Password, etc.)
 * - No token attached.
 * Does not trigger infinite redirects on unauthorized errors.
 */
export const publicClient = createApiClient({
  baseURL: API_BASE_URL,
  getToken: () => null, // Explicitly return null so no token is attached
  onUnauthorized: () => {} // Do nothing on 401 for public endpoints
})

/**
 * Main Authenticated Client
 * - For protected APIs that require authentication.
 * - Automatically attaches Bearer Token.
 * - Handles token refresh automatically on 401.
 * - Redirects to /login if token refresh fails.
 */
export const mainClient = createApiClient({
  baseURL: API_BASE_URL,
  getToken: getStoredToken,
  onUnauthorized: handleUnauthorized
})

// Why cannot use axios client togheter?
//ex: using const axiosClient = axios.create(...) and interceptor always attach token: Authorization: Bearer {token}
// Problem: When user not login 'getStoredToken()' return null, if interceptor not handled carefully [attach token empty,trigger refresh token,infinite loop redirect login]
// => solution: create 2 clients: 'publicClient' for public endpoints (login, register, forgot password) and 'mainClient' for protected endpoints (dashboard, user profile, etc.) to avoid token issues and infinite redirect loops on unauthorized errors.

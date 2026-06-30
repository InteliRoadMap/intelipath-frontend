import { createContext, useContext, useReducer, useEffect, useRef } from "react"
import authApi from "@/features/auth/api/authApi"
import { userApi } from "@/api"
import { User, AuthState } from "@/features/auth"
import { jwtDecode } from "jwt-decode"

interface LoginTokens {
  accessToken: string
  refreshToken: string | null
  expiresIn?: string
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (responseData: LoginTokens) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updatedFields: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true
}

type AuthAction =
  | {
      type: "LOGIN"
      payload: { user: User; accessToken: string; refreshToken: string | null }
    }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "UPDATE_TOKENS"
      payload: { accessToken: string; refreshToken: string | null }
    }
  | { type: "UPDATE_USER"; payload: { user: User } }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      }
    case "UPDATE_TOKENS":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload.user
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const refreshTimerRef = useRef<number | null>(null)

  const clearStoredAuth = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("tokenExpiresIn")
    localStorage.removeItem("user")
  }

  const getExpirationTime = (
    accessToken: string,
    expiresIn?: string | null
  ) => {
    if (expiresIn) {
      const parsedExpiration = new Date(expiresIn).getTime()
      if (Number.isFinite(parsedExpiration)) return parsedExpiration
    }

    try {
      const decoded = jwtDecode<{ exp?: number }>(accessToken)
      return decoded.exp ? decoded.exp * 1000 : null
    } catch {
      return null
    }
  }

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }

  const setupRefreshTimer = (
    currentAccessToken: string,
    currentRefreshToken: string,
    expiresIn?: string | null
  ) => {
    clearRefreshTimer()
    const expireTime = getExpirationTime(currentAccessToken, expiresIn)
    if (!expireTime || !currentRefreshToken) {
      if (import.meta.env.DEV) {
        console.warn("[AUTH REFRESH] Cannot schedule refresh", {
          hasExpirationTime: Boolean(expireTime),
          hasRefreshToken: Boolean(currentRefreshToken)
        })
      }
      return
    }

    try {
      const currentTime = new Date().getTime()
      let timeUntilRefresh = expireTime - currentTime - 30_000
      if (timeUntilRefresh <= 0) {
        timeUntilRefresh = 0
      }

      if (import.meta.env.DEV) {
        console.group("[AUTH REFRESH] Refresh scheduled")
        console.log("refreshToken:", currentRefreshToken)
        console.log("accessTokenExpiresAt:", new Date(expireTime).toISOString())
        console.log(
          "refreshAt:",
          new Date(currentTime + timeUntilRefresh).toISOString()
        )
        console.log("refreshInSeconds:", Math.round(timeUntilRefresh / 1000))
        console.groupEnd()
      }

      refreshTimerRef.current = window.setTimeout(async () => {
        try {
          const response = await authApi.refreshToken(currentRefreshToken)
          const {
            accessToken,
            refreshToken: rotatedRefreshToken,
            expiresIn: nextExpiresIn
          } = response.data
          const nextRefreshToken = rotatedRefreshToken || currentRefreshToken

          if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", nextRefreshToken)
            if (nextExpiresIn) {
              localStorage.setItem("tokenExpiresIn", nextExpiresIn)
            }
            dispatch({
              type: "UPDATE_TOKENS",
              payload: { accessToken, refreshToken: nextRefreshToken }
            })
            setupRefreshTimer(accessToken, nextRefreshToken, nextExpiresIn)
          }
        } catch (error) {
          console.error("[Auth] Token refresh failed:", error)
          logout()
        }
      }, timeUntilRefresh)
    } catch (e) {
      console.error("[Auth] Failed to schedule token refresh:", e)
    }
  }

  useEffect(() => {
    let active = true

    const restoreSession = async () => {
      const storedToken = localStorage.getItem("accessToken")
      const storedUser = localStorage.getItem("user")
      const storedRefreshToken = localStorage.getItem("refreshToken")
      const storedExpiresIn = localStorage.getItem("tokenExpiresIn")

      if (!storedToken || !storedUser) {
        dispatch({ type: "SET_LOADING", payload: false })
        return
      }

      try {
        const profileRes = await userApi.getMe()
        let userInfo = profileRes.data?.data || profileRes.data

        try {
          const decoded: any = jwtDecode(storedToken)
          if (decoded && decoded.role && !userInfo.role) {
            userInfo = { ...userInfo, role: decoded.role }
          }
        } catch {
          // ignore decode errors
        }

        localStorage.setItem("user", JSON.stringify(userInfo))

        if (active) {
          dispatch({
            type: "LOGIN",
            payload: {
              user: userInfo,
              accessToken: storedToken,
              refreshToken: storedRefreshToken
            }
          })
          if (storedRefreshToken) {
            setupRefreshTimer(storedToken, storedRefreshToken, storedExpiresIn)
          }
        }
      } catch {
        // Token expired or invalid - clear and force re-login
        clearStoredAuth()
        if (active) {
          dispatch({ type: "SET_LOADING", payload: false })
        }
      }
    }

    void restoreSession()

    return () => {
      active = false
      clearRefreshTimer()
    }
  }, [])

  const login = async (responseData: LoginTokens) => {
    const { accessToken, refreshToken, expiresIn } = responseData

    if (import.meta.env.DEV) {
      console.group("[AUTH SESSION] Tokens received after login")
      console.log("hasAccessToken:", Boolean(accessToken))
      console.log("refreshToken:", refreshToken)
      console.log(
        "accessTokenExpiresAt:",
        getExpirationTime(accessToken, expiresIn)
          ? new Date(getExpirationTime(accessToken, expiresIn)!).toISOString()
          : null
      )
      console.groupEnd()
    }

    localStorage.setItem("accessToken", accessToken)
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
    if (expiresIn) localStorage.setItem("tokenExpiresIn", expiresIn)

    try {
      const profileRes = await userApi.getMe()
      let userInfo = profileRes.data?.data || profileRes.data

      // If the backend doesn't return role, try to extract from token
      try {
        const decoded: any = jwtDecode(accessToken)
        if (decoded && decoded.role && !userInfo.role) {
          userInfo = { ...userInfo, role: decoded.role }
        }
      } catch (e) {
        console.warn("Failed to decode role from token")
      }

      localStorage.setItem("user", JSON.stringify(userInfo))
      dispatch({
        type: "LOGIN",
        payload: { user: userInfo, accessToken, refreshToken }
      })

      if (refreshToken) setupRefreshTimer(accessToken, refreshToken, expiresIn)
    } catch (error) {
      clearStoredAuth()
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout API errors — clear local state regardless
    } finally {
      clearRefreshTimer()
      clearStoredAuth()
      dispatch({ type: "LOGOUT" })
    }
  }

  const updateUser = (updatedFields: Partial<User>) => {
    if (!state.user) return
    const updatedUser = { ...state.user, ...updatedFields }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    dispatch({ type: "UPDATE_USER", payload: { user: updatedUser } })
  }

  const value = {
    ...state,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

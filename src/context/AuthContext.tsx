import { createContext, useContext, useReducer, useEffect, useRef } from "react"
import authApi from "@/api/authApi"
import { userApi } from "@/api"
import { User, AuthState } from "@/features/auth"

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (responseData: {
    accessToken: string
    refreshToken: string | null
    expiresIn?: string
  }) => Promise<void>
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
  | { type: "UPDATE_TOKEN"; payload: { accessToken: string } }
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
    case "UPDATE_TOKEN":
      return {
        ...state,
        accessToken: action.payload.accessToken
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

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }

  const setupRefreshTimer = (
    expiresInStr: string,
    currentRefreshToken: string
  ) => {
    clearRefreshTimer()
    if (!expiresInStr || !currentRefreshToken) return

    try {
      const expireTime = new Date(expiresInStr).getTime()
      const currentTime = new Date().getTime()
      let timeUntilRefresh = expireTime - currentTime - 1000
      if (timeUntilRefresh <= 0) {
        timeUntilRefresh = 0
      }

      refreshTimerRef.current = window.setTimeout(async () => {
        try {
          const response = await authApi.refreshToken(currentRefreshToken)
          const { accessToken, expiresIn } = response.data

          if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
            if (expiresIn) {
              localStorage.setItem("tokenExpiresIn", expiresIn)
            }
            dispatch({ type: "UPDATE_TOKEN", payload: { accessToken } })
            setupRefreshTimer(expiresIn, currentRefreshToken)
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
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    const expiresIn = localStorage.getItem("tokenExpiresIn")
    const user = localStorage.getItem("user")

    if (user && accessToken) {
      try {
        dispatch({
          type: "LOGIN",
          payload: {
            user: JSON.parse(user),
            accessToken,
            refreshToken
          }
        })
        if (expiresIn && refreshToken) {
          setupRefreshTimer(expiresIn, refreshToken)
        }
      } catch {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }

    return () => {
      clearRefreshTimer()
    }
  }, [])

  const login = async (responseData: {
    accessToken: string
    refreshToken: string | null
    expiresIn?: string
  }) => {
    const { accessToken, refreshToken, expiresIn } = responseData

    localStorage.setItem("accessToken", accessToken)
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
    if (expiresIn) localStorage.setItem("tokenExpiresIn", expiresIn)

    try {
      const profileRes = await userApi.getMe()
      const userInfo = profileRes.data

      localStorage.setItem("user", JSON.stringify(userInfo))
      dispatch({
        type: "LOGIN",
        payload: { user: userInfo, accessToken, refreshToken }
      })

      if (expiresIn && refreshToken) {
        setupRefreshTimer(expiresIn, refreshToken)
      }
    } catch (error) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("tokenExpiresIn")
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
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("tokenExpiresIn")
      localStorage.removeItem("user")
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

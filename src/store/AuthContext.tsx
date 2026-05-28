import { createContext, useContext, useReducer, useEffect, useRef } from "react"
import authApi from "../api/authApi"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext<any>(undefined)

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true
}

function authReducer(state: any, action: any) {
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

  const setupRefreshTimer = (expiresInStr: string, currentRefreshToken: string) => {
    clearRefreshTimer()
    if (!expiresInStr || !currentRefreshToken) return

    try {
      // Parse local date time string from API (e.g., "2024-05-28T12:00:00")
      const expireTime = new Date(expiresInStr).getTime()
      const currentTime = new Date().getTime()
      // Refresh 1 minute before expiration
      let timeUntilRefresh = expireTime - currentTime - 1000
      
      if (timeUntilRefresh <= 0) {
        timeUntilRefresh = 0 
      }

      console.log(`[AuthContext] Đặt lịch refresh token sau ${Math.round(timeUntilRefresh / 1000)}s`)

      refreshTimerRef.current = window.setTimeout(async () => {
        try {
          console.log("[AuthContext] Bắt đầu refresh token chủ động...")
          const response = await authApi.refreshToken(currentRefreshToken)
          const { accessToken, expiresIn } = response.data
          
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
            if (expiresIn) {
              localStorage.setItem("tokenExpiresIn", expiresIn)
            }
            dispatch({
              type: "UPDATE_TOKEN",
              payload: { accessToken }
            })
            setupRefreshTimer(expiresIn, currentRefreshToken)
          }
        } catch (error) {
          console.error("[AuthContext] Lỗi khi refresh token:", error)
          // If refresh fails proactively, log out the user
          logout()
        }
      }, timeUntilRefresh)
    } catch (e) {
      console.error("[AuthContext] Lỗi cài đặt timer refresh token:", e)
    }
  }

  // Restore auth state from localStorage on mount
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
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err)
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
    
    return () => {
      clearRefreshTimer()
    }
  }, [])

  const login = (responseData: any, email: string) => {
    const { accessToken, refreshToken, expiresIn, id, fullName, role } = responseData
    const userInfo = { email, id, fullName, role }

    if (accessToken) {
      try {
        const decodedInfo = jwtDecode(accessToken)
        console.log("[JWT Decode] Giải mã Token thành công!")
        console.log(
          "Token này sẽ hết hạn vào lúc:",
          new Date(decodedInfo.exp! * 1000).toLocaleString()
        )
      } catch (err) {
        console.error("Không thể giải mã Token:", err)
      }
    }

    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    if (expiresIn) {
      localStorage.setItem("tokenExpiresIn", expiresIn)
    }
    localStorage.setItem("user", JSON.stringify(userInfo))

    dispatch({
      type: "LOGIN",
      payload: { user: userInfo, accessToken, refreshToken }
    })

    if (expiresIn && refreshToken) {
      setupRefreshTimer(expiresIn, refreshToken)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      clearRefreshTimer()
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("tokenExpiresIn")
      localStorage.removeItem("user")
      dispatch({ type: "LOGOUT" })
    }
  }

  const value = {
    ...state,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

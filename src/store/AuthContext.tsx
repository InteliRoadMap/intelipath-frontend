import { createContext, useContext, useReducer, useEffect } from 'react'
import authApi from '../api/authApi'
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext(undefined)

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const user = localStorage.getItem('user')

    if (user) {
      try {
        dispatch({
          type: 'LOGIN',
          payload: {
            user: JSON.parse(user),
            accessToken,
            refreshToken
          }
        })
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = (responseData, email) => {
    const { accessToken, refreshToken, ...userFields } = responseData
    
    // [DEV TOOL HACK]: Ép kiểu cứng sang MENTOR để test (Bạn có thể xóa dòng này sau khi test xong)
    userFields.role = 'MENTOR'
    
    const userInfo = { ...userFields, email }

    // Sử dụng jwt-decode để bóc tách thông tin token ngay khi đăng nhập
    if (accessToken) {
      try {
        const decodedInfo = jwtDecode(accessToken)
        console.log("🔓 [JWT Decode] Giải mã Token thành công!")
        console.log("🕒 Token này sẽ hết hạn vào lúc:", new Date(decodedInfo.exp * 1000).toLocaleString())
      } catch (err) {
        console.error("Không thể giải mã Token:", err)
      }
    }

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(userInfo))

    dispatch({
      type: 'LOGIN',
      payload: { user: userInfo, accessToken, refreshToken }
    })
  }

  const logout = async () => {
    try {
       const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authApi.logout(refreshToken)
      } else {
        await authApi.logout()
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const value = {
    ...state,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

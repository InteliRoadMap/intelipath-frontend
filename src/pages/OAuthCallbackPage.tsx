import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { RouteProgressBar } from "@/components"
import { useAuth } from "@/context"
import { jwtDecode } from "jwt-decode"
import { ROLES, ROUTES } from "@/shared"
import authApi from "@/features/auth/api/authApi"

type OAuthTokenPayload = {
  role?: string
  exp?: number
}

// Helper to get a cookie value by name
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

// Helper to delete a cookie by name
const deleteCookie = (name: string, path: string = '/') => {
  document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(true)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const handleOAuthCallback = async () => {
      try {
        // 1. Try to read token from URL first (backward compatibility)
        let token = searchParams.get("token")
        
        // 2. If not found in URL, read from cookie "token" set temporarily by backend
        if (!token) {
          token = getCookie("token")
        }

        // 3. If still no token, try fallback: call refresh token endpoint (relying on HttpOnly refreshToken cookie)
        if (!token) {
          if (import.meta.env.DEV) {
            console.log("[OAuth Callback] No token in URL or cookie. Attempting token refresh fallback...")
          }
          try {
            const refreshRes = await authApi.refreshToken()
            token = refreshRes.data?.accessToken
          } catch (refreshErr) {
            if (active) {
              const urlError = searchParams.get("error")
              const errMessage = urlError 
                ? `Login failed: ${urlError}` 
                : "No session token found. Please log in again."
              
              navigate(`${ROUTES.LOGIN}?error=${encodeURIComponent(errMessage)}`, { replace: true })
            }
            return
          }
        }

        if (!token) {
          throw new Error("Unable to retrieve access token.")
        }

        // Decode token to get details
        let decoded: OAuthTokenPayload = {}
        try {
          decoded = jwtDecode<OAuthTokenPayload>(token)
        } catch (e) {
          throw new Error("Invalid access token format.")
        }

        const role = decoded.role
        const expiresIn = decoded.exp
          ? new Date(decoded.exp * 1000).toISOString()
          : undefined

        // Login using retrieved token
        await login({ accessToken: token, refreshToken: null, expiresIn })

        // Clean up temporary "token" cookie
        if (getCookie("token")) {
          deleteCookie("token")
        }

        if (!active) return

        // Redirect based on role
        const userRole = role?.toUpperCase() || ROLES.STUDENT
        if (userRole === ROLES.ADMIN) navigate(ROUTES.DASHBOARD_ADMIN)
        else if (userRole === ROLES.COUNSELOR) navigate(ROUTES.DASHBOARD_COUNSELOR)
        else if (userRole === ROLES.MENTOR) navigate(ROUTES.DASHBOARD_MENTOR)
        else navigate(ROUTES.DASHBOARD_STUDENT)

      } catch (err: any) {
        if (active) {
          console.error("OAuth process error:", err)
          setErrorDetails(err.message || "An unexpected error occurred during login.")
          setIsProcessing(false)
        }
      }
    }

    void handleOAuthCallback()

    return () => {
      active = false
    }
  }, [searchParams, login, navigate])

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50">
        <RouteProgressBar />
      </div>
    )
  }

  if (errorDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-800">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold">OAuth login failed</h1>
          <p className="mt-2 text-sm text-slate-600">{errorDetails}</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="mt-5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return null
}

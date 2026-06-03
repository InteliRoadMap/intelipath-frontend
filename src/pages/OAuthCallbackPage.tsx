import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/context"
import { jwtDecode } from "jwt-decode"
import { ROLES, ROUTES } from "@/shared"

const LOGIN_OAUTH_FAILED = `${ROUTES.LOGIN}?error=oauth_failed`
const LOGIN_NO_TOKEN = `${ROUTES.LOGIN}?error=no_token`

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      setErrorDetails("URL Error: " + error)
      return
    }

    const token = searchParams.get("token")
    const refreshToken = searchParams.get("refreshToken")

    if (!token) {
      setErrorDetails("No token in URL")
      return
    }

    try {
      const decoded = jwtDecode(token) as any
      const role = decoded.role
      const expiresIn = decoded.exp ? new Date(decoded.exp * 1000).toISOString() : undefined

      login({ accessToken: token, refreshToken, expiresIn })
        .then(() => {
          const userRole = role?.toUpperCase() || ROLES.STUDENT
          if (userRole === ROLES.ADMIN) navigate(ROUTES.DASHBOARD_ADMIN)
          else if (userRole === ROLES.COUNSELOR) navigate(ROUTES.DASHBOARD_COUNSELOR)
          else if (userRole === ROLES.MENTOR) navigate(ROUTES.DASHBOARD_MENTOR)
          else navigate(ROUTES.DASHBOARD_STUDENT)
        })
        .catch((err) => {
           console.error("Login Error:", err)
           setErrorDetails("Login failed: " + (err.message || JSON.stringify(err)))
        })
    } catch (err: any) {
      setErrorDetails("Decode failed: " + err.message)
    }
  }, [])

  if (errorDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-rose-400 p-8">
        <h2 className="text-2xl font-bold mb-4">Authentication Error Details</h2>
        <div className="bg-rose-950 p-4 rounded text-left font-mono whitespace-pre-wrap max-w-2xl border border-rose-500">
          {errorDetails}
        </div>
        <button onClick={() => navigate(ROUTES.LOGIN)} className="mt-6 px-4 py-2 bg-rose-600 text-white rounded">Back to Login</button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center
      bg-linear-to-br from-[#0b132b] via-[#0a0f24] to-brand-deep">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="h-10 w-10 animate-spin text-brand-cyan"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-sm text-slate-400">
          Completing sign in...
        </p>
      </div>
    </div>
  )
}

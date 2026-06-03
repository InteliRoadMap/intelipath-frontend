import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/context"
import { jwtDecode } from "jwt-decode"

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      navigate("/login?error=oauth_failed")
      return
    }

    const token = searchParams.get("token")
    const refreshToken = searchParams.get("refreshToken")

    if (!token) {
      navigate("/login?error=no_token")
      return
    }

    try {
      const decoded = jwtDecode(token) as any
      const role = decoded.role
      const expiresIn = decoded.exp ? new Date(decoded.exp * 1000).toISOString() : undefined

      login({ accessToken: token, refreshToken, expiresIn })
        .then(() => {
          const userRole = role?.toUpperCase() || "STUDENT"
          if (userRole === "ADMIN") navigate("/dashboard/admin")
          else if (userRole === "COUNSELOR") navigate("/dashboard/counselor")
          else if (userRole === "MENTOR") navigate("/dashboard/mentor")
          else navigate("/dashboard/student")
        })
        .catch(() => navigate("/login?error=oauth_failed"))
    } catch {
      navigate("/login?error=oauth_failed")
    }
  }, [])

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
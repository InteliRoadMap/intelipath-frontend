import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { RouteProgressBar } from "@/components"
import { useAuth } from "@/context"
import { jwtDecode } from "jwt-decode"
import { ROLES, ROUTES } from "@/shared"

const LOGIN_OAUTH_FAILED = `${ROUTES.LOGIN}?error=oauth_failed`
const LOGIN_NO_TOKEN = `${ROUTES.LOGIN}?error=no_token`

type OAuthTokenPayload = {
  role?: string
  exp?: number
}

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      navigate(LOGIN_OAUTH_FAILED)
      return
    }

    const token = searchParams.get("token")
    const refreshToken = searchParams.get("refreshToken")

    if (!token) {
      navigate(LOGIN_NO_TOKEN)
      return
    }

    try {
      const decoded = jwtDecode<OAuthTokenPayload>(token)
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
        .catch(() => navigate(LOGIN_OAUTH_FAILED))
    } catch {
      navigate(LOGIN_OAUTH_FAILED)
    }
  }, [login, navigate, searchParams])

  return (
    <div className="min-h-screen bg-slate-50">
      <RouteProgressBar />
    </div>
  )
}

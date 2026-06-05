import { useEffect } from "react"
import { LoaderCircle } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
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
      const decoded = jwtDecode<OAuthTokenPayload>(token)
      const role = decoded.role
      const expiresIn = decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : undefined

      login({ accessToken: token, refreshToken, expiresIn })
        .then(() => {
          const userRole = role?.toUpperCase() || ROLES.STUDENT
          if (userRole === ROLES.ADMIN) navigate(ROUTES.DASHBOARD_ADMIN)
          else if (userRole === ROLES.COUNSELOR)
            navigate(ROUTES.DASHBOARD_COUNSELOR)
          else if (userRole === ROLES.MENTOR) navigate(ROUTES.DASHBOARD_MENTOR)
          else navigate(ROUTES.DASHBOARD_STUDENT)
        })
        .catch((err) => {
          console.error("Login Error:", err)
          setErrorDetails(
            "Login failed: " + (err.message || JSON.stringify(err))
          )
        })
    } catch (err: any) {
      setErrorDetails("Decode failed: " + err.message)
    }
  }, [login, navigate, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800">
      <div className="animate-pulse rounded-lg px-4 py-3">
        <div className="flex items-center gap-2 text-lg font-medium">
          <LoaderCircle
            aria-hidden="true"
            className="h-5 w-5 animate-spin text-slate-500"
          />
          <span>Loading</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-slate-500" />
        </div>
      </div>
    </div>
  )
}

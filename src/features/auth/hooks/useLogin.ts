import { useSearchParams } from "react-router-dom"

const API_HOST = (import.meta.env.VITE_API_BASE_URL as string || "http://localhost:8080/api/v1").replace("/api/v1", "")

export function useLogin() {
  const [searchParams] = useSearchParams()
  const errorMsg = searchParams.get("error")

  const handleGoogleLogin = () => {
    window.location.href = `${API_HOST}/oauth2/authorization/google`
  }

  const handleGithubLogin = () => {
    window.location.href = `${API_HOST}/oauth2/authorization/github`
  }

  return {
    errorMsg,
    handleGoogleLogin,
    handleGithubLogin
  }
}

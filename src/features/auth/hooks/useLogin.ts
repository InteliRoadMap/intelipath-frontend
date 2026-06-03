import { useSearchParams } from "react-router-dom"
import { buildOAuthAuthorizationUrl, OAUTH_PROVIDERS } from "@/config/appConfig"

export function useLogin() {
  const [searchParams] = useSearchParams()
  const errorMsg = searchParams.get("error")

  const handleGoogleLogin = () => {
    window.location.href = buildOAuthAuthorizationUrl(OAUTH_PROVIDERS.GOOGLE)
  }

  const handleGithubLogin = () => {
    window.location.href = buildOAuthAuthorizationUrl(OAUTH_PROVIDERS.GITHUB)
  }

  return {
    errorMsg,
    handleGoogleLogin,
    handleGithubLogin
  }
}

import React from "react"
import { useLogin } from "@/features/auth"

const ChromeIcon = () => (
  <svg
    className="h-5 w-5 text-brand-cyan/80"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 3h8.2M5.2 7.5l4.1 7.1M18.8 16.5H10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)
const GithubIcon = () => (
  <svg
    className="h-5 w-5 text-brand-cyan/80"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3C7.03 3 3 7.03 3 12c0 3.98 2.58 7.35 6.16 8.54.45.08.61-.19.61-.43v-1.5c-2.5.54-3.03-1.06-3.03-1.06-.4-1.03-1-1.3-1-1.3-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.37 2.1.97 2.62.74.08-.58.31-.97.56-1.2-2-.23-4.1-1-4.1-4.48 0-.99.35-1.8.92-2.43-.1-.23-.4-1.16.08-2.41 0 0 .75-.24 2.46.93A8.5 8.5 0 0 1 12 7.8c.75 0 1.5.1 2.2.3 1.72-1.17 2.47-.93 2.47-.93.48 1.25.18 2.18.09 2.41.57.63.92 1.44.92 2.43 0 3.49-2.1 4.25-4.11 4.47.32.28.6.82.6 1.65v2.44c0 .24.16.52.62.43A9 9 0 0 0 21 12c0-4.97-4.03-9-9-9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function LoginForm() {
  const { 
    errorMsg, 
    handleGoogleLogin, 
    handleGithubLogin 
  } = useLogin()

  return (
    <div className="w-full">
      <div className="mb-8 select-none">
        <h2 className="mb-2 font-display text-5xl font-bold tracking-tight text-slate-900">
          Welcome Back
        </h2>
        <p className="font-sans text-sm font-light text-slate-600">
          Continue your learning journey with{" "}
          <span className="font-medium text-brand-cyan">InteliPath</span>
        </p>
      </div>


      <div className="flex flex-col gap-4">
        <button
          type="button"
          id="google-login-btn"
          onClick={handleGoogleLogin}
          className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white/60 px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
        >
          <ChromeIcon />
          <span>Continue with Google</span>
        </button>
        <button
          type="button"
          id="github-login-btn"
          onClick={handleGithubLogin}
          className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white/60 px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
        >
          <GithubIcon />
          <span>Continue with GitHub</span>
        </button>
      </div>
      {errorMsg && (
        <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {errorMsg === "oauth_failed" 
            ? "Authentication failed. Please try again." 
            : "An error occurred during authentication."}
        </div>
      )}


    </div>
  )
}

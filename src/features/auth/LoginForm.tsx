import React, { useState } from "react"
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useNavigate } from "react-router-dom"
import authApi from "../../api/authApi"
import { getErrorMessage, isValidEmail } from "../../lib/utils"
import { useAuth } from "../../store/AuthContext"

const ChromeIcon = () => (
  <svg
    className="h-4 w-4 text-brand-cyan/80"
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




export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const currentErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      currentErrors.email = "Please enter your email address."
    } else if (!isValidEmail(email)) {
      currentErrors.email = "Please enter a valid email address."
    }

    if (!password) {
      currentErrors.password = "Please enter your password."
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await authApi.login(email, password)
      const { user } = response.data
      login(user)
      navigate("/dashboard")
    } catch (err) {
      setErrors({ general: getErrorMessage(err) })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate("/forgot-password")
  }

  return (
    <div className="w-full">
      <div className="mb-5 select-none">
        <h2 className="mb-2 font-display text-4xl font-bold tracking-tight text-white">
          Welcome Back
        </h2>
        <p className="font-sans text-sm font-light text-slate-400">
          Continue your learning journey with{" "}
          <span className="font-medium text-brand-cyan">InteliPath</span>
        </p>
      </div>

      {errors.general && (
        <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-email"
            className="text-xs font-semibold tracking-wide text-slate-400"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="login-email"
              type="email"
              placeholder="e.g. engineering@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: undefined })
              }}
              className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-sm glass-input ${
                errors.email
                  ? "border-rose-500/50 focus:border-rose-500 focus:shadow-rose-500/10"
                  : ""
              }`}
            />
          </div>
          {errors.email && (
            <span className="pl-1 font-sans text-[11px] font-medium leading-none text-rose-400 mt-0.5">
              {errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold tracking-wide text-slate-400"
            >
              Password
            </label>
            <a
              href="#forgot-password"
              onClick={handleForgotPassword}
              className="text-xs font-semibold text-brand-cyan transition-colors duration-150 hover:text-brand-blue"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password)
                  setErrors({ ...errors, password: undefined })
              }}
              className={`w-full rounded-xl py-2.5 pl-10 pr-10 text-sm glass-input ${
                errors.password
                  ? "border-rose-500/50 focus:border-rose-500 focus:shadow-rose-500/10"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-150 hover:text-slate-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="pl-1 font-sans text-[11px] font-medium leading-none text-rose-400 mt-0.5">
              {errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          id="login-submit-btn"
          disabled={isSubmitting}
          className="relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-electric via-brand-blue to-brand-cyan px-4 py-3 font-sans text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(6,182,212,0.3)] active:brightness-95 disabled:cursor-not-allowed disabled:opacity-70 group"
        >
          {isSubmitting ? (
            <svg
              className="h-5 w-5 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <>
              <span>Authenticate Session</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
          <div className="absolute top-0 z-10 block h-full w-1/2 -inset-full -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-[shimmer_1.2s_ease-in-out_infinite]" />
        </button>
      </form>

      <div className="relative my-4 select-none">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center font-mono text-xs uppercase tracking-widest">
          <span className="bg-[#080e27]/95 px-3.5 text-slate-500">
            Or connect secure key
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <button
          type="button"
          id="google-login-btn"
          className="flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-300 shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 hover:text-white active:scale-[0.98]"
        >
          <ChromeIcon />
          <span>Google </span>
        </button>
       
      </div>

      <div className="mt-5 text-center select-none">
        <span className="font-sans text-xs font-light text-slate-500">
          Don't have an authentication account?{" "}
        </span>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="cursor-pointer text-xs font-bold text-brand-cyan transition-all duration-150 hover:text-brand-blue hover:underline underline-offset-4"
        >
          Create pathways
        </button>
      </div>
    </div>
  )
}

import React, { useState } from "react"
import { Mail, ArrowLeft, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import authApi from "../../api/authApi"
import { isValidEmail, getErrorMessage } from "../../lib/utils"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    try {
      // POST /api/v1/auth/forgot-password { email }
      await authApi.forgotPassword(email)

      // 200 OK — email exists and OTP sent
      console.log("[ForgotPassword] OTP sent. Navigating to /reset-password...")
      navigate(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      const status = err?.response?.status

      if (status === 404) {
        // 404 — Email not found
        console.warn(
          "[ForgotPassword] Email not found (404). Redirecting to /login..."
        )
        setError(
          "Email not found. Please check your email or sign up for a new account."
        )
      } else {
        // Another error (500, network, ...)
        // setError(getErrorMessage(err))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 select-none">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm text-slate-600 font-light leading-relaxed">
          Enter your registered email and we'll send you an{" "}
          <span className="text-brand-cyan font-medium">OTP code</span> to reset
          your password.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30
          text-rose-400 text-sm leading-relaxed"
        >
          {error}
          {/* Hiện thêm gợi ý nếu là 404 */}
          {error.includes("not found") && (
            <p className="mt-1 text-xs text-rose-400/70">
              Redirecting to Sign In...
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="forgot-email"
            className="text-xs font-semibold text-slate-600 tracking-wide"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="e.g. engineering@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              className="w-full text-sm pl-10 pr-4 py-3 rounded-xl glass-input"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="forgot-submit-btn"
          disabled={isSubmitting}
          className="relative w-full py-3.5 px-4 rounded-xl text-sm font-semibold
            tracking-wide text-white flex items-center justify-center gap-2 overflow-hidden group
            bg-linear-to-r from-brand-electric via-brand-blue to-brand-cyan
            hover:brightness-110 active:brightness-95
            hover:shadow-[0_0_24px_rgba(6,182,212,0.3)]
            transition-all duration-300 shadow-md cursor-pointer
            disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send OTP Code</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
          <div
            className="absolute top-0 -inset-full h-full w-1/2 z-10 transform -skew-x-12
            bg-linear-to-r from-transparent to-white/10 opacity-40
            group-hover:animate-[shimmer_1.2s_ease-in-out_infinite]"
          />
        </button>
      </form>

      {/* Back to login */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold
            text-slate-500 hover:text-brand-cyan transition-colors duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </button>
      </div>
    </div>
  )
}

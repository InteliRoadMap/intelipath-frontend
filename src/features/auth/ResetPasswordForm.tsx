import React, { useState } from "react"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import authApi from "../../api/authApi"
import { getErrorMessage } from "../../lib/utils"

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Email lấy từ URL query: /reset-password?email=xxx
  const emailFromUrl = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [errors, setErrors] = useState<{
    otp?: string
    newPassword?: string
    confirmPassword?: string
    general?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // ── Validate & submit ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const currentErrors: typeof errors = {}

    if (!otp.trim()) {
      currentErrors.otp = "Please enter the OTP code."
    } else if (otp.trim().length < 4) {
      currentErrors.otp = "OTP must be at least 4 digits."
    }

    if (!newPassword) {
      currentErrors.newPassword = "Please enter a new password."
    } else if (newPassword.length < 6) {
      currentErrors.newPassword = "Password must be at least 6 characters."
    }

    if (!confirmPassword) {
      currentErrors.confirmPassword = "Please confirm your new password."
    } else if (newPassword !== confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match."
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // POST /api/v1/auth/reset-password — JSON: { email, otp, newPassword }
      await authApi.resetPassword({
        email: emailFromUrl,
        otp: otp.trim(),
        newPassword
      })
      setSuccess(true)
    } catch (err) {
      setErrors({ general: getErrorMessage(err) })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Success state
  if (success) {
    return (
      <div className="flex flex-col items-center text-center gap-5">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl
          bg-gradient-to-br from-emerald-500/20 to-brand-cyan/20
          border border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.15)]"
        >
          <ShieldCheck className="h-7 w-7 text-emerald-400" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
            Password Reset!
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
            Your password has been successfully updated. You can now sign in
            with your new password.
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="w-full max-w-xs py-3.5 px-4 rounded-xl text-sm font-semibold text-white
            flex items-center justify-center gap-2
            bg-gradient-to-r from-brand-electric via-brand-blue to-brand-cyan
            hover:brightness-110 transition-all duration-300 shadow-md cursor-pointer"
        >
          <span>Sign In Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // ── Main form ──────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 select-none">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl
          bg-gradient-to-br from-brand-indigo/20 to-brand-blue/20 border border-brand-indigo/30"
        >
          <KeyRound className="h-5 w-5 text-brand-indigo" />
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-slate-600 font-light leading-relaxed">
          Enter the OTP code sent to your email and choose a new password.
        </p>
      </div>

      {/* General error */}
      {errors.general && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email — locked / read-only */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={emailFromUrl}
              readOnly
              disabled
              className="w-full text-sm pl-10 pr-10 py-3 rounded-xl glass-input
                opacity-60 cursor-not-allowed select-none"
            />
            {/* Lock icon on right to visually show it's locked */}
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600">
              <Lock className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-600 pl-1">
            Email is pre-filled and cannot be changed.
          </p>
        </div>

        {/* OTP Code */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reset-otp"
            className="text-xs font-semibold text-slate-600 tracking-wide"
          >
            OTP Code
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <KeyRound className="w-4 h-4" />
            </span>
            <input
              id="reset-otp"
              type="text"
              inputMode="numeric"
              placeholder="Enter OTP from email"
              value={otp}
              maxLength={8}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""))
                if (errors.otp) setErrors({ ...errors, otp: undefined })
              }}
              className={`w-full text-sm pl-10 pr-4 py-3 rounded-xl glass-input tracking-[0.25em] font-mono ${
                errors.otp ? "border-rose-500/50 focus:border-rose-500" : ""
              }`}
            />
          </div>
          {errors.otp && (
            <span className="text-rose-400 text-xs font-medium pl-1 leading-none">
              {errors.otp}
            </span>
          )}
        </div>

        {/* New Password + Confirm — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reset-newpass"
              className="text-xs font-semibold text-slate-600 tracking-wide"
            >
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="reset-newpass"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (errors.newPassword)
                    setErrors({ ...errors, newPassword: undefined })
                }}
                className={`w-full text-sm pl-10 pr-10 py-2.5 rounded-xl glass-input ${
                  errors.newPassword
                    ? "border-rose-500/50 focus:border-rose-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-rose-400 text-xs font-medium pl-1 leading-none">
                {errors.newPassword}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reset-confirm"
              className="text-xs font-semibold text-slate-600 tracking-wide"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="reset-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined })
                }}
                className={`w-full text-sm pl-10 pr-10 py-2.5 rounded-xl glass-input ${
                  errors.confirmPassword
                    ? "border-rose-500/50 focus:border-rose-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-rose-400 text-xs font-medium pl-1 leading-none">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="reset-submit-btn"
          disabled={isSubmitting}
          className="relative w-full py-3.5 px-4 rounded-xl text-sm font-semibold tracking-wide text-white
            flex items-center justify-center gap-2 overflow-hidden group
            bg-gradient-to-r from-brand-indigo to-brand-blue
            hover:brightness-110 active:brightness-95
            hover:shadow-[0_0_24px_rgba(79,70,229,0.3)]
            transition-all duration-300 shadow-md cursor-pointer
            disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
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
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
          <div
            className="absolute top-0 -inset-full h-full w-1/2 z-10 transform -skew-x-12
            bg-gradient-to-r from-transparent to-white/10 opacity-40
            group-hover:animate-[shimmer_1.2s_ease-in-out_infinite]"
          />
        </button>
      </form>

      {/* Footer */}
      <div className="text-center mt-6">
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

import React, { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import authApi from '../../api/authApi'
import { isValidEmail, isValidPassword, getErrorMessage } from '../../lib/utils'

export default function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    agreeTerms?: string
    general?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  // ── Real register logic — POST JSON { email, password, fullName } ──────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const currentErrors: typeof errors = {}

    if (!fullName.trim()) {
      currentErrors.fullName = 'Full Name is required'
    }
    if (!email) {
      currentErrors.email = 'Email address is required'
    } else if (!isValidEmail(email)) {
      currentErrors.email = 'Please provide a valid email format'
    }
    if (!password) {
      currentErrors.password = 'Password is required'
    } else if (!isValidPassword(password)) {
      currentErrors.password = 'Password must be 4–10 chars with uppercase, number & special character'
    }
    if (!confirmPassword) {
      currentErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      currentErrors.confirmPassword = 'Passwords do not match'
    }
    if (!agreeTerms) {
      currentErrors.agreeTerms = 'You must agree to the terms'
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // POST /api/v1/auth/register — JSON body: { email, password, fullName }
      await authApi.register({ email, password, fullName })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setErrors({ general: getErrorMessage(err) })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── UI ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <div className="mb-6 select-none">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
          Create Your Account
        </h2>
        <p className="text-sm text-slate-400 font-light">
          Join thousands of students building their future with InteliPath
        </p>
      </div>

      {/* General API error banner */}
      {errors.general && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-name" className="text-xs font-semibold text-slate-400 tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <User className="w-4 h-4" />
            </span>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Nguyen Van A"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (errors.fullName) setErrors({ ...errors, fullName: undefined })
              }}
              className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl glass-input ${
                errors.fullName ? 'border-rose-500/50 focus:border-rose-500' : ''
              }`}
            />
          </div>
          {errors.fullName && (
            <span className="text-rose-400 text-xs font-medium pl-1 leading-none">
              {errors.fullName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-email" className="text-xs font-semibold text-slate-400 tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="reg-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: undefined })
              }}
              className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl glass-input ${
                errors.email ? 'border-rose-500/50 focus:border-rose-500' : ''
              }`}
            />
          </div>
          {errors.email && (
            <span className="text-rose-400 text-xs font-medium pl-1 leading-none">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password & Confirm Password — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-pass" className="text-xs font-semibold text-slate-400 tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="reg-pass"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: undefined })
                }}
                className={`w-full text-sm pl-10 pr-10 py-2.5 rounded-xl glass-input ${
                  errors.password ? 'border-rose-500/50 focus:border-rose-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-rose-400 text-xs font-medium pl-1 leading-none">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-confirm" className="text-xs font-semibold text-slate-400 tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="reg-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
                }}
                className={`w-full text-sm pl-10 pr-10 py-2.5 rounded-xl glass-input ${
                  errors.confirmPassword ? 'border-rose-500/50 focus:border-rose-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-rose-400 text-xs font-medium pl-1 leading-none">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2.5 cursor-pointer group py-1 select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked)
                if (errors.agreeTerms && e.target.checked) {
                  setErrors({ ...errors, agreeTerms: undefined })
                }
              }}
              className="sr-only"
            />
            {/* Custom styled checkbox */}
            <div
              className={`w-4 h-4 rounded-md border transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                agreeTerms
                  ? 'bg-gradient-to-br from-brand-indigo to-brand-blue border-brand-indigo'
                  : 'bg-slate-900/80 border-slate-700 group-hover:border-slate-500'
              }`}
            >
              {agreeTerms && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
              I agree to the{' '}
              <span className="text-brand-cyan font-medium hover:underline cursor-pointer">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-brand-cyan font-medium hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </span>
          </label>
          {errors.agreeTerms && (
            <span className="text-rose-400 text-xs font-medium pl-1">
              * {errors.agreeTerms}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="register-submit-btn"
          disabled={isSubmitting}
          className="relative w-full py-3.5 px-4 rounded-xl text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-brand-indigo to-brand-blue hover:brightness-110 active:brightness-95 transition-all duration-300 shadow-md flex items-center justify-center gap-2 overflow-hidden group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
          {/* Shimmer */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-[shimmer_1.2s_ease-in-out_infinite]" />
        </button>

      </form>

      {/* Footer */}
      <div className="text-center mt-6 select-none">
        <span className="text-xs text-slate-500 font-light">
          Already have an account?{' '}
        </span>
        <button
          onClick={() => navigate('/login')}
          className="text-xs font-bold text-brand-cyan hover:text-brand-blue hover:underline underline-offset-4 transition-all duration-150 cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  )
}

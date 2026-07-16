import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface OnboardingShellProps {
  /** 1-based index of the current step. */
  step: number
  totalSteps: number
  stepLabels: string[]
  title: string
  subtitle: string
  error?: string
  children: ReactNode
  onBack?: () => void
  backLabel?: string
  onNext: () => void
  nextLabel: string
  nextLoading?: boolean
  nextDisabled?: boolean
}

/**
 * Shared frame for the student onboarding flow (Personal → Academic → Skills).
 * Owns the backdrop, floating card, segmented stepper, scroll body and footer so
 * every step reads as one cohesive product surface. Steps only supply their fields.
 */
export default function OnboardingShell({
  step,
  totalSteps,
  stepLabels,
  title,
  subtitle,
  error,
  children,
  onBack,
  backLabel = 'Back',
  onNext,
  nextLabel,
  nextLoading = false,
  nextDisabled = false,
}: OnboardingShellProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Calm, single-hue wash so the card reads as floating without competing for attention. */}
      <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-xl" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full blur-[120px]" style={{ background: 'rgba(79,70,229,0.20)' }} />
        <div className="absolute -bottom-32 -right-24 h-[400px] w-[400px] rounded-full blur-[120px]" style={{ background: 'rgba(59,130,246,0.16)' }} />
      </div>

      <div className="animate-fade-in relative z-50 flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_-20px_rgba(15,23,42,0.45)] ring-1 ring-slate-950/[0.06]">
        {/* ── Header + stepper ─────────────────────────────────── */}
        <header className="shrink-0 px-7 pt-7 pb-6 sm:px-9">
          <div className="flex items-end justify-between gap-4">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-indigo-600">
              Step {step} / {totalSteps}
            </span>
            <span className="text-[12px] font-medium text-slate-400">{stepLabels[step - 1]}</span>
          </div>

          <div className="mt-2.5 flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < step ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <h1 className="mt-6 font-display text-[23px] font-bold tracking-tight text-slate-900 sm:text-[26px]">
            {title}
          </h1>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate-500">{subtitle}</p>
        </header>

        {/* ── Body ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-7 pb-6 sm:px-9 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          {error && (
            <div className="mb-5 rounded-xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-[13.5px] font-medium text-rose-600">
              {error}
            </div>
          )}
          {children}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 px-7 py-4 sm:px-9">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[14px] font-semibold text-slate-500 transition-colors hover:text-slate-900 ${
              onBack ? '' : 'pointer-events-none opacity-0'
            }`}
          >
            <ArrowLeft size={16} /> {backLabel}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={nextLoading || nextDisabled}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[14.5px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(15,23,42,0.5)] transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-900"
          >
            {nextLabel}
            {!nextLoading && <ArrowRight size={17} />}
          </button>
        </footer>
      </div>
    </div>
  )
}

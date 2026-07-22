import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import logoMark from '@/assets/logo-mark.png'

interface OnboardingShellProps {
  /** 1-based index of the current step. */
  step: number
  totalSteps: number
  stepLabels: string[]
  title: string
  subtitle: string
  error?: string
  children: ReactNode
  /** Gives the card more room. The skill picker needs it; the short forms do not. */
  wide?: boolean
  onBack?: () => void
  backLabel?: string
  onNext: () => void
  nextLabel: string
  nextLoading?: boolean
  nextDisabled?: boolean
}

/**
 * The onboarding surface (Personal → Academic → Skills).
 *
 * It owns the whole viewport rather than floating over the dashboard. Onboarding is not an
 * interruption of a page you were using — until it is finished there is no dashboard to
 * speak of, and the old scrim sat over an empty "Welcome to InteliPath" placeholder, so the
 * card appeared to hover above a blank form belonging to no product. The wordmark and the
 * app's own background carry that identity instead.
 */
export default function OnboardingShell({
  step,
  totalSteps,
  stepLabels,
  title,
  subtitle,
  error,
  children,
  wide = false,
  onBack,
  backLabel = 'Back',
  onNext,
  nextLabel,
  nextLoading = false,
  nextDisabled = false,
}: OnboardingShellProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-slate-50">
      {/* Two soft brand washes, far enough apart to read as light rather than decoration. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-[140px]"
          style={{ background: 'rgba(79,70,229,0.14)' }}
        />
        <div
          className="absolute -bottom-40 -right-32 h-[480px] w-[480px] rounded-full blur-[140px]"
          style={{ background: 'rgba(59,130,246,0.12)' }}
        />
      </div>

      <div className="relative z-10 flex min-h-full flex-col items-center px-4 py-6 sm:px-6 sm:py-8">
        {/* Deliberately not the linked Logo: onboarding has to be finished, and a wordmark
            that navigates to the landing page is an exit from a flow with no way back in. */}
        <div className={`mb-5 flex w-full items-center gap-2.5 ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>
          <img src={logoMark} alt="" className="h-7 w-auto shrink-0" draggable={false} />
          <span className="text-[18px] font-bold tracking-tight text-slate-900">InteliPath</span>
        </div>

        <div
          className={`animate-fade-in flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-950/[0.06] ${
            wide ? 'max-w-3xl' : 'max-w-xl'
          }`}
        >
          {/* ── Header + stepper ─────────────────────────────────── */}
          <header className="shrink-0 px-7 pb-6 pt-7 sm:px-9">
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
          <div className="flex-1 px-7 pb-6 sm:px-9">
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
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-[14.5px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,0.8)] transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              {nextLabel}
              {!nextLoading && <ArrowRight size={17} />}
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}

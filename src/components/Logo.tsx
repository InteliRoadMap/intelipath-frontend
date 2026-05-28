import { Link } from 'react-router-dom'

type LogoProps = {
  className?: string
  iconOnly?: boolean
  hideIcon?: boolean
}

export default function Logo({
  className = "",
  iconOnly = false,
  hideIcon = false
}: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-3 select-none hover:opacity-90 transition-opacity ${className}`}>
      {!hideIcon && (
        <div className="relative flex h-10 w-10 items-center justify-center group">
          <div className="absolute inset-0 rounded-xl bg-brand-cyan/25 blur-md transition-all duration-500 group-hover:bg-brand-cyan/40" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-cyan/30 bg-gradient-to-br from-brand-blue to-brand-cyan shadow-lg transition-all duration-300 group-hover:scale-105">
            <svg
              className="h-[22px] w-[22px] text-brand-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 19L10 13M10 13L14 17M10 13L15 8M15 8L13 5M15 8L20 9.5"
              />
              <circle cx="15" cy="8" r="2" fill="currentColor" stroke="none" />
              <circle
                cx="4"
                cy="19"
                r="1.5"
                fill="currentColor"
                stroke="none"
              />
              <circle
                cx="10"
                cy="13"
                r="1.5"
                fill="currentColor"
                stroke="none"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 3h2c1 0 2 1 2 2M16 3h-2c-1 0-2 1-2 2"
                opacity="0.6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 21h2c1 0 2-1 2-2M16 21h-2c-1 0-2-1-2-2"
                opacity="0.6"
              />
            </svg>
            <div className="absolute -inset-1 rounded-2xl border border-brand-cyan/15 animate-[spin_10s_linear_infinite] pointer-events-none" />
          </div>
        </div>
      )}

      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-display text-3xl font-bold tracking-tight text-inherit">
            Inteli
            <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">
              Path
            </span>
          </span>
        </div>
      )}
    </Link>
  )
}

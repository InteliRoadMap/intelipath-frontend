import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"
import AbstractIllustration from "./AbstractIllustration"
import Logo from "./Logo"

type AuthView = "login" | "register"

type AuthLayoutProps = {
  children: ReactNode
  view: AuthView
}



export default function AuthLayout({ children, view }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-y-auto bg-linear-to-br from-[#1e326b] via-[#172552] to-[#0e1736] font-sans text-slate-100">
      <div className="absolute inset-0 z-0 grid-overlay pointer-events-none opacity-90" />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] animate-[spin_120s_linear_infinite] rounded-full bg-gradient-radial from-brand-indigo/10 via-brand-cyan/5 to-transparent blur-3xl" />
        <div className="absolute left-1/4 top-1/4 h-[80%] w-[80%] animate-[spin_90s_linear_infinite_reverse] rounded-full bg-gradient-radial from-brand-blue/15 via-transparent to-transparent blur-3xl" />
      </div>

      <header className="relative z-30 flex w-full items-center px-6 py-6 xl:px-8">
        <Logo hideIcon className="scale-95" />
      </header>

      <main className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-4 xl:px-0">
        <div className="relative w-full max-w-310">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-blue-500/10 blur-3xl" />
          <div
            className="
    grid min-h-[500px] md:h-191.25 w-full grid-cols-1
    overflow-hidden
    rounded-3xl

     border-cyan-400/1 

    bg-[#071028]/55

    shadow-[0_0_80px_rgba(0,140,255,0.10)]

    backdrop-blur-[28px]

    transition-all duration-500

    md:grid-cols-12
  "
          >
            <section className="hidden md:flex w-full overflow-hidden border-r border-white/2.5 bg-linear-to-br from-slate-950 via-slate-900/10 to-slate-950 md:col-span-5 md:h-auto md:self-stretch">
              <AbstractIllustration view={view} />
            </section>

            <section className="relative flex w-full flex-col justify-center overflow-hidden bg-linear-to-tl from-slate-950/20 via-slate-900/10 to-transparent p-5 sm:p-6 xl:p-7 md:col-span-7">
              <div className="absolute inset-0 z-0 grid-overlay opacity-25 pointer-events-none" />
              <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-cyan/5 blur-[90px] pointer-events-none" />

              <div className="relative z-10 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

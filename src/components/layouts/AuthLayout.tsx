import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"
import AbstractIllustration from "@/components/ui/AbstractIllustration"
import Logo from "@/components/ui/Logo"

type AuthView = "login" | "register" | "forgot-password"

type AuthLayoutProps = {
  children: ReactNode
  view: AuthView
}



export default function AuthLayout({ children, view }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-linear-to-br from-blue-50 via-white to-blue-100 font-sans text-slate-900">
      <div className="absolute inset-0 z-0 grid-overlay-light pointer-events-none opacity-60" />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] animate-[spin_120s_linear_infinite] rounded-full bg-gradient-radial from-blue-400/20 via-sky-300/10 to-transparent blur-3xl" />
        <div className="absolute left-1/4 top-1/4 h-[80%] w-[80%] animate-[spin_90s_linear_infinite_reverse] rounded-full bg-gradient-radial from-cyan-300/20 via-transparent to-transparent blur-3xl" />
      </div>

      <header className="relative z-30 flex w-full items-center px-6 py-6 xl:px-8">
        <Logo hideIcon className="scale-95 !text-slate-900" />
      </header>

      <main className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-4 xl:px-0">
        <div className="relative w-full max-w-310">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-blue-300/30 blur-3xl" />
          <div
            className="
    grid min-h-[550px] md:h-[75vh] md:max-h-[765px] w-full grid-cols-1
    overflow-hidden
    rounded-3xl
    border border-white/40 
    bg-white/70
    shadow-[0_8px_32px_rgba(0,100,200,0.1)]
    backdrop-blur-[24px]
    transition-all duration-500
    md:grid-cols-12
  "
          >
            <section className="hidden md:flex w-full overflow-hidden border-r border-slate-200/50 bg-linear-to-br from-blue-50/80 via-white/40 to-sky-50/80 md:col-span-5 md:h-auto md:self-stretch">
              <AbstractIllustration view={view} />
            </section>

            <section className="relative flex w-full flex-col justify-center overflow-hidden bg-white/40 p-5 sm:p-6 xl:p-7 md:col-span-7">
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

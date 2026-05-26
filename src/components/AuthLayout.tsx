import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"
import AbstractIllustration from "./AbstractIllustration"
import Logo from "./Logo"

type AuthView = "login" | "register"

type AuthLayoutProps = {
  children: ReactNode
  view: AuthView
}

const floatingLights = [
  {
    id: 1,
    width: 320,
    height: 320,
    color: "bg-brand-cyan/35",
    initialX: "15%",
    initialY: "20%",
    duration: 16,
    delay: 0
  },
  {
    id: 2,
    width: 450,
    height: 450,
    color: "bg-brand-indigo/35",
    initialX: "70%",
    initialY: "15%",
    duration: 22,
    delay: 1
  },
  {
    id: 3,
    width: 400,
    height: 400,
    color: "bg-brand-blue/30",
    initialX: "45%",
    initialY: "60%",
    duration: 18,
    delay: 3
  },
  {
    id: 4,
    width: 280,
    height: 280,
    color: "bg-brand-cyan/30",
    initialX: "80%",
    initialY: "75%",
    duration: 14,
    delay: 2
  }
]

export default function AuthLayout({ children, view }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-y-auto bg-gradient-to-br from-[#0b132b] via-[#0a0f24] to-[#020617] font-sans text-slate-100">
      <div className="absolute inset-0 z-0 grid-overlay pointer-events-none opacity-90" />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {floatingLights.map((light) => (
          <motion.div
            key={light.id}
            className={`absolute rounded-full blur-[110px] ${light.color}`}
            style={{
              width: light.width,
              height: light.height,
              left: light.initialX,
              top: light.initialY
            }}
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -50, 40, 0],
              scale: [1, 1.15, 0.9, 1]
            }}
            transition={{
              duration: light.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: light.delay
            }}
          />
        ))}
      </div>

      <header className="relative z-30 flex w-full items-center px-3 py-3 select-none sm:px-4">
        <Logo hideIcon />
      </header>

      <main className="relative z-20 mx-auto flex w-full max-w-[1280px] flex-1 items-center justify-center px-4 py-4 xl:px-0">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[24px] bg-blue-500/10 blur-3xl" />
          <div
            className="
    grid h-[765px] w-[100vw] max-w-[1240px] grid-cols-1
    overflow-hidden
    rounded-[24px]

     border-cyan-400/[0.01] 

    bg-[#071028]/55

    shadow-[0_0_80px_rgba(0,140,255,0.10)]

    backdrop-blur-[28px]

    transition-all duration-500

    md:grid-cols-12
  "
          >
            <section className="h-80 w-full overflow-hidden border-b border-white/[0.025] bg-gradient-to-br from-slate-950 via-slate-900/10 to-slate-950 md:col-span-5 md:h-auto md:self-stretch md:border-b-0 md:border-r">
              <AbstractIllustration view={view} />
            </section>

            <section className="relative flex w-full flex-col justify-center overflow-hidden bg-gradient-to-tl from-slate-950/20 via-slate-900/10 to-transparent p-5 sm:p-6 xl:p-7 md:col-span-7">
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

import { motion } from 'motion/react'
import ResetPasswordForm from '../features/auth/ResetPasswordForm'
import Logo from '../components/Logo'

/* Floating orbs — same aesthetic as AuthLayout */
const orbs = [
  { width: 380, height: 380, color: 'bg-brand-indigo/25', left: '5%',  top: '10%', duration: 20, delay: 0 },
  { width: 500, height: 500, color: 'bg-brand-blue/20',   left: '60%', top: '5%',  duration: 26, delay: 1 },
  { width: 360, height: 360, color: 'bg-brand-cyan/20',   left: '75%', top: '65%', duration: 18, delay: 2 },
]

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-y-auto
      bg-linear-to-br from-[#0b132b] via-[#0a0f24] to-brand-deep
      font-sans text-slate-100">

      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 grid-overlay pointer-events-none opacity-80" />

      {/* Floating orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[120px] ${orb.color}`}
            style={{ width: orb.width, height: orb.height, left: orb.left, top: orb.top }}
            animate={{ x: [0, 50, -40, 0], y: [0, -40, 35, 0], scale: [1, 1.1, 0.92, 1] }}
            transition={{ duration: orb.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: orb.delay }}
          />
        ))}
      </div>

      {/* Header with Logo */}
      <header className="relative z-30 flex w-full items-center px-3 py-3 select-none sm:px-4">
        <Logo hideIcon />
      </header>

      {/* Centered form card */}
      <main className="relative z-20 flex flex-1 items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg"
        >
          {/* Glow behind card */}
          <div className="absolute inset-0 -z-10 rounded-3xl bg-brand-indigo/10 blur-3xl pointer-events-none" />

          {/* Glass card */}
          <div className="relative rounded-2xl border border-white/[0.07]
            bg-[#071028]/60 backdrop-blur-[28px]
            shadow-[0_0_60px_rgba(79,70,229,0.12)]
            px-7 py-9 sm:px-10">

            {/* Subtle corner glow */}
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full
              bg-brand-indigo/5 blur-[60px] pointer-events-none" />
            <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full
              bg-brand-cyan/5 blur-[50px] pointer-events-none" />

            <div className="relative z-10">
              <ResetPasswordForm />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { MapTrifold, Robot, SquaresFour, TrendUp, IdentificationCard, ChatTeardropText } from "@phosphor-icons/react"
import { UserHeaderActions, Logo } from "@/components"
import { ROUTES } from "@/shared"
import type { User } from "@/features/auth/types"

type StudentHeaderProps = {
  user: User | null
  onLogout: () => void | Promise<void>
  onOpenAiMentor: () => void
}


export default function StudentHeader({ user, onLogout, onOpenAiMentor }: StudentHeaderProps) {
  const location = useLocation()
  const isAiMentorActive = location.pathname === ROUTES.AI_MENTOR

  const navigate = useNavigate()
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 md:px-8 pt-6 pointer-events-none">
      <nav className="pointer-events-auto flex w-full max-w-[1400px] items-center justify-between transition-all">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo hideIcon className="scale-[0.85] origin-left" />
        </div>

        {/* Center: Navigation Links in a Glass Pill */}
        <div className="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-1.5 py-1.5 text-[13px] font-bold">
          <NavLink
            to={ROUTES.DASHBOARD_STUDENT}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900 hover:bg-white/40"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to={ROUTES.DASHBOARD_STUDENT_ROADMAP}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900 hover:bg-white/40"
              }`
            }
          >
            Roadmap
          </NavLink>
          <NavLink
            to={ROUTES.DASHBOARD_STUDENT_MARKET_PULSE}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900 hover:bg-white/40"
              }`
            }
          >
            Market Pulse
          </NavLink>
          <NavLink
            to={ROUTES.DASHBOARD_STUDENT_PORTFOLIO}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900 hover:bg-white/40"
              }`
            }
          >
            Portfolio
          </NavLink>
          <button
            type="button"
            onClick={onOpenAiMentor}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
              isAiMentorActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            AI Mentor
          </button>
        </div>

        {/* Right: User Actions / Dropdown */}
        <div className="flex items-center justify-end">
          <div className="bg-white/80 backdrop-blur-md shadow-sm border border-white/60 rounded-full pr-1 pl-3 py-1 flex items-center gap-2">
            <UserHeaderActions
              user={user}
              onLogout={onLogout}
              onSettings={() => navigate(ROUTES.DASHBOARD_STUDENT_SETTINGS)}
            />
          </div>
        </div>
      </nav>
    </div>
  )
}

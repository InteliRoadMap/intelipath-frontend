import { NavLink } from "react-router-dom"
import { MapTrifold, Robot, SquaresFour, TrendUp, IdentificationCard } from "@phosphor-icons/react"
import { DashboardUserActions, Logo } from "@/components"
import { ROUTES } from "@/shared"
import type { User } from "@/features/auth/types"

type StudentTopNavProps = {
  user: User | null
  onLogout: () => void | Promise<void>
  onOpenAiMentor: () => void
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 border-b-[3px] py-4 -mb-3.5 transition-colors ${
    isActive ? "border-[#00838f] text-[#00838f]" : "border-transparent hover:text-slate-800"
  }`

export default function StudentTopNav({ user, onLogout, onOpenAiMentor }: StudentTopNavProps) {
  return (
    <nav className="sticky top-0 z-40 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 md:px-8">
      <div className="flex items-center gap-6 md:gap-12">
        <Logo hideIcon className="scale-90 origin-left" />

        <div className="hidden items-center gap-8 text-[13px] font-bold text-slate-500 lg:flex">
          <NavLink to={ROUTES.DASHBOARD_STUDENT} end className={navLinkClass}>
            <SquaresFour size={17} weight="duotone" />
            Dashboard
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD_STUDENT_ROADMAP} className={navLinkClass}>
            <MapTrifold size={17} weight="duotone" />
            My Roadmap
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD_STUDENT_PORTFOLIO} className={navLinkClass}>
            <IdentificationCard size={17} weight="duotone" />
            E-Portfolio
          </NavLink>
          <button
            type="button"
            onClick={onOpenAiMentor}
            className="flex items-center gap-2 border-b-[3px] border-transparent py-4 -mb-3.5 transition-colors hover:text-slate-800"
          >
            <Robot size={17} weight="duotone" />
            AI Mentor
          </button>
          <a
            href={`${ROUTES.DASHBOARD_STUDENT}#market-demand`}
            className="flex items-center gap-2 border-b-[3px] border-transparent py-4 -mb-3.5 transition-colors hover:text-slate-800"
          >
            <TrendUp size={17} weight="duotone" />
            Market Pulse
          </a>
        </div>
      </div>

      <DashboardUserActions user={user} onLogout={onLogout} />
    </nav>
  )
}

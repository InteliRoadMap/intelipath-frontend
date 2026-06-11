import {
  Settings,
  Bell,
  LayoutDashboard,
  GitFork,
  Bot,
  TrendingUp,
  IdCard,
  MessageSquare,
  Users
} from "lucide-react"
import Logo from "@/components/ui/Logo"
import NotificationPanel from "./NotificationPanel"
import { useAuth } from "@/context"
import { useNavigate, useLocation } from "react-router-dom"

interface TopbarProps {
  userRole?: string // 'Student' | 'Mentor' | 'Counselor'
}

export default function Topbar({ userRole }: TopbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const role = userRole || user?.role || "Student"
  const roleLower = role.toLowerCase()

  let avatarGradient = "from-brand-cyan to-brand-blue"
  let initial = "S"

  const studentLinks = [
    { path: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
    { path: "/roadmap/student", label: "My Roadmap", icon: GitFork },
    { path: "/mentor", label: "AI Mentor", icon: Bot },
    { path: "/market", label: "Market Pulse", icon: TrendingUp },
    { path: "/portfolio", label: "E-Portfolio", icon: IdCard }
  ]

  const mentorLinks = [
    { path: "/dashboard/mentor", label: "Dashboard", icon: LayoutDashboard },
    { path: "/feedback", label: "Feedback", icon: MessageSquare },
    { path: "/portfolio", label: "E-Portfolio", icon: IdCard }
  ]

  const counselorLinks = [
    { path: "/dashboard/counselor", label: "Dashboard", icon: LayoutDashboard },
    { path: "/students", label: "Students", icon: Users }
  ]

  let activeLinks = studentLinks

  if (roleLower === "mentor") {
    avatarGradient = "from-cyan-400 to-[#00838f]"
    initial = "M"
    activeLinks = mentorLinks
  } else if (roleLower === "counselor") {
    avatarGradient = "from-amber-400 to-yellow-600"
    initial = "C"
    activeLinks = counselorLinks
  }

  const displayName = user?.fullName || user?.email || role
  const displayInitial = (user?.fullName || user?.email || initial)[0].toUpperCase()

  return (
    <header className="shrink-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Logo hideIcon={true} className="scale-75 sm:scale-90 origin-left" />

        <nav className="hidden xl:flex items-center gap-1">
          {activeLinks.map((link) => {
            const Icon = link.icon
            // Highlight active if pathname matches
            const isActive =
              location.pathname === link.path ||
              (link.path === "/dashboard/student" && location.pathname === "/")

            // Adjust active colors based on role
            let activeClass = "bg-[#a5e1fa] text-[#0d5060]"
            if (roleLower === "mentor" || roleLower === "counselor") {
              activeClass = "bg-[#a5e1fa] text-[#0d5060]"
            }

            return (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? `${activeClass} font-bold`
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => navigate("/settings/profile")}
          className="hidden sm:flex items-center justify-center w-10 h-10 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </button>
        <NotificationPanel />
        <div
          className="flex items-center gap-3 pl-4 sm:pl-6 ml-2 border-l border-slate-200 group cursor-pointer"
          onClick={handleLogout}
          title="Click to Logout"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-900 group-hover:text-rose-500 transition-colors">
              {displayName}
            </p>
            <p className="text-xs font-medium text-slate-500 capitalize">
              {role}
            </p>
          </div>
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold sm:text-lg shadow-md group-hover:shadow-lg transition-all`}
          >
            {displayInitial}
          </div>
        </div>
      </div>
    </header>
  )
}

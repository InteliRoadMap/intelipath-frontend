import {
  Book,
  Building2,
  Calendar,
  Edit3,
  GraduationCap,
  Mail,
  ShieldCheck,
  User,
  Bot,
  LayoutDashboard,
  Map,
  TrendingUp
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { DashboardUserActions, Logo } from "@/components"
import { useProfileSettings } from "../hooks/useProfileSettings"

export default function ProfileSettingsPage() {
  const {
    profileData,
    loading,
    saving,
    error,
    handleChange,
    handleSave,
    loadProfile,
    displayInitial,
    role,
    githubName
  } = useProfileSettings()

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { label: "My Roadmap", icon: Map, path: ROUTES.DASHBOARD_STUDENT_ROADMAP || "/roadmap/student" },
    { label: "AI Mentor", icon: Bot, path: ROUTES.AI_MENTOR },
    { label: "Market Pulse", icon: TrendingUp, path: "/market" }
  ]

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <nav className="sticky top-0 z-40 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 md:px-8 shrink-0">
        <div className="flex items-center gap-6 md:gap-12">
          <Logo hideIcon className="scale-90 origin-left" />

          <div className="hidden items-center gap-8 text-[13px] font-bold text-slate-500 lg:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === ROUTES.DASHBOARD && location.pathname === "/")
              return (
                <a
                  key={item.label}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(item.path)
                  }}
                  className={`flex items-center gap-2 py-4 -mb-3.5 transition-colors ${
                    isActive
                      ? "border-b-[3px] border-[#00838f] text-[#00838f]"
                      : "hover:text-slate-800"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </a>
              )
            })}
          </div>
        </div>

        <DashboardUserActions user={user} onLogout={handleLogout} />
      </nav>

      <main className="flex-1 overflow-y-auto relative py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 pb-20">
          <div className="flex-[2]">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-5 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {displayInitial}
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-cyan text-white rounded-lg flex items-center justify-center shadow-md hover:brightness-110 transition-all border-2 border-white"
                    aria-label="Edit avatar"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                <div className="mt-2">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Personal Identity
                  </h2>
                  <p className="text-sm text-slate-500">
                    Update your public profile and professional summary.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm font-medium text-slate-500">
                  Loading profile...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <User size={16} className="text-brand-blue" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <GraduationCap size={16} className="text-brand-blue" />
                        Major
                      </label>
                      <input
                        type="text"
                        value={profileData.major}
                        onChange={(e) => handleChange("major", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Book size={16} className="text-brand-blue" />
                      Professional Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Calendar size={16} className="text-brand-blue" />
                        Year of Birth
                      </label>
                      <input
                        type="date"
                        value={profileData.yob}
                        onChange={(e) => handleChange("yob", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Building2 size={16} className="text-brand-blue" />
                        University
                      </label>
                      <input
                        type="text"
                        value={profileData.university}
                        onChange={(e) =>
                          handleChange("university", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Calendar size={16} className="text-brand-blue" />
                        Year of Admission
                      </label>
                      <input
                        type="date"
                        value={profileData.year_of_admission}
                        onChange={(e) => handleChange("year_of_admission", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() => void loadProfile()}
                      disabled={saving}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#4cb7ed] hover:bg-[#3ba2d6] text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-[#4cb7ed]/20 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-5">
                Linked Accounts
              </h3>

              <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900">GitHub</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    Linked: @{githubName}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-bold text-brand-blue hover:text-brand-electric transition-colors"
                  >
                    Sync Now
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-5">
                Account Access
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Mail size={13} />
                      Email
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {profileData.email || "Not set"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-brand-blue hover:text-brand-electric transition-colors"
                    aria-label="Edit email"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <ShieldCheck size={13} />
                      Password
                    </p>
                    <p className="text-sm font-bold text-slate-900 tracking-widest">
                      ************
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-brand-blue hover:text-brand-electric transition-colors"
                    aria-label="Reset password"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.84-10.36L2 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

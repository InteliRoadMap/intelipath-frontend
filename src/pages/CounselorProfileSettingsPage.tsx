import {
  Book,
  Building2,
  Calendar,
  ChevronDown,
  Edit3,
  Mail,
  User,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Award,
  GraduationCap
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { DashboardUserActions, Logo, DatePicker } from "@/components"
import { useProfileSettings } from "../hooks/useProfileSettings"
import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import counselorApi from "../api/counselorApi"
gsap.registerPlugin(useGSAP)

export default function CounselorProfileSettingsPage() {
  const {
    profileData,
    loading,
    error,
    handleChange,
    loadProfile,
    displayInitial
  } = useProfileSettings()

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSaving, setIsSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sparkleRef = useRef<SVGSVGElement>(null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await counselorApi.updateCounselorProfile({
        fullName: profileData.fullName,
        yob: profileData.yob,
        bio: profileData.bio,
        email: profileData.email,
        university: profileData.university,
        department: profileData.department
      })
      alert("Saved successfully!")
    } catch (error) {
      console.error("Error to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }
  useGSAP(
    () => {
      // ── Entrance animations ──────────────────────────────────
      gsap.from(".page-header", {
        y: -50,
        opacity: 0,
        duration: 1.0,
        ease: "power4.out",
        delay: 0.05
      })

      gsap.from(".hero-icon", {
        scale: 0,
        rotation: -45,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(2)",
        delay: 0.35
      })

      gsap.from(".section-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.4
      })

      // ── Sparkle twinkle (infinite loop) ─────────────────────
      if (sparkleRef.current) {
        const tl = gsap.timeline({ repeat: -1, delay: 1.2 })
        tl.to(sparkleRef.current, {
          scale: 1.3,
          opacity: 0.4,
          rotate: 20,
          duration: 0.35,
          ease: "power2.in"
        })
          .to(sparkleRef.current, {
            scale: 1.15,
            opacity: 1,
            rotate: -15,
            duration: 0.25,
            ease: "power2.out"
          })
          .to(sparkleRef.current, {
            scale: 1.4,
            opacity: 0.6,
            rotate: 10,
            duration: 0.3,
            ease: "power2.inOut"
          })
          .to(sparkleRef.current, {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
          })
          .to(sparkleRef.current, {
            duration: 2.5
          })
      }
    },
    { scope: containerRef }
  )

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: ROUTES.DASHBOARD_COUNSELOR || "/dashboard/counselor"
    },
    {
      label: "Feedback",
      icon: MessageSquare,
      path: ROUTES.COUNSELOR_FEEDBACK || "/dashboard/counselor/feedback"
    },
    { label: "Settings", icon: Edit3, path: location.pathname }
  ]

  return (
    <div
      className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-slate-900"
      ref={containerRef}
    >
      <nav className="sticky top-0 z-40 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 md:px-8 shrink-0">
        <div className="flex items-center gap-6 md:gap-12">
          <Logo hideIcon className="scale-90 origin-left" />

          <div className="hidden items-center gap-8 text-[13px] font-bold text-slate-500 lg:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
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

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 space-y-7">
        {/* ── Hero Banner ─────────────────────────────────────── */}
        <div className="page-header relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003d40] via-[#005f63] to-[#00838f] p-7 md:p-9 shadow-[0_30px_60px_rgba(0,131,143,0.25)]">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-[#4dd0e1]/30 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="hero-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner">
                <Sparkles
                  ref={sparkleRef}
                  size={28}
                  className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              </div>
              <div>
                <p className="text-white/60 text-[12px] font-semibold uppercase tracking-widest mb-1">
                  Counselor Portal
                </p>
                <h1 className="text-white text-[26px] md:text-[30px] font-bold leading-tight">
                  Profile Settings
                </h1>
                <p className="text-white/70 text-[13px] mt-1">
                  Manage your counselor identity and university details
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void loadProfile()}
                disabled={loading || isSaving}
                className="flex items-center gap-2 text-[13px] font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-2xl transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Reload
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 pb-10">
          <div className="flex-[2] space-y-6">
            {/* Identity Card */}
            <div className="section-card bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.04)] hover:border-[#00838f]/30 transition-colors">
              <div className="flex items-start gap-5 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00838f] to-[#005f63] flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-[#00838f]/30">
                    {displayInitial}
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-[#00838f] rounded-xl flex items-center justify-center shadow-md hover:scale-110 transition-transform border border-slate-100"
                    aria-label="Edit avatar"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                <div className="mt-2">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Counselor Identity
                  </h2>
                  <p className="text-sm text-slate-500">
                    How you appear to students asking for guidance.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 text-center text-sm font-medium text-slate-400 animate-pulse">
                  Loading profile data...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <User size={16} className="text-[#00838f]" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all hover:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Calendar size={16} className="text-[#00838f]" />
                        Year of Birth
                      </label>
                      <DatePicker
                        value={profileData.yob ?? ""}
                        onChange={(v) => handleChange("yob", v)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Building2 size={16} className="text-[#00838f]" />
                        University
                      </label>
                      <input
                        type="text"
                        value={profileData.university}
                        placeholder="e.g. FPT University"
                        onChange={(e) =>
                          handleChange("university", e.target.value)
                        }
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all hover:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <GraduationCap size={16} className="text-[#00838f]" />
                        Department
                      </label>
                      <input
                        type="text"
                        value={profileData.department}
                        placeholder="e.g. Software Engineering"
                        onChange={(e) =>
                          handleChange("department", e.target.value)
                        }
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Book size={16} className="text-[#00838f]" />
                      Professional Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      placeholder="Share your experience and how you can help students..."
                      onChange={(e) => handleChange("bio", e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all hover:bg-white resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() => void loadProfile()}
                      disabled={isSaving}
                      className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50 px-4 py-2.5 rounded-xl hover:bg-slate-100"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-[#00838f] hover:bg-[#006064] text-white rounded-xl text-[13px] font-bold transition-all shadow-md shadow-[#00838f]/20 disabled:cursor-not-allowed disabled:opacity-70 hover:-translate-y-0.5"
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="section-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] hover:border-[#00838f]/30 transition-colors">
              <h3 className="text-[15px] font-bold text-slate-900 mb-5">
                Account Security
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div>
                    <p className="mb-1 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Mail size={13} />
                      Email Address
                    </p>
                    <p className="text-[14px] font-semibold text-slate-900">
                      {profileData.email || "Not set"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-[#00838f] hover:text-[#006064] bg-white p-2 rounded-lg shadow-sm border border-slate-200 transition-all hover:scale-105"
                    aria-label="Edit email"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
              </div>
            </div>

            <div className="section-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] hover:border-[#00838f]/30 transition-colors">
              <h3 className="text-[15px] font-bold text-slate-900 mb-5">
                Verification Status
              </h3>

              <div className="border border-slate-200/80 rounded-xl p-4 flex items-start gap-4 bg-slate-50/50 hover:bg-white transition-colors group">
                <div className="w-10 h-10 bg-[#e6f7f8] rounded-xl flex items-center justify-center text-[#00838f] shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  <Award size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-[14px] text-slate-900">
                      Academic Role
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <p className="text-[12px] text-slate-500">
                    Your counselor status is verified by the university
                    administration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

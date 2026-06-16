import {
  Book,
  Building2,
  Calendar,
  Edit3,
  Mail,
  User,
  Target,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Briefcase,
  ChevronLeft
} from "lucide-react"
import { Layout, ChatTeardropText, PencilSimple } from "@phosphor-icons/react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { UserHeaderActions, Logo } from "@/components"
import { useProfileSettings } from "../hooks/useProfileSettings"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function MentorProfileSettingsPage() {
  const {
    profileData,
    loading,
    saving,
    error,
    handleChange,
    handleSave,
    loadProfile,
    displayInitial
  } = useProfileSettings()

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const sparkleRef = useRef<SVGSVGElement>(null)

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
    { label: "Settings", icon: PencilSimple, path: location.pathname }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-slate-900" ref={containerRef}>
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-[1680px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Logo hideIcon className="origin-left scale-90" />
            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <a
                    key={item.label}
                    href="#"
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -3, scale: 1.05, duration: 0.3, ease: "back.out(2)" })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" })}
                    onClick={(e) => {
                      e.preventDefault()
                      gsap.fromTo(e.currentTarget, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" })
                      navigate(item.path)
                    }}
                    className={`relative flex h-[72px] items-center gap-2 border-b-[3px] px-0 text-sm font-semibold transition-colors ${
                      isActive
                        ? "border-cyan-700 text-cyan-800"
                        : "border-transparent text-slate-500 hover:text-slate-950"
                    }`}
                  >
                    <item.icon size={17} weight="duotone" />
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </div>
          <UserHeaderActions user={user} onLogout={handleLogout} />
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 space-y-7">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[14px] font-semibold text-slate-500 hover:text-[#4f46e5] transition-all w-fit group mb-4 hover:-translate-x-1"
        >
          <ChevronLeft size={16} strokeWidth={2.5} className="text-slate-400 group-hover:text-[#4f46e5] transition-colors" />
          Back to home
        </button>

        {/* ── Hero Banner ─────────────────────────────────────── */}
        <div className="page-header relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#312e81] via-[#4338ca] to-[#6366f1] p-7 md:p-9 shadow-[0_30px_60px_rgba(99,102,241,0.25)]">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-[#818cf8]/30 blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="hero-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner">
                <Sparkles ref={sparkleRef} size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <div>
                <p className="text-white/60 text-[12px] font-semibold uppercase tracking-widest mb-1">Mentor Portal</p>
                <h1 className="text-white text-[26px] md:text-[30px] font-bold leading-tight">
                  Profile Settings
                </h1>
                <p className="text-white/70 text-[13px] mt-1">
                  Manage your professional identity and expertise areas
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", duration: 0.3, ease: "back.out(2)" })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, boxShadow: "none", duration: 0.3, ease: "power2.out" })}
                onClick={(e) => {
                  gsap.fromTo(e.currentTarget, { scale: 0.95 }, { scale: 1.05, duration: 0.4, ease: "elastic.out(1, 0.3)" })
                  void loadProfile()
                }}
                disabled={loading || saving}
                className="flex items-center gap-2 text-[13px] font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-2xl transition-colors"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Reload
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 pb-10">
          <div className="flex-[2] space-y-6">
            {/* Identity Card */}
            <div className="section-card bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.04)] hover:border-[#6366f1]/30 transition-colors">
              <div className="flex items-start gap-5 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#4338ca] flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-[#4f46e5]/30">
                    {displayInitial}
                  </div>
                  <button
                    type="button"
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.15, rotation: 15, duration: 0.4, ease: "back.out(2)" })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, rotation: 0, duration: 0.4, ease: "power2.out" })}
                    onClick={(e) => gsap.fromTo(e.currentTarget, { scale: 0.8 }, { scale: 1.15, duration: 0.5, ease: "elastic.out(1, 0.3)" })}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-[#4f46e5] rounded-xl flex items-center justify-center shadow-md border border-slate-100"
                    aria-label="Edit avatar"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
                <div className="mt-2">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Professional Identity
                  </h2>
                  <p className="text-sm text-slate-500">
                    How you appear to students seeking guidance.
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
                        <User size={16} className="text-[#6366f1]" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => handleChange("full_name", e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all hover:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Calendar size={16} className="text-[#6366f1]" />
                        Year of Birth
                      </label>
                      <input
                        type="date"
                        value={profileData.yob}
                        onChange={(e) => handleChange("yob", e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Building2 size={16} className="text-[#6366f1]" />
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={profileData.company}
                        placeholder="e.g. Google, FPT Software"
                        onChange={(e) => handleChange("company", e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all hover:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Target size={16} className="text-[#6366f1]" />
                        Industry Focus
                      </label>
                      <input
                        type="text"
                        value={profileData.industry_focus}
                        placeholder="e.g. Software Engineering, Data Science"
                        onChange={(e) => handleChange("industry_focus", e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all hover:bg-white"
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="mb-2 flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Book size={16} className="text-[#6366f1]" />
                      Professional Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      placeholder="Share your experience and how you can help students..."
                      onChange={(e) => handleChange("bio", e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-900 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all hover:bg-white resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "back.out(2)", backgroundColor: "#f1f5f9" })}
                      onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out", backgroundColor: "transparent" })}
                      onClick={(e) => {
                        gsap.fromTo(e.currentTarget, { scale: 0.95 }, { scale: 1.05, duration: 0.4, ease: "elastic.out(1, 0.3)" })
                        void loadProfile()
                      }}
                      disabled={saving}
                      className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-50 px-4 py-2.5 rounded-xl"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, y: -2, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)", duration: 0.3, ease: "back.out(2)" })}
                      onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)", duration: 0.3, ease: "power2.out" })}
                      onClick={(e) => {
                        gsap.fromTo(e.currentTarget, { scale: 0.9 }, { scale: 1.05, duration: 0.5, ease: "elastic.out(1, 0.3)" })
                        handleSave()
                      }}
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#4f46e5] text-white rounded-xl text-[13px] font-bold shadow-md shadow-[#4f46e5]/20 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="section-card bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] hover:border-[#6366f1]/30 transition-colors">
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
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, y: -2, duration: 0.3, ease: "back.out(2)" })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" })}
                    onClick={(e) => gsap.fromTo(e.currentTarget, { scale: 0.8 }, { scale: 1.1, duration: 0.4, ease: "elastic.out(1, 0.3)" })}
                    className="text-[#6366f1] hover:text-[#4f46e5] bg-white p-2 rounded-lg shadow-sm border border-slate-200"
                    aria-label="Edit email"
                  >
                    <Edit3 size={15} />
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

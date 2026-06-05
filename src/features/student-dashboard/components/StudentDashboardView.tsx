import { useState } from "react"
import { Bot, LayoutDashboard, Map, TrendingUp } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { DashboardUserActions, Logo } from "@/components"
import robotHead from "@/assets/robot/head.png"
import { useStudentSetup } from "../hooks"
import {
  AiMentorHistoryWidget,
  MarketDemandWidget,
  MentorFeedbackWidget,
  PriorityLearningWidget,
  RoadmapProgressWidget,
  SkillComparisonWidget,
  SkillGapsWidget,
  StudentWelcomeHeader
} from "./StudentDashboardWidgets"
import StudentProfileSetupModal from "./StudentProfileSetupModal"
import StudentSkillSelectionModal from "./StudentSkillSelectionModal"

const studentSections = [
  { id: "overview", label: "Overview" },
  { id: "roadmap", label: "Roadmap Progress" },
  { id: "skill-gaps", label: "Skill Gaps" },
  { id: "market-demand", label: "Market Demand" },
  { id: "mentor-feedback", label: "Mentor Feedback" },
  { id: "skill-comparison", label: "Skill Comparison" },
  { id: "priority-learning", label: "Priority Learning" }
]

export default function StudentDashboardView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { activeSetupStep, openSkillSelection, completeSetup } = useStudentSetup(user?.id)

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { label: "My Roadmap", icon: Map, path: ROUTES.STUDENT_ROADMAP || "/roadmap/student" },
    { label: "AI Mentor", icon: Bot, path: ROUTES.AI_MENTOR },
    { label: "Market Pulse", icon: TrendingUp, path: "/market" }
  ]

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pb-20 font-sans text-slate-900">
      <nav className="sticky top-0 z-40 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 md:px-8">
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
      <main className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-8 px-4 py-8 md:px-8 xl:grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-[220px_minmax(0,860px)_260px]">
        <aside className="hidden xl:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-hidden">
            <p className="mb-4 text-[13px] font-medium text-slate-400">Sections</p>
            <nav className="space-y-1.5">
              {studentSections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block rounded-md px-3 py-2 text-[14px] font-semibold transition-colors ${
                    index === 0
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 border-t border-slate-100 pt-5">
              <p className="mb-3 text-[13px] font-medium text-slate-300">Actions</p>
              <button
                type="button"
                onClick={() => navigate(ROUTES.AI_MENTOR)}
                className="block rounded-md px-3 py-2 text-left text-[14px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                Ask AI Mentor
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <section id="overview" className="scroll-mt-28">
            <StudentWelcomeHeader />
          </section>

          <div className="flex min-w-0 flex-col gap-5 xl:gap-6">
            <section id="roadmap" className="scroll-mt-28">
              <RoadmapProgressWidget />
            </section>
            <section id="skill-gaps" className="scroll-mt-28">
              <SkillGapsWidget />
            </section>
            <section id="market-demand" className="scroll-mt-28">
              <MarketDemandWidget />
            </section>
            <section id="mentor-feedback" className="scroll-mt-28">
              <MentorFeedbackWidget />
            </section>
            <section id="skill-comparison" className="scroll-mt-28">
              <SkillComparisonWidget />
            </section>
            <section id="priority-learning" className="scroll-mt-28">
              <PriorityLearningWidget />
            </section>
          </div>
        </div>

        <aside className="hidden 2xl:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-hidden">
            <p className="mb-4 text-[13px] font-semibold text-slate-700">On This Page</p>
            <nav className="space-y-2.5">
              {studentSections.slice(1).map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-950"
                >
                  {section.label}
                </a>
              ))}
            </nav>

            <div className="mt-10 rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-[16px] font-bold leading-snug text-slate-950">Need roadmap guidance?</h3>
              <p className="mt-3 text-[13px] leading-6 text-slate-500">
                Review mentor history and ask for the next learning move.
              </p>
              <button
                type="button"
                onClick={() => navigate(ROUTES.AI_MENTOR)}
                className="mt-5 rounded-md border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Open AI Mentor
              </button>
            </div>
          </div>
        </aside>
      </main>

      <button
        type="button"
        onClick={() => navigate(ROUTES.AI_MENTOR)}
        className="ai-mentor-float fixed bottom-5 right-4 z-50 flex h-20 w-20 items-center justify-center bg-transparent p-0 transition-all hover:-translate-y-1 sm:bottom-6 sm:right-6 sm:h-24 sm:w-24 xl:h-28 xl:w-28"
        title="Ask AI Mentor"
      >
        <img src={robotHead} alt="Ask AI Mentor" className="h-full w-full object-contain drop-shadow-xl" />
      </button>

      <StudentProfileSetupModal isOpen={activeSetupStep === "profile"} onComplete={openSkillSelection} />
      {activeSetupStep === "skills" && (
        <StudentSkillSelectionModal isOpen onComplete={completeSetup} />
      )}
    </div>
  )
}

import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { DiagonalGridBackground } from "@/components"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import robotHead from "@/assets/robot/head.png"
import { useStudentSetup } from "../hooks"
import {
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
import StudentTopNav from "./StudentTopNav"

gsap.registerPlugin(useGSAP)

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
  const dashboardRef = useRef<HTMLDivElement>(null)
  const { activeSetupStep, openSkillSelection, completeSetup } = useStudentSetup(user?.id)

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 1024px)"
      },
      (context) => {
        const conditions = context.conditions as { reduceMotion?: boolean; desktop?: boolean }
        if (conditions.reduceMotion) return

        const timeline = gsap.timeline({
          defaults: {
            duration: 0.58,
            ease: "power3.out"
          }
        })

        timeline
          .from(".student-gsap-sidebar", {
            x: conditions.desktop ? -22 : 0,
            y: conditions.desktop ? 0 : 16,
            autoAlpha: 0
          })
          .from(".student-gsap-card", {
            y: 28,
            autoAlpha: 0,
            stagger: 0.08
          }, "-=0.22")
          .from(".student-gsap-right", {
            x: 20,
            autoAlpha: 0
          }, "-=0.45")

        gsap.to(".student-gsap-robot", {
          y: -8,
          rotation: 2.5,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        })
      }
    )

    return () => media.revert()
  }, { scope: dashboardRef })

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div ref={dashboardRef} className="relative min-h-screen overflow-hidden bg-[#f9fafb] pb-20 pt-[74px] font-sans text-slate-900">
      <DiagonalGridBackground />

      <StudentTopNav
        user={user}
        onLogout={handleLogout}
        onOpenAiMentor={() => navigate(ROUTES.AI_MENTOR)}
      />

      <main className="relative z-10 mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-8 px-4 py-8 md:px-8 xl:grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-[220px_minmax(0,860px)_260px]">
        <aside className="student-gsap-sidebar hidden xl:block">
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
                className="block cursor-pointer rounded-md px-3 py-2 text-left text-[14px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                Ask AI Mentor
              </button>
            </div>
          </div>
        </aside>

        <div className="student-gsap-main min-w-0">
          <section id="overview" className="student-gsap-card scroll-mt-28">
            <StudentWelcomeHeader />
          </section>

          <div className="flex min-w-0 flex-col gap-5 xl:gap-6">
            <section id="roadmap" className="student-gsap-card scroll-mt-28">
              <RoadmapProgressWidget />
            </section>
            <section id="skill-gaps" className="student-gsap-card scroll-mt-28">
              <SkillGapsWidget />
            </section>
            <section id="market-demand" className="student-gsap-card scroll-mt-28">
              <MarketDemandWidget />
            </section>
            <section id="mentor-feedback" className="student-gsap-card scroll-mt-28">
              <MentorFeedbackWidget />
            </section>
            <section id="skill-comparison" className="student-gsap-card scroll-mt-28">
              <SkillComparisonWidget />
            </section>
            <section id="priority-learning" className="student-gsap-card scroll-mt-28">
              <PriorityLearningWidget />
            </section>
          </div>
        </div>

        <aside className="student-gsap-right hidden 2xl:block">
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
                className="mt-5 cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-900 transition-colors hover:bg-slate-50"
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
        className="ai-mentor-float student-gsap-robot fixed bottom-5 right-4 z-50 flex h-20 w-20 cursor-pointer items-center justify-center bg-transparent p-0 transition-all hover:-translate-y-1 sm:bottom-6 sm:right-6 sm:h-24 sm:w-24 xl:h-28 xl:w-28"
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

import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { useStudentSetup } from "../hooks"
import {
  StudentWelcomeHeader,
  CurrentProgressBanner,
  ActionableListWidget,
  QuickStatsWidget,
  MarketDemandChartWidget,
  SkillRadarChartWidget
} from "./StudentDashboardWidgets"
import { SharedAppBackground } from "@/components"
import StudentProfileSetupModal from "./StudentProfileSetupModal"
import StudentSkillSelectionModal from "./StudentSkillSelectionModal"
import StudentHeader from "./StudentHeader"

gsap.registerPlugin(useGSAP)

export default function StudentDashboardView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dashboardRef = useRef<HTMLDivElement>(null)
  const { activeSetupStep, isInitializing, openSkillSelection, completeSetup } = useStudentSetup(user?.id)

  useGSAP(() => {
    if (!isInitializing && activeSetupStep === null) {
      // Minimalist staggered fade up
      gsap.from(".anim-block", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }, { scope: dashboardRef, dependencies: [isInitializing, activeSetupStep] })

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div ref={dashboardRef} className="relative min-h-[100dvh] overflow-x-hidden bg-transparent pb-32 pt-[120px] font-sans text-slate-900 selection:bg-black/10">
      <SharedAppBackground />
      
      {/* We keep the Header but maybe make it solid white to blend in */}
      <StudentHeader
        user={user}
        onLogout={handleLogout}
        onOpenAiMentor={() => navigate(ROUTES.AI_MENTOR)}
      />

      <main className="mx-auto w-full max-w-[1300px] px-5 py-8 md:px-10 lg:py-12">
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mb-4"></div>
            <p className="text-sm font-bold">Preparing your learning space...</p>
          </div>
        ) : activeSetupStep === null ? (
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            {/* Left Column (Main Content) */}
            <div className="flex-1 w-full min-w-0">
              <div className="anim-block">
                <StudentWelcomeHeader />
              </div>
              
              <div className="anim-block">
                <CurrentProgressBanner />
              </div>
              
              <div className="anim-block">
                <ActionableListWidget />
              </div>
            </div>

            {/* Right Column (Sidebar Statistics) */}
            <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col">
              <div className="anim-block">
                <QuickStatsWidget />
              </div>

              <div className="anim-block mt-4">
                <MarketDemandChartWidget />
              </div>

              <div className="anim-block">
                <SkillRadarChartWidget />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to InteliPath</h2>
            <p className="text-slate-500 max-w-md mx-auto">Please complete your profile and select your skills to unlock your personalized learning dashboard.</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <StudentProfileSetupModal isOpen={activeSetupStep === "profile"} onComplete={openSkillSelection} />
      {activeSetupStep === "skills" && (
        <StudentSkillSelectionModal isOpen onComplete={completeSetup} />
      )}
    </div>
  )
}

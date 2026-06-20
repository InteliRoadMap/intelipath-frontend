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
  const { activeSetupStep, openSkillSelection, completeSetup } = useStudentSetup(user?.id)

  useGSAP(() => {
    // Minimalist staggered fade up
    gsap.from(".anim-block", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: dashboardRef })

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
      </main>

      {/* Modals */}
      <StudentProfileSetupModal isOpen={activeSetupStep === "profile"} onComplete={openSkillSelection} />
      {activeSetupStep === "skills" && (
        <StudentSkillSelectionModal isOpen onComplete={completeSetup} />
      )}
    </div>
  )
}

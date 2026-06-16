import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { DiagonalGridBackground } from "@/components"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { UserHeaderActions, Logo } from "@/components"
import robotHead from "@/assets/robot/head.png"
import { useStudentSetup } from "../hooks"
import {
  MarketDemandWidget,
  RoadmapProgressWidget,
  SkillComparisonWidget,
  SkillGapsWidget,
  StudentWelcomeHeader
} from "./StudentDashboardWidgets"
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
    // Bento Grid Entrance Animation
    gsap.from(".bento-item", {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.1
    });

    // Floating Robot Animation
    gsap.to(".student-gsap-robot", {
      y: -10,
      rotation: 3,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  }, { scope: dashboardRef })

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div ref={dashboardRef} className="relative min-h-screen overflow-x-hidden bg-[#f8fafc] pb-24 pt-[74px] font-sans text-slate-900">
      <DiagonalGridBackground />

      <StudentHeader
        user={user}
        onLogout={handleLogout}
        onOpenAiMentor={() => navigate(ROUTES.AI_MENTOR)}
      />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        
        {/* Header Section */}
        <section className="bento-item mb-8">
          <StudentWelcomeHeader />
        </section>

        {/* Streamlined 4-Widget Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr">
          
          {/* Row 1: Roadmap (with Priority) & Market Demand */}
          <div className="bento-item md:col-span-8">
            <RoadmapProgressWidget />
          </div>
          <div className="bento-item md:col-span-4">
            <MarketDemandWidget />
          </div>

          {/* Row 2: Skills Analysis (Radar & Paginated Table) */}
          <div className="bento-item md:col-span-5">
            <SkillComparisonWidget />
          </div>
          <div className="bento-item md:col-span-7">
            <SkillGapsWidget />
          </div>

        </div>
      </main>

      {/* Floating AI Mentor Button */}
      <button
        type="button"
        onClick={() => navigate(ROUTES.AI_MENTOR)}
        className="ai-mentor-float student-gsap-robot fixed bottom-5 right-4 z-50 flex h-20 w-20 cursor-pointer items-center justify-center bg-transparent p-0 transition-all hover:-translate-y-1 sm:bottom-6 sm:right-6 sm:h-24 sm:w-24 xl:h-28 xl:w-28 drop-shadow-2xl hover:drop-shadow-[0_10px_25px_rgba(0,131,143,0.35)]"
        title="Ask AI Mentor"
      >
        <img src={robotHead} alt="Ask AI Mentor" className="h-full w-full object-contain" />
      </button>

      {/* Modals */}
      <StudentProfileSetupModal isOpen={activeSetupStep === "profile"} onComplete={openSkillSelection} />
      {activeSetupStep === "skills" && (
        <StudentSkillSelectionModal isOpen onComplete={completeSetup} />
      )}
    </div>
  )
}

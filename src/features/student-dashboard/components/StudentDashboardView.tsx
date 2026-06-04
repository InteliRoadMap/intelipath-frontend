import { useState } from "react"
import { Bot, LayoutDashboard, Map, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { DashboardUserActions, Logo } from "@/components"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
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

export default function StudentDashboardView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false)
  const { activeSetupStep, openSkillSelection, completeSetup } = useStudentSetup(user?.id)

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pb-20 font-sans text-slate-900">
      <nav className="sticky top-0 z-40 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 md:px-8">
        <div className="flex items-center gap-6 md:gap-12">
          <Logo hideIcon className="scale-90 origin-left" />

          <div className="hidden items-center gap-8 text-[13px] font-bold text-slate-500 lg:flex">
            <a href="#" className="flex items-center gap-2 border-b-[3px] border-[#00838f] py-4 -mb-3.5 text-[#00838f] transition-colors">
              <LayoutDashboard size={16} />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-2 py-4 -mb-3.5 transition-colors hover:text-slate-800">
              <Map size={16} />
              My Roadmap
            </a>
            <a href="#" className="flex items-center gap-2 py-4 -mb-3.5 transition-colors hover:text-slate-800">
              <Bot size={16} />
              AI Mentor
            </a>
            <a href="#" className="flex items-center gap-2 py-4 -mb-3.5 transition-colors hover:text-slate-800">
              <TrendingUp size={16} />
              Market Pulse
            </a>
          </div>
        </div>

        <DashboardUserActions user={user} onLogout={handleLogout} />
      </nav>

      <main className="mx-auto max-w-[1440px] px-4 pt-6 md:px-6 xl:px-8">
        <StudentWelcomeHeader />

        <div className="flex min-w-0 flex-col gap-5 xl:gap-6">
          <RoadmapProgressWidget />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
            <SkillGapsWidget />
            <MarketDemandWidget />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:gap-6">
            <MentorFeedbackWidget />
            <SkillComparisonWidget />
          </div>
          <PriorityLearningWidget />
        </div>
      </main>

      <button
        type="button"
        onClick={() => setIsAiMentorOpen(true)}
        className="ai-mentor-float fixed bottom-5 right-4 z-50 flex h-20 w-20 items-center justify-center bg-transparent p-0 transition-all hover:-translate-y-1 sm:bottom-6 sm:right-6 sm:h-24 sm:w-24 xl:h-28 xl:w-28"
        title="Ask AI Mentor"
      >
        <img src={robotHead} alt="Ask AI Mentor" className="h-full w-full object-contain drop-shadow-xl" />
      </button>

      {isAiMentorOpen && (
        <>
          <button
            type="button"
            aria-label="Close AI Mentor"
            onClick={() => setIsAiMentorOpen(false)}
            className="fixed inset-0 z-[60] bg-slate-950/25 backdrop-blur-[1px]"
          />
          <aside className="fixed inset-x-3 bottom-3 top-20 z-[70] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[min(680px,calc(100vh-3rem))] sm:w-[420px]">
            <AiMentorHistoryWidget onClose={() => setIsAiMentorOpen(false)} />
          </aside>
        </>
      )}

      <StudentProfileSetupModal isOpen={activeSetupStep === "profile"} onComplete={openSkillSelection} />
      <StudentSkillSelectionModal isOpen={activeSetupStep === "skills"} onComplete={completeSetup} />
    </div>
  )
}

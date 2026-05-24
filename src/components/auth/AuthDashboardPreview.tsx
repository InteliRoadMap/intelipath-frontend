import {
  BookOpen,
  Trophy,
  Lock,
  Layout,
  Database,
  MonitorPlay,
  Cpu
} from "lucide-react"
import { SkillGapCard } from "../common/SkillGapCard"

type AuthPreviewProps = {
  mentorText?: string
}

export const AuthPreview = ({
  mentorText = "Create your account and let AI guide your engineering journey from day one."
}: AuthPreviewProps) => {
  return (
    // 1. TĂNG w-[60%] LÊN w-[68%] (hoặc w-[70%]) ĐỂ MỞ RỘNG KHUNG PHẢI
    <div className="w-full bg-bg h-full overflow-y-auto no-scrollbar px-10 py-8 relative">
      {/* Floating Sidebar */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
        <button className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-colors">
          <BookOpen size={18} />
          <span className="text-[9px] mt-1 font-medium">Learn</span>
        </button>

        <button className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-colors">
          <span className="text-primary mb-0.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </span>
          <span className="text-[9px] font-medium text-primary">Track</span>
        </button>

        <button className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-colors">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-400"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span className="text-[9px] mt-1 font-medium">Improve</span>
        </button>

        <button className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-colors">
          <Trophy size={18} className="text-orange-400" />
          <span className="text-[9px] mt-1 font-medium">Achieve</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8 max-w-lg mx-auto">
        <div className="text-primary font-semibold mb-1">InteliPath</div>
        <h2 className="text-xl font-bold text-text-dark">
          AI-Powered Career Guidance
        </h2>
        <div className="text-lg font-medium mb-1">
          for <span className="text-primary">Software Engineering</span>{" "}
          Students
        </div>
        <p className="text-gray-500 text-xs">
          Your personalized roadmap to learn, grow and build your dream career.
        </p>
      </div>

      {/* Dashboard Grid */}
      {/* 2. GIẢM pr-10 XUỐNG pr-4 ĐỂ CÁC CARD TRÀN RA SÁT THANH MENU HƠN */}
      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto pr-4 pb-8">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          {/* Skill Progress */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
            <h3 className="text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider">
              Skill Progress
            </h3>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center justify-center relative w-18 h-18 shrink-0">
                <div className="w-full h-full rounded-full border-4 border-gray-100 border-t-primary border-r-primary flex items-center justify-center transform -rotate-45">
                  <div className="transform rotate-45 flex flex-col items-center">
                    <span className="font-bold text-lg text-primary">75%</span>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-gray-400 mt-1">
                  Overall
                </span>
              </div>

              <div className="grow space-y-2">
                {[
                  { label: "Frontend", val: 60 },
                  { label: "Backend", val: 70 },
                  { label: "Database", val: 60 },
                  { label: "DevOps", val: 65 },
                  { label: "System Design", val: 50 }
                ].map((skill) => (
                  <div key={skill.label} className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-600 w-20">
                      {skill.label}
                    </span>
                    <div className="grow bg-gray-100 rounded-full h-1">
                      <div
                        className="bg-primary h-1 rounded-full"
                        style={{ width: `${skill.val}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 w-6 text-right">
                      {skill.val}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SkillGapCard />

          {/* Recommended */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
            <h3 className="text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider">
              Recommended For You
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                  <Layout size={14} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-dark">
                    System Design Basics
                  </div>
                  <div className="text-[10px] text-gray-500">12 lessons</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <Database size={14} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-dark">
                    Database Indexing
                  </div>
                  <div className="text-[10px] text-gray-500">8 lessons</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <MonitorPlay size={14} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-dark">
                    Docker Fundamentals
                  </div>
                  <div className="text-[10px] text-gray-500">10 lessons</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">
          {/* roadmap */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Your Learning Roadmap
              </h3>
              <span className="text-primary font-bold text-xs">68%</span>
            </div>

            <div className="relative flex justify-between px-2 mb-2">
              <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-blue-100"></div>
              <div className="absolute top-2.5 left-4 w-1/2 h-0.5 bg-primary"></div>

              {["Fundamentals", "Frontend", "Backend"].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center z-10 gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white shadow-sm">
                    ✓
                  </div>
                  <span className="text-[9px] text-gray-500 text-center">
                    {item}
                  </span>
                </div>
              ))}

              {["DevOps", "System Design"].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center z-10 gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                    <Lock size={10} />
                  </div>
                  <span className="text-[9px] text-gray-400 text-center">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Career */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center">
            <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider w-full text-center">
              Career Recommendation
            </h3>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary mb-2">
              💼
            </div>
            <h4 className="font-bold text-sm text-text-dark">
              Backend Developer
            </h4>
            <div className="text-primary font-bold text-xs mt-0.5">
              95% Match
            </div>
          </div>

          {/* AI Mentor */}
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary relative shrink-0">
              <Cpu size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></div>
            </div>
            {/* Cập nhật lại chuỗi chữ AI Mentor trùng khớp với UI mockup */}
            <p className="text-primary text-[11px] font-medium leading-relaxed">
              {mentorText}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

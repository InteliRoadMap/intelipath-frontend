import {
  FaBrain,
  FaBriefcase,
  FaCheck,
  FaCloud,
  FaCode,
  FaDatabase,
  FaLaptopCode,
  FaRobot,
} from "react-icons/fa"

// Sample data for skill progress and roadmap steps
const skillBars = [
  { name: "Frontend", val: "80%", bg: "w-[80%]" },
  { name: "Backend", val: "70%", bg: "w-[70%]" },
  { name: "Database", val: "60%", bg: "w-[60%]" },
  { name: "DevOps", val: "65%", bg: "w-[65%]" },
  { name: "System Design", val: "50%", bg: "w-[50%]" },
]

const roadmapSteps = [
  { icon: <FaCode />, title: "Fundamentals", done: true },
  { icon: <FaLaptopCode />, title: "Frontend", done: true },
  { icon: <FaDatabase />, title: "Backend", done: true },
  { icon: <FaCloud />, title: "DevOps", done: false },
  { icon: <FaBrain />, title: "System Design", done: false },
]
//
function AuthDashboardPreview() {
  return (
    <div className="hidden lg:flex min-h-screen bg-linear-to-br from-[rgb(190,211,244)] to-[#cbdff7] flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>
      <div className="w-full max-w-4xl mx-auto text-center mb-8 z-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-500"></div>
          <h2 className="text-3xl font-bold text-[#12306b]">IntelliPath</h2>
        </div>

        <h1 className="text-4xl font-bold text-[#17326b] leading-tight mb-4">
          AI-Powered Career Guidance
          <br />
          for{" "}
          <span className="text-[#1d75ff]">
            Software Engineering Students
          </span>
        </h1>

        <p className="text-gray-500 text-base">
          Your personalized roadmap to learn, grow and
          <br />
          build your dream career.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5 w-full max-w-4xl mx-auto z-10">
        <div className="col-span-5 bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4">
              SKILL PROGRESS
            </h3>
            <div className="relative flex items-center justify-center my-2">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  stroke="#edf4ff"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - 0.75)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800">75%</span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Overall
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 text-[11px] text-gray-500 font-medium">
            {skillBars.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="w-20 text-gray-600">{item.name}</span>
                <div className="flex-1 h-1.5 bg-blue-50 rounded-full mx-2 overflow-hidden">
                  <div
                    className={`h-full bg-blue-500 rounded-full ${item.bg}`}
                  ></div>
                </div>
                <span className="w-8 text-right text-gray-400">
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-7 bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
          <div className="flex justify-between items-center mb-7">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider">
              YOUR LEARNING ROADMAP
            </h3>
            <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1.5 rounded-full">
              68%
            </span>
          </div>

          <div className="flex items-center justify-between relative px-2 py-5">
            <div className="absolute top-12 left-8 right-8 h-1 bg-blue-100 z-0"></div>
            <div className="absolute top-12 left-8 w-[60%] h-1 bg-cyan-400 z-0"></div>

            {roadmapSteps.map((step) => (
              <div
                key={step.title}
                className="flex flex-col items-center flex-1 z-10 relative"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center border-2 transition-colors shadow-sm text-lg ${
                    step.done
                      ? "bg-white border-blue-500 text-blue-500"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-[11px] font-semibold text-gray-600 text-center mt-3 wrap-break-word max-w-19.5">
                  {step.title}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-2 ${
                    step.done
                      ? "bg-emerald-400 text-white"
                      : "border-2 border-gray-200 bg-white"
                  }`}
                >
                  {step.done && <FaCheck className="text-[9px]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-4 w-full text-left">
            CAREER RECOMMENDATION
          </h3>
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 text-xl shadow-inner mb-3">
            <FaBriefcase />
          </div>
          <h4 className="text-md font-bold text-gray-800">
            Backend Developer
          </h4>
          <p className="text-blue-500 text-xs font-bold mt-1">95% Match</p>

          <div className="w-32 h-1.5 bg-blue-100 rounded-full mt-3 overflow-hidden">
            <div className="w-[95%] h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>

        <div className="col-span-7 bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between relative overflow-hidden">
          <div className="flex flex-col justify-center space-y-2 z-10 max-w-[60%]">
            <div className="bg-[#f0f6ff] text-gray-700 rounded-2xl p-3 text-xs leading-relaxed shadow-sm relative border border-blue-50">
              <span className="font-bold block text-gray-800 mb-0.5">
                Hi! I'm your AI Mentor.
              </span>
              I'll help you navigate your learning journey.
              <div className="absolute bottom-3 -right-2 w-3 h-3 bg-[#f0f6ff] border-r border-b border-blue-50 -rotate-45"></div>
            </div>
          </div>

          <div className="w-32 h-32 flex items-center justify-center bg-linear-to-b from-blue-50 to-white rounded-full border border-blue-100 shadow-sm relative">
            <FaRobot className="text-5xl text-blue-500 animate-bounce" />
            <div className="absolute bottom-2 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              AI
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthDashboardPreview

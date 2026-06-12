<<<<<<< HEAD
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  FileText,
  Info,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  Plus,
  Send,
  Trash2
} from "lucide-react"
import { GithubLogo } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import robotHead from "@/assets/robot/head.png"
import StudentTopNav from "@/features/student-dashboard/components/StudentTopNav"

gsap.registerPlugin(useGSAP)
=======
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { DashboardUserActions, Logo } from "@/components"
import { 
  Bot, 
  MessageSquare, 
  Plus, 
  MoreHorizontal, 
  Send, 
  Paperclip, 
  PanelLeftClose, 
  PanelLeftOpen, 
  ChevronRight,
  Info,
  Trash2,
  TrendingUp,
  LayoutDashboard,
  Map
} from "lucide-react"
import robotImg from "@/assets/robot/head.png"
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba

export default function AIMentorPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
<<<<<<< HEAD
  const mentorRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [inputError, setInputError] = useState("")
=======
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState("")
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

<<<<<<< HEAD
  const handleSubmit = () => {
    if (!inputValue.trim()) {
      setInputError("Enter a question before sending.")
      return
    }

    setInputError("Mentor responses will appear after backend AI endpoints are connected.")
  }

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 768px)"
      },
      (context) => {
        const conditions = context.conditions as { reduceMotion?: boolean; desktop?: boolean }
        if (conditions.reduceMotion) return

        gsap.from(".ai-mentor-panel", {
          y: 18,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out"
        })

        gsap.to(".ai-mentor-robot", {
          y: conditions.desktop ? -7 : -4,
          rotation: 2,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        })
      }
    )

    return () => media.revert()
  }, { scope: mentorRef })

  return (
    <div ref={mentorRef} className="flex h-screen flex-col overflow-hidden bg-white pt-[74px] font-sans text-slate-900">
      <StudentTopNav
        user={user}
        onLogout={handleLogout}
        onOpenAiMentor={() => undefined}
      />

      <main className="relative flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={`shrink-0 border-r border-slate-200 bg-slate-50 transition-all duration-300 ${
=======
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { label: "My Roadmap", icon: Map, path: ROUTES.DASHBOARD_STUDENT_ROADMAP || "/roadmap/student" },
    { label: "AI Mentor", icon: Bot, path: ROUTES.AI_MENTOR },
    { label: "Market Pulse", icon: TrendingUp, path: "/market" }
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-slate-900 font-sans">
      <nav className="shrink-0 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 md:px-8">
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

      <main className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR (ChatGPT Style) */}
        <aside 
          className={`flex-shrink-0 flex flex-col bg-slate-50 border-r border-slate-200 transition-all duration-300 ${
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
            isSidebarOpen ? "w-80" : "w-0 overflow-hidden"
          }`}
        >
          {isSidebarOpen && (
<<<<<<< HEAD
            <div className="flex h-full w-80 flex-col p-3">
              <button
                type="button"
                disabled
                className="mb-5 flex w-full cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-400 shadow-sm"
              >
                <Plus size={20} className="text-[#00838f]" />
=======
            <div className="flex flex-col h-full w-80 p-3">
              {/* New Chat Button */}
              <button className="flex items-center gap-2 w-full bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800 px-4 py-3 rounded-xl shadow-sm font-semibold transition-colors mb-5">
                <Plus size={20} className="text-brand-blue" />
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
                <span className="flex-1 text-left text-base">New chat</span>
                <MessageSquare size={18} className="text-slate-400" />
              </button>

<<<<<<< HEAD
              <div className="-mr-2 flex-1 overflow-y-auto overflow-x-hidden pr-2">
                <h3 className="mb-3 px-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Conversations
                </h3>
                <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
                  <MessageSquare className="mx-auto mb-3 text-slate-300" size={26} />
                  <p className="text-sm font-semibold text-slate-700">No AI mentor history yet</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Saved conversations will appear after backend stores chat sessions.
                  </p>
=======
              {/* Chat History List */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden -mr-2 pr-2">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Today</h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl bg-slate-200/50 text-slate-900 font-semibold text-base group">
                    <span className="truncate pr-2">Backend Subject Analysis</span>
                    <MoreHorizontal size={18} className="opacity-0 group-hover:opacity-100 text-slate-500" />
                  </button>
                  <button className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl hover:bg-slate-200/50 text-slate-600 font-medium text-base group transition-colors">
                    <span className="truncate pr-2">Spring Boot vs Node.js</span>
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-3 px-2">Previous 7 Days</h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl hover:bg-slate-200/50 text-slate-600 font-medium text-base group transition-colors">
                    <span className="truncate pr-2">Resume Review</span>
                  </button>
                  <button className="w-full flex items-center justify-between text-left px-3 py-3 rounded-xl hover:bg-slate-200/50 text-slate-600 font-medium text-base group transition-colors">
                    <span className="truncate pr-2">Interview Preparation</span>
                  </button>
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
                </div>
              </div>
            </div>
          )}
        </aside>

<<<<<<< HEAD
        <section className="relative flex min-w-0 flex-1 flex-col bg-white">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((current) => !current)}
                className="mr-1 cursor-pointer text-slate-500 transition-colors hover:text-slate-800"
=======
        {/* MAIN CHAT AREA */}
        <section className="flex-1 flex flex-col min-w-0 bg-white relative">
          
          {/* Header of Chat Area */}
          <header className="flex-shrink-0 h-14 border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-slate-500 hover:text-slate-800 transition-colors mr-1"
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
<<<<<<< HEAD
              <div className="relative h-9 w-9 shrink-0">
                <img src={robotHead} alt="AI Mentor" className="ai-mentor-robot h-full w-full object-contain drop-shadow-md" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold leading-tight text-slate-900">AI Virtual Mentor</h2>
                <p className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  Waiting for mentor data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <button type="button" disabled className="cursor-not-allowed text-slate-300" title="Information">
                <Info size={20} />
              </button>
              <button type="button" disabled className="cursor-not-allowed text-slate-300" title="Clear chat">
                <Trash2 size={20} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto flex min-h-full w-full max-w-4xl items-center justify-center pb-4">
              <div className="ai-mentor-panel w-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-10">
                <img src={robotHead} alt="AI Mentor" className="ai-mentor-robot mx-auto h-20 w-20 object-contain drop-shadow-md" />
                <h1 className="mt-5 text-2xl font-bold text-slate-950">Ask your AI Virtual Mentor</h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  No chat history is available yet. Ask a question, upload a transcript, or provide a GitHub link once backend AI endpoints are connected.
                </p>

                <div className="mt-7 grid grid-cols-1 gap-3 text-left md:grid-cols-2">
                  <div className="flex min-h-24 cursor-not-allowed items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 opacity-85">
                    <FileText className="mt-0.5 shrink-0 text-[#00838f]" size={22} />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Transcript upload</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Upload support will connect to transcript validation later.
                      </p>
                      <input type="file" className="sr-only" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" disabled />
                    </div>
                  </div>

                  <div className="ai-mentor-panel min-h-24 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <GithubLogo className="shrink-0 text-[#00838f]" size={22} weight="duotone" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">GitHub profile</p>
                        <p className="text-xs text-slate-500">Optional context for repository review.</p>
                      </div>
                    </div>
                    <input
                      value={githubUrl}
                      onChange={(event) => setGithubUrl(event.target.value)}
                      placeholder="https://github.com/username"
                      className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs outline-none transition-colors focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/10"
                    />
=======
              <div className="relative w-9 h-9 shrink-0">
                <img src={robotImg} alt="AI Mentor" className="w-full h-full object-contain drop-shadow-md" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">AI Virtual Mentor</h2>
                <p className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                  Active • Lightning fast responses
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-400">
              <button className="hover:text-slate-700 transition-colors"><Info size={20} /></button>
              <button className="hover:text-slate-700 transition-colors"><Trash2 size={20} /></button>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            <div className="max-w-4xl mx-auto w-full space-y-8 pb-4">
              
              {/* AI Message */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 flex items-center justify-center drop-shadow-lg">
                  <img src={robotImg} alt="AI" className="w-full h-full object-contain" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-5 shadow-sm max-w-[85%] text-slate-700 text-sm md:text-base leading-relaxed">
                  <p className="mb-4">
                    Hi Minh! I'm ready to accompany you on your journey to becoming a Senior Fullstack Engineer. 🚀
                  </p>
                  <p className="mb-4">
                    Based on the latest updates, I see you've completed the <strong>Microservices with Node.js</strong> course. Would you like to:
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <button className="flex items-center gap-2 text-brand-blue hover:text-brand-cyan hover:underline font-medium text-sm transition-colors text-left">
                        <ChevronRight size={16} /> Propose next hands-on project
                      </button>
                    </li>
                    <li>
                      <button className="flex items-center gap-2 text-brand-blue hover:text-brand-cyan hover:underline font-medium text-sm transition-colors text-left">
                        <ChevronRight size={16} /> Analyze this semester's transcript to balance time
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan to-brand-blue shrink-0 flex items-center justify-center shadow-md text-white font-bold">
                  M
                </div>
                <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tr-sm p-4 shadow-sm max-w-[85%] text-sm md:text-base leading-relaxed">
                  I just uploaded my Term 2 transcript. Can you help me analyze which subjects will best support my pursuit of Backend?
                </div>
              </div>

              {/* AI Message with Attachments/Cards */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 flex items-center justify-center drop-shadow-lg">
                  <img src={robotImg} alt="AI" className="w-full h-full object-contain" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm p-5 shadow-sm max-w-[90%] text-slate-700 text-sm md:text-base leading-relaxed w-full">
                  <p className="mb-4 text-slate-500">Analyzing file: Transcript_HK2_Minh.pdf...</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    {/* Card 1 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h4 className="font-bold text-slate-900 leading-tight">Data Structures & <br/>Algorithms</h4>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <p className="text-[11px] text-slate-500">Score: 9.2/10 • Core Backend skill</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                          <TrendingUp size={18} />
                        </div>
                        <h4 className="font-bold text-slate-900 leading-tight">DBMS<br/>&nbsp;</h4>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                        <div className="bg-brand-blue h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-[11px] text-slate-500">Score: 8.5/10 • Essential for SQL/NoSQL</p>
                    </div>
                  </div>

                  <div className="bg-[#e6f4f1] border border-[#b2dfd7] rounded-lg p-4 text-sm text-[#0d5060]">
                    💡 <strong>Comment:</strong> Your results are very impressive in logic modules. I suggest you start exploring <strong>Redis or Kafka</strong> to leverage these strengths.
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
                  </div>
                </div>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="shrink-0 border-t border-slate-200 bg-white p-4">
            <div className="ai-mentor-panel mx-auto max-w-4xl">
              <div className="relative flex items-end overflow-hidden rounded-2xl border border-slate-300 bg-slate-50 shadow-sm transition-all focus-within:border-[#00838f] focus-within:ring-1 focus-within:ring-[#00838f]">
                <button type="button" disabled className="shrink-0 cursor-not-allowed p-3.5 text-slate-300" title="Attach file">
                  <Paperclip size={20} />
                </button>
                <textarea
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Ask about career, skills, or upload documents..."
                  className="max-h-32 min-h-[52px] flex-1 resize-none border-0 bg-transparent px-2 py-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 md:text-base"
                  rows={1}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="m-1.5 shrink-0 cursor-pointer rounded-xl bg-[#006064] p-2.5 text-white shadow-sm transition-colors hover:bg-[#00838f]"
=======
          {/* Input Area */}
          <div className="flex-shrink-0 p-4 bg-white border-t border-slate-200">
            <div className="max-w-4xl mx-auto relative">
              <div className="relative flex items-end shadow-sm border border-slate-300 rounded-2xl bg-slate-50 overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all">
                <button className="p-3.5 text-slate-400 hover:text-brand-blue transition-colors outline-none shrink-0" title="Attach file">
                  <Paperclip size={20} />
                </button>
                <textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about career, skills, or upload documents..."
                  className="flex-1 max-h-32 min-h-[52px] w-full bg-transparent border-0 outline-none resize-none py-3.5 px-2 text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
                  rows={1}
                />
                <button 
                  className="p-2.5 m-1.5 bg-[#006A8E] hover:bg-brand-blue text-white rounded-xl transition-colors outline-none shrink-0 shadow-sm"
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
<<<<<<< HEAD
              <p className="mt-2 text-center text-[10px] text-slate-400">
                {inputError || "AI Mentor can make mistakes. Verify important career advice."}
              </p>
            </div>
          </div>
=======
              <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">AI Mentor can make mistakes. Consider verifying important career advice.</p>
              </div>
            </div>
          </div>

>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
        </section>
      </main>
    </div>
  )
}

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

export default function AIMentorPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const mentorRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [inputError, setInputError] = useState("")

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

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
            isSidebarOpen ? "w-80" : "w-0 overflow-hidden"
          }`}
        >
          {isSidebarOpen && (
            <div className="flex h-full w-80 flex-col p-3">
              <button
                type="button"
                disabled
                className="mb-5 flex w-full cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-400 shadow-sm"
              >
                <Plus size={20} className="text-[#00838f]" />
                <span className="flex-1 text-left text-base">New chat</span>
                <MessageSquare size={18} className="text-slate-400" />
              </button>

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
                </div>
              </div>
            </div>
          )}
        </aside>

        <section className="relative flex min-w-0 flex-1 flex-col bg-white">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((current) => !current)}
                className="mr-1 cursor-pointer text-slate-500 transition-colors hover:text-slate-800"
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
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
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                {inputError || "AI Mentor can make mistakes. Verify important career advice."}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

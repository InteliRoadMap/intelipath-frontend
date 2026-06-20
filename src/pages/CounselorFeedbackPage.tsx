import { useState, useCallback, useRef, useEffect } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)
import {
  Search,
  X,
  ChevronRight,
  ArrowLeft,
  Building2,
  Briefcase,
  Mail,
  TrendingDown,
  Map,
  MessageSquare,
  Clock,
  ChevronDown,
  LayoutDashboard,
  Send,
  CheckCircle,
  Users,
  AlertCircle,
  Star,
  Sparkles,
  Check,
  MoreHorizontal
} from "lucide-react"
import {
  Briefcase as BriefcasePhos,
  BookOpen,
  ChatCenteredText,
  PaperPlaneTilt
} from "@phosphor-icons/react"
import { useNavigate, useSearchParams, NavLink } from "react-router-dom"
import { UserHeaderActions, Logo, SharedAppBackground } from "@/components"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import type { MyStudent, MissingSkillItem, Feedback } from "@/api/counselorApi"
import {
  useStudentList,
  useFeedbackHistory,
  useSendFeedback
} from "@/hooks/useCounselorFeedback"

// ─── Shared UI ───────────────────────────────────────────────────
function EmptyState({
  icon: Icon,
  label
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-slate-400">
      <Icon size={34} className="mb-3 text-slate-200" />
      <p className="text-[14px] font-medium">{label}</p>
    </div>
  )
}

// ─── Tab: Roadmap Progress (from MyAssignedStudent.roadmapProgress) ──
function FilterDropdown({
  icon: Icon,
  value,
  placeholder,
  options,
  onChange
}: {
  icon: React.ElementType
  value: string
  placeholder: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedLabel = value || placeholder

  return (
    <div className="relative min-w-[160px]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full pl-9 pr-8 py-3 text-left text-[13px] font-medium border-none rounded-xl bg-slate-100/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006064]/20 transition-all shadow-inner"
      >
        <Icon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <span className="block truncate">{selectedLabel}</span>
        <ChevronDown
          size={14}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
          <button
            type="button"
            onClick={() => {
              onChange("")
              setOpen(false)
            }}
            className={`w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
              !value
                ? "bg-[#f0fafa] text-[#006064]"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className={`mt-1 w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                value === option
                  ? "bg-[#f0fafa] text-[#006064]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RoadmapTab({ student }: { student: MyStudent }) {
  const tabRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ".roadmap-overall",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.2)" }
      )
      const bar = document.querySelector(".roadmap-overall-bar")
      if (bar) {
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${student.roadmapProgress}%`,
            duration: 1.4,
            ease: "power4.out",
            delay: 0.3
          }
        )
      }
    },
    { scope: tabRef }
  )

  const pct = student.roadmapProgress ?? 0
  const statusLabel =
    pct === 100 ? "Completed" : pct > 0 ? "In Progress" : "Not Started"
  const statusColor =
    pct === 100
      ? "text-emerald-600 bg-emerald-100"
      : pct > 0
        ? "text-[#006064] bg-[#e0f2fe]"
        : "text-slate-500 bg-slate-100"

  return (
    <div className="mt-3 space-y-5 pb-4" ref={tabRef}>
      {/* Overall progress card */}
      <div className="roadmap-overall relative overflow-hidden bg-gradient-to-br from-[#006064] to-[#00838f] text-white rounded-2xl p-7 shadow-lg shadow-[#006064]/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Map size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider">
                  Career Path
                </p>
                <span className="text-[16px] font-bold">
                  {student.careerPath || "Not assigned"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[42px] font-black tracking-tight drop-shadow-sm leading-none">
                {pct}%
              </span>
              <p className="text-white/60 text-[11px] mt-1">Overall Progress</p>
            </div>
          </div>

          <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm shadow-inner mt-5">
            <div className="roadmap-overall-bar h-full bg-gradient-to-r from-emerald-300 to-cyan-300 rounded-full shadow-[0_0_12px_rgba(110,231,183,0.6)] relative">
              <div className="absolute inset-0 bg-white/20 w-full animate-pulse rounded-full" />
            </div>
          </div>
          <p className="text-[12px] text-cyan-100 mt-2.5 font-semibold tracking-wide uppercase">
            Roadmap completion
          </p>
        </div>
      </div>

      {/* Status info card */}
      <div className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-sm">
        <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">
          Progress Summary
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-semibold text-slate-700">
              Learning Status
            </span>
            <span className="text-[12px] text-slate-400">
              {student.university}
            </span>
          </div>
          <span
            className={`text-[12px] font-bold px-4 py-1.5 rounded-full ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>

        {pct < 100 && pct > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
            <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-700">
              Student is <strong>{100 - pct}%</strong> away from completing the
              roadmap. Consider providing targeted feedback.
            </p>
          </div>
        )}

        {pct === 0 && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
            <AlertCircle size={15} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-slate-500">
              Student has not started the roadmap yet. Send an encouraging
              message!
            </p>
          </div>
        )}

        {pct === 100 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2">
            <CheckCircle
              size={15}
              className="text-emerald-500 shrink-0 mt-0.5"
            />
            <p className="text-[12px] text-emerald-700">
              Student has completed the full roadmap! Great achievement.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tab: Skill Gap (from MyAssignedStudent.missingSkills) ───────
function SkillGapTab({ skills }: { skills: MissingSkillItem[] }) {
  const tabRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (skills.length) {
        gsap.fromTo(
          ".skillgap-item",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.2)"
          }
        )
      }
    },
    { scope: tabRef, dependencies: [skills] }
  )

  if (!skills.length)
    return (
      <EmptyState
        icon={TrendingDown}
        label="No missing skills — student is on track!"
      />
    )

  return (
    <div className="space-y-4 mt-3 pb-4" ref={tabRef}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <p className="text-[13px] font-semibold text-slate-500">
          <strong className="text-slate-800">{skills.length} skills</strong>{" "}
          identified as missing
        </p>
      </div>

      {skills.map((skill: any, idx) => {
        const skillName = typeof skill === "string" ? skill : skill.skillName
        return (
          <div
            key={`${skillName}-${idx}`}
            className="skillgap-item border rounded-2xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5 bg-slate-50 border-slate-100"
          >
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-slate-900">
                {skillName}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Tab: Feedback (uses hooks: useFeedbackHistory + useSendFeedback) ─
function FeedbackTab({ student }: { student: MyStudent }) {
  const [content, setContent] = useState("")
  const [type, setType] = useState("GENERAL")
  const tabRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { feedbacks, loading, refetch } = useFeedbackHistory(student.studentId)
  const { send, sending, sent } = useSendFeedback(refetch)

  // Close dropdown on outside click
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false)
    }
  }, [])

  // Register outside-click listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClickOutside])

  useGSAP(
    () => {
      if (!loading) {
        gsap.fromTo(
          ".feedback-form",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )
        if (feedbacks.length) {
          gsap.fromTo(
            ".feedback-item",
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.2
            }
          )
        }
      }
    },
    { scope: tabRef, dependencies: [feedbacks, loading] }
  )

  const handleSend = async () => {
    await send({
      receiverId: student.studentId,
      content: content.trim(),
      type: type as "GENERAL" | "SKILL" | "CAREER"
    })
    setContent("")
  }

  const typeColor: Record<string, string> = {
    CAREER: "bg-sky-50 text-sky-600 border-sky-200",
    SKILL: "bg-emerald-50 text-emerald-600 border-emerald-200",
    GENERAL: "bg-slate-50 text-slate-500 border-slate-200"
  }

  return (
    <div className="mt-3 space-y-6 pb-4" ref={tabRef}>
      {/* Send form */}
      <div className="feedback-form border border-[#b2e4e8]/60 rounded-2xl p-5 bg-gradient-to-br from-[#f8fcfc] to-white shadow-sm hover:shadow-md transition-shadow">
        <div className="text-[14px] font-bold text-[#006064] mb-4 flex items-center gap-2">
          <div className="p-1.5 bg-[#e0f2fe] rounded-md">
            <Send size={14} className="text-[#00838f]" />
          </div>
          Send Guidance to {student.fullName}
        </div>

        {/* Type picker — Custom Rounded Dropdown */}
        <div className="relative mb-4" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl hover:border-[#00838f] focus:outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all text-[14px] font-semibold text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-center gap-2.5">
              {type === "CAREER" && (
                <BriefcasePhos
                  size={18}
                  className="text-sky-500"
                  weight="fill"
                />
              )}
              {type === "SKILL" && (
                <BookOpen
                  size={18}
                  className="text-emerald-500"
                  weight="fill"
                />
              )}
              {type === "GENERAL" && (
                <ChatCenteredText
                  size={18}
                  className="text-[#006064]"
                  weight="fill"
                />
              )}
              <span>
                {type === "CAREER"
                  ? "Career Advice"
                  : type === "SKILL"
                    ? "Skill Guidance"
                    : "General Note"}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Rounded Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-[0_15px_40px_rgba(15,23,42,0.12)] z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
              {(
                [
                  {
                    value: "CAREER",
                    label: "Career Advice",
                    icon: BriefcasePhos,
                    color: "text-sky-500",
                    bgHover: "hover:bg-sky-50"
                  },
                  {
                    value: "SKILL",
                    label: "Skill Guidance",
                    icon: BookOpen,
                    color: "text-emerald-500",
                    bgHover: "hover:bg-emerald-50"
                  },
                  {
                    value: "GENERAL",
                    label: "General Note",
                    icon: ChatCenteredText,
                    color: "text-[#006064]",
                    bgHover: "hover:bg-[#f0fafa]"
                  }
                ] as const
              ).map(({ value, label, icon: Icon, color, bgHover }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setType(value)
                    setDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold transition-colors ${bgHover} ${type === value ? "bg-slate-50 text-slate-900" : "text-slate-600"}`}
                >
                  <Icon
                    size={18}
                    className={type === value ? color : "text-slate-400"}
                    weight={type === value ? "fill" : "regular"}
                  />
                  {label}
                  {type === value && (
                    <Check
                      size={16}
                      className={`ml-auto ${color}`}
                      strokeWidth={3}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your guidance, advice, or feedback here..."
          rows={4}
          className="w-full px-4 py-3 text-[14px] border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006064]/20 focus:border-[#00838f] transition-all resize-none placeholder:text-slate-400 leading-relaxed"
        />

        <div className="flex items-center justify-between mt-3">
          <span
            className={`text-[12px] font-medium ${content.length > 450 ? "text-amber-500" : "text-slate-400"}`}
          >
            {content.length} / 500 chars
          </span>
          <button
            type="button"
            disabled={!content.trim() || sending}
            onClick={handleSend}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#006064] to-[#00838f] text-white hover:from-[#00838f] hover:to-[#00acc1] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {!sending && <Send size={16} />}
            {sending ? "Sending..." : "Send Message"}
          </button>
        </div>

        {sent && (
          <div className="flex items-center gap-2 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-[13px] font-bold">
            <CheckCircle size={18} className="text-emerald-500" />
            Feedback sent! The student will be notified.
          </div>
        )}
      </div>

      {/* Feedback history */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <MessageSquare size={16} className="text-slate-400" />
          <h3 className="text-[14px] font-bold text-slate-600 uppercase tracking-wide">
            Communication History
          </h3>
        </div>

        {loading ? (
          <div className="space-y-4"></div>
        ) : feedbacks.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            label="No communication history yet"
          />
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb) => {
              const isCounselor = fb.senderId !== student.studentId
              return (
                <div
                  key={fb.feedbackId}
                  className={`feedback-item relative border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${isCounselor ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200/60"}`}
                >
                  {isCounselor && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00838f] rounded-l-2xl" />
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold ${isCounselor ? "bg-[#e0f2fe] text-[#006064]" : "bg-slate-200 text-slate-600"}`}
                      >
                        {fb.senderName?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <span className="text-[14px] font-bold text-slate-900 block leading-none">
                          {fb.senderName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {isCounselor ? "Counselor" : "Student"}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${typeColor[fb.type] ?? typeColor.GENERAL}`}
                    >
                      {fb.type}
                    </span>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[14px] text-slate-700 leading-relaxed">
                      {fb.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-3 text-[11px] font-medium text-slate-400">
                    <Clock size={12} />
                    {new Date(fb.createAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tabs config ─────────────────────────────────────────────────
const TABS = [
  { key: "roadmap", label: "Roadmap", icon: Map },
  { key: "skillgap", label: "Skill Gap", icon: TrendingDown },
  { key: "feedback", label: "Feedback", icon: MessageSquare }
] as const

type TabKey = (typeof TABS)[number]["key"]

// ─── Student Detail Panel ─────────────────────────────────────────
function StudentDetailPanel({
  student,
  defaultTab = "roadmap",
  onClose
}: {
  student: MyStudent
  defaultTab?: TabKey
  onClose: () => void
}) {
  const [tab, setTab] = useState<TabKey>(defaultTab)
  const fullName = student.fullName || "Unknown Student"
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "UN"
  const panelRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from(".panel-content", {
        x: 64,
        opacity: 0,
        duration: 0.4,
        ease: "power3.out"
      })
    },
    { scope: panelRef }
  )

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
      ref={panelRef}
    >
      <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[1px]" />
      <aside
        className="panel-content relative z-10 w-full max-w-[720px] h-full bg-white shadow-2xl flex flex-col rounded-l-[20px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="relative shrink-0 border-b border-slate-100 bg-white">
          <div className="h-[100px] bg-gradient-to-r from-[#006064] to-[#00838f] overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/25 backdrop-blur-sm text-white flex items-center justify-center transition-all shadow-sm hover:scale-105"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 pb-5">
            <div className="flex gap-4">
              <div className="-mt-10 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] text-[#006064] flex items-center justify-center text-[24px] font-black shadow-inner">
                    {initials}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h2 className="text-[20px] font-black text-slate-900 truncate leading-tight">
                      {fullName}
                    </h2>
                    <p className="text-[13px] font-medium text-slate-500 truncate flex items-center gap-1.5 mt-1">
                      <Mail size={13} className="text-slate-400" />
                      {student.university || "No university"}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#e0f2fe] to-[#f0f9ff] text-[#0284c7] rounded-lg text-[12px] font-bold border border-[#bae6fd]/50 shadow-sm shrink-0">
                    <Briefcase size={12} className="text-[#0ea5e9]" />
                    {student.careerPath}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] text-slate-600 rounded-lg text-[12px] font-medium border border-slate-200/80 shadow-sm">
                <Building2 size={13} className="text-slate-400" />
                {student.university}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] text-slate-600 rounded-lg text-[12px] font-medium border border-slate-200/80 shadow-sm">
                <Map size={13} className="text-slate-400" />
                {student.roadmapProgress}% progress
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[12px] font-medium border border-rose-100 shadow-sm">
                <TrendingDown size={13} />
                {student.missingSkills?.length ?? 0} missing skills
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full px-5 border-b border-slate-200 bg-white shrink-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key
                  ? "text-[#006064] border-[#006064]"
                  : "text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "roadmap" && <RoadmapTab student={student} />}
          {tab === "skillgap" && (
            <SkillGapTab skills={student.missingSkills ?? []} />
          )}
          {tab === "feedback" && <FeedbackTab student={student} />}
        </div>
      </aside>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function CounselorFeedbackPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const autoOpenStudentId =
    searchParams.get("studentId") || searchParams.get("userId")
  const defaultTab = (searchParams.get("tab") as TabKey) || "feedback"

  const [search, setSearch] = useState("")
  const [filterUni, setFilterUni] = useState("")
  const [filterCareer, setFilterCareer] = useState("")
  const [selected, setSelected] = useState<MyStudent | null>(null)

  // ── Data from hook ──────────────────────────────────────────────
  const { students, loading } = useStudentList()

  const uniqueUnis = Array.from(
    new Set(students.map((s) => s.university).filter(Boolean))
  )
  const uniqueCareers = Array.from(
    new Set(students.map((s) => s.careerPath).filter(Boolean))
  )

  // Auto-open from dashboard link
  useEffect(() => {
    if (autoOpenStudentId && students.length > 0 && !selected) {
      const found = students.find((s) => s.studentId === autoOpenStudentId)
      if (found) {
        setSelected(found)
        const sp = new URLSearchParams(searchParams)
        sp.delete("studentId")
        setSearchParams(sp, { replace: true })
      }
    }
  }, [students, autoOpenStudentId, searchParams, setSearchParams, selected])

  const filtered = students.filter((s) => {
    const matchSearch =
      !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase()))

    const matchUni = !filterUni || s.university === filterUni
    const matchCareer = !filterCareer || s.careerPath === filterCareer

    return matchSearch && matchUni && matchCareer
  })

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ".page-anim-hero",
        { y: -30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      )
      gsap.fromTo(
        ".page-anim-filter",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.2)", delay: 0.2 }
      )

      // Twinkling stars animation
      gsap.to(".twinkling-star", {
        opacity: 0.1,
        scale: 0.5,
        duration: "random(1, 3)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          from: "random"
        }
      })
    },
    { scope: pageRef }
  )

  useGSAP(
    () => {
      if (filtered.length > 0) {
        gsap.fromTo(
          ".student-card",
          { y: 30, opacity: 0, rotationX: 10 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.3
          }
        )
      }
    },
    { scope: pageRef, dependencies: [filtered] }
  )

  return (
    <div className="relative min-h-screen bg-transparent font-sans pb-16" ref={pageRef}>
      <SharedAppBackground />
      {/* HEADER (Glass Pill Style) */}
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 md:px-8 pt-6 pointer-events-none">
        <nav className="pointer-events-auto flex w-full max-w-[1400px] items-center justify-between transition-all">
          <div className="flex items-center">
            <Logo hideIcon className="scale-[0.85] origin-left" />
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-1.5 py-1.5 text-[13px] font-bold">
            <NavLink
              to={ROUTES.DASHBOARD_COUNSELOR}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                  isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900 hover:bg-white/40"
                }`
              }
            >
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
            <NavLink
              to={ROUTES.COUNSELOR_FEEDBACK}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                  isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900 hover:bg-white/40"
                }`
              }
            >
              <MessageSquare size={16} />
              Feedback
            </NavLink>
          </div>

          <div className="flex items-center justify-end">
            <div className="bg-white/80 backdrop-blur-md shadow-sm border border-white/60 rounded-full pr-1 pl-3 py-1 flex items-center gap-2">
              <UserHeaderActions user={user} onLogout={handleLogout} />
            </div>
          </div>
        </nav>
      </div>

      {/* MAIN */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 pt-28">
        {/* HERO BANNER */}
        <div className="page-anim-hero relative w-full h-[215px] rounded-2xl bg-gradient-to-br from-[#004d40] via-[#006064] to-[#00838f] overflow-hidden mb-6 shadow-[0_10px_30px_rgba(0,96,100,0.2)] border border-white/10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <Star
                key={i}
                className="twinkling-star absolute text-yellow-200/50 fill-yellow-200/50"
                size={Math.random() * 12 + 6}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>

          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-300/20 rounded-full blur-[80px]" />

          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-50 text-[12px] font-black tracking-wide uppercase backdrop-blur-md flex items-center gap-1.5 shadow-inner">
                <Sparkles size={14} className="text-yellow-300" />
                Counselor Workspace
              </span>
            </div>
            <h1 className="text-2xl md:text-[28px] font-black text-white tracking-tight drop-shadow-md leading-tight mb-1">
              Student Guidance
            </h1>
            <p className="text-cyan-100/90 max-w-2xl text-[15px] leading-relaxed font-medium">
              Monitor learning progress, identify skill gaps early, and provide
              personalized actionable feedback to guide your assigned students
              towards their career success.
            </p>
          </div>
        </div>

        {/* Search & Filter - Floating overlapping the banner */}
        <div className="page-anim-filter relative z-20 -mt-16 mx-4 md:mx-10 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)]">
          <div className="flex-1 min-w-[200px] relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#00838f] transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-[14px] font-medium border-none rounded-xl bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006064]/20 transition-all shadow-inner"
            />
          </div>

          {(search || filterUni || filterCareer) && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setFilterUni("")
                setFilterCareer("")
              }}
              className="flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-200/50 transition-colors"
            >
              <X size={15} /> Clear
            </button>
          )}

          <FilterDropdown
            icon={Briefcase}
            value={filterCareer}
            placeholder="All Careers"
            options={uniqueCareers}
            onChange={setFilterCareer}
          />

          <FilterDropdown
            icon={Building2}
            value={filterUni}
            placeholder="All Universities"
            options={uniqueUnis}
            onChange={setFilterUni}
          />

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f0fafa] text-[#006064] rounded-xl text-[13px] font-bold shadow-sm border border-[#e0f2fe]">
              <Users size={16} />
              <span>{filtered.length} Students</span>
            </div>
          </div>
        </div>

        {/* Student list */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.06)] overflow-hidden mt-8">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Student</div>
            <div className="col-span-2">University</div>
            <div className="col-span-3">Career Path</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center animate-pulse"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-3.5 bg-slate-100 rounded w-4/5" />
                  </div>
                  <div className="col-span-3">
                    <div className="h-6 bg-slate-100 rounded-full w-3/4" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-3 bg-slate-100 rounded w-full" />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <div className="h-8 w-16 bg-slate-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              label="No assigned students found matching your criteria"
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((student) => {
                const fullName = student.fullName || "Unknown"
                const initials =
                  fullName
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "UN"
                const pct = student.roadmapProgress ?? 0
                const barColor =
                  pct === 100
                    ? "bg-emerald-500"
                    : pct >= 50
                      ? "bg-[#00838f]"
                      : "bg-amber-400"
                const missingCount = student.missingSkills?.length ?? 0

                return (
                  <div
                    key={student.studentId}
                    className="student-card grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#f0fafa] transition-all duration-300 group cursor-pointer border-l-4 border-transparent hover:border-[#00838f]"
                    onClick={() => setSelected(student)}
                  >
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#e0f2fe] text-[#006064] flex items-center justify-center text-[13px] font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-slate-900 truncate">
                          {fullName}
                        </p>
                        <p className="text-[12px] text-slate-400 truncate">
                          {missingCount} skill{missingCount !== 1 ? "s" : ""}{" "}
                          missing
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <p className="text-[13px] text-slate-700 truncate flex items-center gap-1.5">
                        <Building2
                          size={12}
                          className="text-slate-400 shrink-0"
                        />
                        {student.university}
                      </p>
                    </div>
                    <div className="col-span-3 min-w-0 flex items-center">
                      {student.careerPath ? (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0284c7] bg-[#e0f2fe] px-3 py-1.5 rounded-full max-w-full truncate border border-[#bae6fd]/50">
                          <Briefcase size={13} className="text-[#0ea5e9]" />
                          {student.careerPath}
                        </span>
                      ) : (
                        <span className="text-[12px] text-slate-400 italic">
                          No career path
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-bold text-slate-700 shrink-0 w-8">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelected(student)
                        }}
                        className="flex items-center gap-1 text-[12px] font-bold text-[#006064] group-hover:text-[#004d40] bg-[#f0fafa] group-hover:bg-[#e0f2fe] px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        View{" "}
                        <ChevronRight
                          size={14}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Student detail side panel */}
      {selected && (
        <StudentDetailPanel
          student={selected}
          defaultTab={defaultTab}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

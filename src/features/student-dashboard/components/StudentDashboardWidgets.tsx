import React, { useEffect, useState } from "react"
import {
  Send,
  Check,
  MapPin,
  Lock,
  Info,
  Network,
  Box,
  AlertTriangle,
  Map,
  Bot,
  TrendingUp,
  X
} from "lucide-react"
import { useAuth } from "@/context"
import { dashboardApi } from "@/api"
import { skillApi, type SkillResponse } from "@/api"
import { useDashboardData } from "../hooks"
import type {
  AiHistoryItem,
  MarketDemand,
  MentorFeedback,
  Recommendation,
  RoadmapProgress,
  SkillGap
} from "../types"

const LoadingState = ({ rows = 3 }: { rows?: number }) => (
  <div className="animate-pulse space-y-3 py-2">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="h-3.5 rounded bg-slate-100"
        style={{ width: `${index % 3 === 0 ? 68 : index % 3 === 1 ? 100 : 82}%` }}
      />
    ))}
  </div>
)

const WidgetHeader = ({
  title,
  description,
  icon
}: {
  title: string
  description?: string
  icon?: React.ReactNode
}) => (
  <div className="mb-5 flex min-w-0 items-start justify-between gap-4">
    <div className="flex min-w-0 items-start gap-3">
      {icon && (
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#006064]">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="text-[16px] font-bold leading-5 text-slate-900 md:text-[17px]">{title}</h3>
        {description && (
          <p className="mt-1 text-[12px] font-medium text-slate-500">{description}</p>
        )}
      </div>
    </div>
  </div>
)

export const StudentWelcomeHeader = () => {
  const { user } = useAuth()
  const [data, setData] = useState<RoadmapProgress | null>(null)

  useEffect(() => {
    dashboardApi.getRoadmapProgress().then(setData).catch(() => setData(null))
  }, [])

  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00838f]">
          Student Dashboard
        </p>
        <h1 className="text-[26px] font-bold leading-tight text-slate-900 md:text-[30px]">
          Good morning, {user?.fullName?.trim().split(" ").pop() || "User"}
        </h1>
        <p className="mt-1 text-[14px] font-medium text-slate-500">
          Track your roadmap progress, skill gaps, mentor feedback, and market signals.
        </p>
      </div>
      {data?.steps && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Current Track
          </p>
          <p className="text-[14px] font-bold text-slate-900">
            {data.steps.find((step) => step.status === "current")?.title || "In Progress"}
          </p>
        </div>
      )}
    </div>
  )
}

export const RoadmapProgressWidget = () => {
  const { data, status } = useDashboardData<RoadmapProgress>(
    () => dashboardApi.getRoadmapProgress() as Promise<RoadmapProgress>
  )

  return (
    <div className="flex min-h-[260px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <WidgetHeader
          title="Roadmap Progress"
          description="Follow your current learning path and next milestone."
          icon={<Map size={18} />}
        />
        <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1 text-[13px] font-semibold">
          <button className="rounded-md bg-[#4fc3f7] px-4 py-1.5 text-white shadow-sm">
            Foundations
          </button>
          <button className="rounded-md px-4 py-1.5 text-slate-500 hover:text-slate-700">
            Advanced
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {status === "loading" ? (
          <LoadingState rows={4} />
        ) : status === "error" ? (
          <LoadingState rows={4} />
        ) : data?.steps?.length ? (
          <div className="relative mb-8 flex items-start justify-between overflow-x-auto px-4 pb-2">
            <div className="absolute left-8 right-8 top-[14px] z-0 h-[2px] bg-slate-200" />
            <div
              className="absolute left-8 top-[14px] z-0 h-[2px] bg-[#006064] transition-all"
              style={{ width: "60%" }}
            />

            {data.steps.map((step) => (
              <div key={step.id} className="relative z-10 flex min-w-[88px] flex-col items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white ${
                    step.status === "completed"
                      ? "border-[#006064] bg-[#006064] text-white"
                      : step.status === "current"
                        ? "border-[#006064] text-[#006064]"
                        : "border-slate-200 text-slate-300"
                  }`}
                >
                  {step.status === "completed" && <Check size={14} strokeWidth={3} />}
                  {step.status === "current" && (
                    <MapPin
                      size={14}
                      fill="currentColor"
                      className="rounded-full bg-[#006064] p-0.5 text-white"
                    />
                  )}
                  {step.status === "locked" && <Lock size={12} />}
                </div>
                <span
                  className={`text-[12px] font-bold ${
                    step.status === "locked"
                      ? "text-slate-300"
                      : step.status === "current"
                        ? "text-[#006064]"
                        : "text-slate-700"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <LoadingState rows={4} />
        )}

        {status === "success" && data?.aiTip && (
          <div className="flex items-start gap-3 rounded-xl border border-[#e0f2fe] bg-[#f0f9ff] p-4">
            <div className="mt-0.5 text-[#00838f]">
              <Info size={20} />
            </div>
            <p className="text-[13px] leading-relaxed text-slate-700">
              <span className="font-bold text-[#00838f]">AI Tip:</span>{" "}
              {data.aiTip.split("**")[0]}
              <span className="font-bold text-slate-900">{data.aiTip.split("**")[1]}</span>
              {data.aiTip.split("**")[2]}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const SkillGapsWidget = ({ onClose }: { onClose?: () => void }) => {
  const { data, status } = useDashboardData<SkillGap[]>(
    () => dashboardApi.getSkillGaps() as Promise<SkillGap[]>
  )

  return (
    <div className="flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <WidgetHeader
          title="Skill Gaps"
          description="Prioritized skills to improve next."
          icon={<AlertTriangle size={18} strokeWidth={2.5} />}
        />
        {onClose && (
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3.5">
        {status === "loading" ? (
          <LoadingState />
        ) : status === "error" ? (
          <LoadingState />
        ) : data && data.length > 0 ? (
          data.map((gap) => (
            <div
              key={gap.id}
              className={`rounded-xl border p-4 ${
                gap.type === "critical" ? "border-[#ffe4e4] bg-[#fff5f5]" : "border-[#e0f2fe] bg-[#f0f9ff]"
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    gap.type === "critical" ? "text-rose-600" : "text-[#0284c7]"
                  }`}
                >
                  {gap.type === "critical" ? "CRITICAL GAP" : "MARKET REQUIREMENT"}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    gap.type === "critical" ? "bg-[#fee2e2] text-rose-600" : "bg-[#bae6fd] text-[#0369a1]"
                  }`}
                >
                  {gap.severity}
                </span>
              </div>
              <h4 className="mb-1 text-[15px] font-bold text-slate-900">{gap.title}</h4>
              <p className="text-[12px] leading-snug text-slate-600">{gap.description}</p>
            </div>
          ))
        ) : (
          <LoadingState />
        )}
      </div>

      <button className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-[14px] font-bold text-[#006064] transition-colors hover:bg-slate-50">
        Download Detailed Report
      </button>
    </div>
  )
}

export const MentorFeedbackWidget = () => {
  const { data, status } = useDashboardData<MentorFeedback[]>(
    () => dashboardApi.getMentorFeedback() as Promise<MentorFeedback[]>
  )

  return (
    <div className="flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <WidgetHeader
        title="Mentor Feedback"
        description="Latest notes from mentors and reviewers."
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        }
      />

      <div className="flex-1 space-y-4">
        {status === "loading" ? (
          <LoadingState />
        ) : status === "error" ? (
          <LoadingState />
        ) : data && data.length > 0 ? (
          data.map((feedback) => (
            <div key={feedback.id} className="relative pl-4">
              <div className="absolute bottom-0 left-0 top-0 w-[5px] rounded-full bg-[#00838f] opacity-90" />
              <div className="rounded-xl rounded-l-none border border-slate-100 bg-[#f8fafc] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[14px] font-bold text-[#006064]">{feedback.name}</h4>
                  <span className="text-[10px] font-semibold text-slate-400">{feedback.time}</span>
                </div>
                <p className="text-[13px] italic leading-relaxed text-slate-600">"{feedback.text}"</p>
              </div>
            </div>
          ))
        ) : (
          <LoadingState />
        )}
      </div>
    </div>
  )
}

export const SkillComparisonWidget = () => {
  const { data, status } = useDashboardData<SkillResponse>(
    () => skillApi.compareRoadmapSkills()
  )
  const selectedIds = new Set(data?.selectedSkills.map((skill) => skill.skillId) ?? [])
  const missingIds = new Set(data?.missingSkills.map((skill) => skill.skillId) ?? [])

  return (
    <div className="flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 2xl:flex-row 2xl:items-start 2xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#006064]">
            <TrendingUp size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[17px] font-bold leading-5 text-slate-900">Skill Comparison</h3>
            <p className="mt-1 text-[12px] font-medium text-slate-500">
              Current level compared to target level.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#006064]" />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e0f2fe]" />
            Target
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {status === "loading" ? (
          <LoadingState />
        ) : status === "error" ? (
          <LoadingState />
        ) : data?.requiredSkills.length ? (
          data.requiredSkills.map(({ skill, importanceLevel }) => {
            const current = missingIds.has(skill.skillId)
              ? 0
              : selectedIds.has(skill.skillId)
                ? 100
                : 0
            return (
            <div key={skill.skillId}>
              <div className="mb-2 flex items-end justify-between">
                <span className="text-[12px] font-bold text-slate-800">{skill.skillName}</span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {current}% / 100% · {importanceLevel}
                </span>
              </div>
              <div className="relative flex h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                <div className="absolute bottom-0 left-0 top-0 z-0 w-full bg-[#e0f2fe]" />
                <div className="absolute bottom-0 left-0 top-0 z-10 rounded-r-full bg-[#006064]" style={{ width: `${current}%` }} />
              </div>
            </div>
          )})
        ) : (
          <LoadingState />
        )}
      </div>
    </div>
  )
}

export const AiMentorHistoryWidget = ({ onClose }: { onClose: () => void }) => {
  const { data, status } = useDashboardData<AiHistoryItem[]>(
    () => dashboardApi.getAiHistory() as Promise<AiHistoryItem[]>
  )

  return (
    <div className="flex h-full min-h-0 flex-col bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <WidgetHeader
          title="AI Mentor History"
          description="Recent questions and guidance."
          icon={<Bot size={18} />}
        />
        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          title="Close AI Mentor"
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {status === "loading" ? (
          <LoadingState />
        ) : status === "error" ? (
          <LoadingState />
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 ${
                index === 1 ? "border-l-[3px] border-[#00838f] bg-white" : "border-slate-100 bg-[#f8fafc]"
              }`}
            >
              <span className="mb-1 block text-[10px] font-bold uppercase text-slate-500">{item.tag}</span>
              <h4 className="mb-1 truncate text-[14px] font-bold text-slate-900">{item.title}</h4>
              <p className="truncate text-[12px] text-slate-500">{item.preview}</p>
            </div>
          ))
        ) : (
          <LoadingState />
        )}
      </div>

      <div className="relative mt-5">
        <input
          type="text"
          placeholder="Ask your AI Mentor..."
          className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] py-3 pl-4 pr-12 text-[13px] outline-none transition-colors focus:border-[#00838f]"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00838f] hover:text-[#006064]">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

export const PriorityLearningWidget = () => {
  const { data, status } = useDashboardData<Recommendation[]>(
    () => dashboardApi.getRecommendations() as Promise<Recommendation[]>
  )

  return (
    <div className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <WidgetHeader
        title="Priority Learning"
        description="Recommended actions to bridge the most important gaps."
        icon={<Network size={18} />}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {status === "loading" ? (
          <div className="md:col-span-2">
            <LoadingState />
          </div>
        ) : status === "error" ? (
          <div className="md:col-span-2">
            <LoadingState rows={4} />
          </div>
        ) : data && data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="flex h-full flex-col rounded-lg border border-slate-200 bg-[#f8fafc] p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e0f2fe] text-[#0284c7]">
                  {item.icon === "Network" ? <Network size={20} strokeWidth={2.5} /> : <Box size={20} strokeWidth={2.5} />}
                </div>
                <span className="rounded-md bg-[#e0f2fe] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#0369a1]">
                  {item.type}
                </span>
              </div>
              <h4 className="mb-2 text-[16px] font-bold text-slate-900">{item.title}</h4>
              <p className="mb-6 flex-1 text-[13px] leading-relaxed text-slate-500">{item.description}</p>
              <div className="flex gap-3">
                <button className="flex-1 rounded-xl bg-[#006064] py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#00838f]">
                  Start Now
                </button>
                <button className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-bold text-slate-700 transition-colors hover:bg-slate-50">
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2">
            <LoadingState rows={4} />
          </div>
        )}
      </div>
    </div>
  )
}

export const MarketDemandWidget = ({ onClose }: { onClose?: () => void }) => {
  const { data, status } = useDashboardData<MarketDemand>(
    () => dashboardApi.getMarketDemand() as Promise<MarketDemand>
  )

  return (
    <div className="flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <WidgetHeader
          title="Market Demand"
          description="Projected demand for your target role."
          icon={<TrendingUp size={18} />}
        />
        {onClose && (
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        )}
      </div>

      {status === "loading" ? (
        <LoadingState rows={5} />
      ) : status === "error" ? (
        <LoadingState rows={5} />
      ) : data ? (
        <>
          <div className="mb-6 mt-2 flex items-center gap-3">
            <span className="text-[32px] font-bold leading-none text-slate-900">{data.growth}%</span>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#00838f]">YoY Growth</span>
              <span className="text-[11px] leading-tight text-slate-500">{data.role}</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end">
            <div className="mb-4 flex h-28 items-end justify-between gap-1.5">
              {data.chart.map((height, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t-sm ${i === data.chart.length - 1 ? "bg-[#006064]" : "bg-[#a3c9c9]"}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <p className="text-center text-[8px] font-bold uppercase tracking-widest text-slate-800">
              Projected Demand For K8s Masters
            </p>
          </div>
        </>
      ) : <LoadingState rows={5} />}
    </div>
  )
}


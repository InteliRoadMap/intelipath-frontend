import React, { useEffect, useState } from "react"
import {
  Check,
  MapPin,
  Lock,
  AlertTriangle,
  Map,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
  Bot,
  Send,
  Network,
  Box
} from "lucide-react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts"
import { useAuth } from "@/context"
import { studentDashboardService } from "../services"
import { useDashboardData } from "../hooks"
import type {
  MarketDemand,
  RoadmapProgress,
  SkillGap,
  SkillResponse,
  MentorFeedback,
  AiHistoryItem,
  Recommendation
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

const EmptyState = ({
  icon,
  title,
  description
}: {
  icon?: React.ReactNode
  title: string
  description?: string
}) => (
  <div className="grid min-h-[120px] flex-1 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center">
    <div>
      {icon && (
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
          {icon}
        </div>
      )}
      <p className="text-[13px] font-bold text-slate-700">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-[12px] leading-5 text-slate-500">{description}</p>
      )}
    </div>
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
  <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
    <div className="flex min-w-0 items-start gap-2.5">
      {icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#006064]">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="text-[15px] font-bold leading-5 text-slate-900 md:text-[16px]">{title}</h3>
        {description && (
          <p className="mt-0.5 text-[12px] font-medium text-slate-500">{description}</p>
        )}
      </div>
    </div>
  </div>
)

export const StudentWelcomeHeader = () => {
  const { user } = useAuth()
  const [data, setData] = useState<RoadmapProgress | null>(null)

  useEffect(() => {
    studentDashboardService.getRoadmapProgress().then(setData).catch(() => setData(null))
  }, [])

  return (
    <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#00838f]">
          Student Dashboard
        </p>
        <h1 className="text-[24px] font-bold leading-tight text-slate-900 md:text-[28px]">
          Good morning, {user?.fullName?.trim().split(" ").pop() || "User"}
        </h1>
        <p className="mt-1 text-[13px] font-medium text-slate-500">
          Track your roadmap progress, skill gaps, and market signals.
        </p>
      </div>
      {data?.steps && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Current Target Role
          </p>
          <div className="mt-1 flex items-center justify-end gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00838f] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00838f]"></span>
            </span>
            <p className="text-[14px] font-bold text-slate-900">
              {data?.targetCareerRole || 'Not Selected'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export const RoadmapProgressWidget = () => {
  const { data: roadmapData, status: roadmapStatus } = useDashboardData<RoadmapProgress>(
    () => studentDashboardService.getRoadmapProgress()
  )

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <WidgetHeader
          title="Roadmap Progress"
          description="Your current progress timeline and milestones."
          icon={<Map size={16} />}
        />
        <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1 text-[12px] font-semibold">
          <button className="cursor-pointer rounded-md bg-[#00838f] px-3 py-1 text-white shadow-sm">
            Foundations
          </button>
          <button className="cursor-pointer rounded-md px-3 py-1 text-slate-500 hover:text-slate-700">
            Advanced
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center pb-2">
        {roadmapStatus === "loading" ? (
          <LoadingState rows={3} />
        ) : roadmapStatus === "error" ? (
          <EmptyState
            icon={<Map size={16} />}
            title="No roadmap progress yet"
            description="Progress will appear after backend returns roadmap milestones."
          />
        ) : roadmapData?.steps?.length ? (
          <div className="relative mt-2 flex w-full items-center justify-between px-2 sm:px-8">
            {/* Timeline connection line */}
            <div className="absolute left-[5%] right-[5%] top-[16px] z-0 h-[2px] bg-slate-100" />
            <div
              className="absolute left-[5%] top-[16px] z-0 h-[2px] bg-[#00838f] transition-all duration-1000"
              style={{ width: "45%" }}
            />

            {roadmapData.steps.map((step) => (
              <div key={step.id} className="relative z-10 flex min-w-[64px] sm:min-w-[80px] flex-col items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-all duration-500 ${
                    step.status === "completed"
                      ? "border-[#00838f] text-[#00838f]"
                      : step.status === "current"
                        ? "border-[#00838f] bg-[#00838f] text-white shadow-[0_0_10px_rgba(0,131,143,0.3)] ring-4 ring-[#e0f2fe]"
                        : "border-slate-200 text-slate-300"
                  }`}
                >
                  {step.status === "completed" && <Check size={14} strokeWidth={3} />}
                  {step.status === "current" && <MapPin size={14} fill="currentColor" className="text-white" />}
                  {step.status === "locked" && <Lock size={12} />}
                </div>
                <span
                  className={`text-center text-[10px] sm:text-[12px] font-bold ${
                    step.status === "locked"
                      ? "text-slate-300"
                      : step.status === "current"
                        ? "text-[#00838f]"
                        : "text-slate-700"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Map size={16} />}
            title="No roadmap progress yet"
            description="Choose a target career or wait for roadmap data from backend."
          />
        )}
      </div>
    </div>
  )
}

export const SkillGapsWidget = ({ onClose }: { onClose?: () => void }) => {
  const { data, status } = useDashboardData<SkillGap[]>(
    () => studentDashboardService.getSkillGaps()
  )
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;
  const currentData = data ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <WidgetHeader
            title="Skill Gaps Analysis"
            description="Identify and close your technical blindspots."
            icon={<AlertTriangle size={16} strokeWidth={2.5} />}
          />
          {onClose && (
            <button type="button" onClick={onClose} className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mt-1">
          {status === "loading" ? (
            <LoadingState rows={5} />
          ) : status === "error" ? (
            <EmptyState
              icon={<AlertTriangle size={16} />}
              title="No skill gaps yet"
              description="Skill gap data will appear after required and selected skills are available."
            />
          ) : currentData.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold w-2/3">Skill Requirement</th>
                    <th className="px-3 py-2.5 font-semibold w-1/3">Priority Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.map((gap) => (
                    <tr key={gap.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-3 py-3">
                        <p className="font-bold text-slate-900">{gap.title}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-[250px]">{gap.description}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                            gap.type === "critical"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          {gap.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<AlertTriangle size={16} />}
              title="No skill gaps yet"
              description="There is no gap data to show right now."
            />
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, data!.length)}</span> of <span className="font-bold text-slate-900">{data!.length}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="text-[11px] font-bold text-slate-700 px-1.5">{currentPage} / {totalPages}</div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 space-y-3.5">
        {status === "loading" ? (
          <LoadingState />
        ) : status === "error" ? (
          <LoadingState />
        ) : Array.isArray(data) && data.length > 0 ? (
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
    () => studentDashboardService.getMentorFeedback() as Promise<MentorFeedback[]>
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
        ) : Array.isArray(data) && data.length > 0 ? (
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
    () => studentDashboardService.compareRoadmapSkills()
  )
  const selectedIds = new Set(data?.selectedSkills.map((skill) => skill.skillId) ?? [])
  const missingIds = new Set(data?.missingSkills.map((skill) => skill.skillId) ?? [])

  // Format data for Recharts Radar
  const chartData = data?.requiredSkills.map(({ skill, importanceLevel }) => {
    const current = missingIds.has(skill.skillId) ? 0 : selectedIds.has(skill.skillId) ? 100 : 0
    const target = importanceLevel === "High" ? 100 : importanceLevel === "Medium" ? 70 : 40
    return {
      subject: skill.skillName.substring(0, 12),
      Current: current,
      Target: target,
      fullMark: 100,
    }
  }) || []

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5 overflow-hidden">
      <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <WidgetHeader
          title="Skill Radar"
          description="Multidimensional view of your current stack vs target."
          icon={<TrendingUp size={16} />}
        />
        <div className="flex shrink-0 items-center gap-2 text-[9px] font-bold uppercase tracking-wide text-slate-600">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#00838f]" />
            Current
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#e0f2fe]" />
            Target
          </span>
        </div>
      </div>

      <div className="flex-1 -ml-5 -mr-5 -mb-5 mt-1 relative">
        {status === "loading" ? (
          <div className="px-5"><LoadingState rows={4} /></div>
        ) : status === "error" || chartData.length === 0 ? (
          <div className="px-5 h-full flex items-center"><EmptyState
            icon={<TrendingUp size={16} />}
            title="No skill comparison yet"
            description="Required skill data has not been returned yet."
          /></div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Target" dataKey="Target" stroke="#bae6fd" fill="#e0f2fe" fillOpacity={0.6} />
              <Radar name="Current" dataKey="Current" stroke="#00838f" fill="#00838f" fillOpacity={0.5} />
              <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export const AiMentorWidget = () => {
  const { data, status } = useDashboardData<AiHistoryItem[]>(
    () => studentDashboardService.getAiHistory() as Promise<AiHistoryItem[]>
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
        ) : Array.isArray(data) && data.length > 0 ? (
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

export const RecommendationsWidget = () => {
  const { data, status } = useDashboardData<Recommendation[]>(
    () => studentDashboardService.getRecommendations() as Promise<Recommendation[]>
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
        ) : Array.isArray(data) && data.length > 0 ? (
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
    () => studentDashboardService.getMarketDemand() as Promise<MarketDemand>
  )

  const chartData = data?.chart?.map((val, i) => ({
    name: `M${i + 1}`,
    value: val 
  })) || []

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5 overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <WidgetHeader
          title="Market Demand"
          description="Job posting trends for your target role."
          icon={<TrendingUp size={16} />}
        />
        {onClose && (
          <button type="button" onClick={onClose} className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between mt-1">
        {status === "loading" ? (
          <LoadingState rows={4} />
        ) : status === "error" ? (
          <EmptyState
            icon={<TrendingUp size={16} />}
            title="No market demand yet"
            description="Market signals will appear after backend returns demand data."
          />
        ) : data ? (
          <>
            <div className="mb-2 flex items-center gap-3">
              <span className="text-[32px] font-black leading-none tracking-tighter text-slate-900">{data.growth}%</span>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00838f]">YoY Growth</span>
                <span className="text-[12px] font-medium leading-tight text-slate-500">{data.role}</span>
              </div>
            </div>
            <div className="relative flex-1 -ml-5 -mr-5 -mb-5 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00838f" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00838f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Demand Index"
                    stroke="#00838f" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorDemand)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<TrendingUp size={16} />}
            title="No market demand yet"
            description="There is no market demand data to show right now."
          />
        )}
      </div>
    </div>
  )
}

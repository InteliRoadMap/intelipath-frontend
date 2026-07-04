import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/shared"
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Lock,
  ChevronRight,
  ChevronLeft,
  Flame
} from "lucide-react"
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts"
import { useAuth } from "@/context"
import { studentDashboardService } from "../services"
import { useDashboardData, useRoadmapProgress } from "../hooks"
import type {
  MarketDemand,
  RoadmapProgress,
  SkillResponse,
  Recommendation
} from "../types"

const LoadingState = ({ rows = 3 }: { rows?: number }) => (
  <div className="animate-pulse space-y-3 py-2 w-full">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="h-4 rounded bg-slate-200"
        style={{ width: `${index % 3 === 0 ? 68 : index % 3 === 1 ? 100 : 82}%` }}
      />
    ))}
  </div>
)

const EmptyState = ({ title, description }: { title: string; description?: string }) => (
  <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl bg-slate-50 p-8 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
      <Zap size={20} className="text-slate-400" />
    </div>
    <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
    {description && <p className="mt-1 text-[13px] text-slate-500">{description}</p>}
  </div>
)

// 1. Welcome Header (Replaces Top Banner)
export const StudentWelcomeHeader = () => {
  const { user } = useAuth()
  
  const { data } = useDashboardData<any>(
    () => studentDashboardService.getStudentRoadmap()
  )
  
  // Progress from API or 0
  const progress = data?.progress || 0
  
  // Calculate stroke dasharray for the circular progress (circumference = 2 * pi * r)
  // r = 24, circumference ≈ 150.7
  const circumference = 150.7
  const strokeDashoffset = circumference - (progress / 100) * circumference
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-3xl bg-black p-8 text-white mb-8 gap-6">
      <div>
        <h1 className="text-[32px] font-black tracking-tight mb-2">Hello, {user?.fullName || "Student"}!</h1>
        <p className="text-[16px] text-slate-400 font-medium">It's a great day to expand your knowledge.</p>
      </div>
      <div className="flex items-center gap-5 bg-white/10 p-5 rounded-3xl border border-white/10">
        <div className="flex flex-col">
          <span className="text-[15px] font-black text-white">Course Progress</span>
          <span className="text-[13px] text-slate-400 font-medium">Keep up the good work!</span>
        </div>
        
        <div className="relative flex h-[64px] w-[64px] items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 64 64">
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="24"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="32"
              cy="32"
              r="24"
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-[15px] font-black text-white">{progress}%</span>
        </div>
      </div>
    </div>
  )
}

// 2. Current Progress Banner
export const CurrentProgressBanner = () => {
  const navigate = useNavigate();
  const { data: roadmapData, status: roadmapStatus } = useRoadmapProgress()

  const steps = roadmapData?.steps ?? []
  const currentIdx = Math.max(0, steps.findIndex(s => s.status === 'current' || s.status === 'in_progress'))
  // null until the user browses; then the arrows drive which milestone shows.
  const [browseIdx, setBrowseIdx] = useState<number | null>(null)
  const activeIdx = browseIdx ?? currentIdx
  const node = steps[activeIdx]

  if (roadmapStatus === 'loading') return <LoadingState rows={1} />
  if (!node) return null

  const caption = node.status === 'completed'
    ? 'Completed milestone'
    : node.status === 'current' || node.status === 'in_progress'
      ? 'Current milestone'
      : 'Upcoming milestone'

  return (
    <div className="mt-6 flex flex-col md:flex-row items-center justify-between rounded-3xl bg-[#f5f5f5] p-4 md:p-5 gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm font-bold text-[18px]">
          <Target size={22} className="text-black" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-black line-clamp-1 max-w-[220px]">{node.title}</h3>
          <p className="text-[13px] font-medium text-slate-500">{caption} · {activeIdx + 1}/{steps.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        <button
          onClick={() => navigate(ROUTES.DASHBOARD_STUDENT_ROADMAP)}
          className="rounded-2xl bg-black px-6 py-3 text-[14px] font-bold text-white transition-transform hover:scale-105 active:scale-95"
        >
          Continue
        </button>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setBrowseIdx(Math.max(0, activeIdx - 1))}
            disabled={activeIdx === 0}
            aria-label="Previous milestone"
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 transition-colors ${activeIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-200'}`}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => setBrowseIdx(Math.min(steps.length - 1, activeIdx + 1))}
            disabled={activeIdx === steps.length - 1}
            aria-label="Next milestone"
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 transition-colors ${activeIdx === steps.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-200'}`}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Windowed page list: always first/last + current neighbours, gaps become "…".
const buildPageList = (current: number, total: number): (number | "ellipsis")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const wanted = [1, total, current, current - 1, current + 1]
    .filter(p => p >= 1 && p <= total)
  const unique = Array.from(new Set(wanted)).sort((a, b) => a - b)
  const out: (number | "ellipsis")[] = []
  let prev = 0
  for (const p of unique) {
    if (p - prev > 1) out.push("ellipsis")
    out.push(p)
    prev = p
  }
  return out
}

// 3. Your Action Items — "what to do next" (roadmap queue + AI suggestions),
// deliberately task-oriented so it complements rather than repeats Skill Match.
export const ActionableListWidget = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'next' | 'recommendations'>('next')
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  const { data: roadmap, status } = useRoadmapProgress()
  const { data: recData } = useDashboardData<Recommendation[]>(
    () => studentDashboardService.getRecommendations()
  )

  const handleTabSwitch = (tab: 'next' | 'recommendations') => {
    setActiveTab(tab)
    setPage(1)
  }

  // Up-next queue = the immediate roadmap steps you haven't finished, in order.
  // Capped so the list stays a short "what's next", not the whole roadmap.
  const UP_NEXT_LIMIT = 15
  const pending = (roadmap?.steps ?? []).filter(s => s.status !== 'completed')
  const upNext = pending.slice(0, UP_NEXT_LIMIT)
  const recs = Array.isArray(recData) ? recData : []

  const isNext = activeTab === 'next'
  const source: any[] = isNext ? upNext : recs
  const totalPages = Math.ceil(source.length / ITEMS_PER_PAGE)
  const currentData = source.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-[24px] font-black text-black tracking-tight">Your Action Items</h2>

        <div className="flex gap-6 text-[14px] font-bold text-slate-400">
          <button
            onClick={() => handleTabSwitch('next')}
            className={`pb-1 ${isNext ? 'text-black border-b-2 border-black' : 'hover:text-black transition-colors'}`}>
            Up Next
          </button>
          <button
            onClick={() => handleTabSwitch('recommendations')}
            className={`pb-1 ${!isNext ? 'text-black border-b-2 border-black' : 'hover:text-black transition-colors'}`}>
            AI Suggestions
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-h-[660px]">
        {status === "loading" ? (
          <LoadingState rows={6} />
        ) : currentData.length === 0 ? (
          <EmptyState
            title={isNext ? "You're all caught up" : "No suggestions right now"}
            description={isNext ? "Every roadmap milestone is complete. Nice work." : "Generate roadmap suggestions from the roadmap page."}
          />
        ) : (
          <>
            {currentData.map((item: any, index: number) => {
              const active = isNext && (item.status === 'current' || item.status === 'in_progress')
              const title = isNext ? item.title : (item.title || 'Suggestion')
              const subtitle = isNext
                ? (active ? 'In progress' : 'Up next')
                : (item.description || item.type || 'Roadmap suggestion')
              return (
                <div key={item.id || index} className="group flex flex-col sm:flex-row items-center justify-between rounded-3xl bg-[#f9f9f9] p-4 pr-5 transition-colors hover:bg-[#f0f0f0] gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                      {isNext ? (active ? <Zap size={24} className="text-black" /> : <BookOpen size={24} className="text-black" />) : <Target size={24} className="text-black" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[16px] font-bold text-black line-clamp-1">{title}</h4>
                      <p className="text-[13px] font-medium text-slate-500 line-clamp-1 max-w-[280px]">{subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0">
                    {isNext ? (
                      <span className={`flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full ${active ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {active ? <Zap size={13} /> : <Clock size={13} />}
                        {active ? 'Current' : 'Locked'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                        <Flame size={13} /> AI
                      </span>
                    )}
                    <button
                      onClick={() => navigate(ROUTES.DASHBOARD_STUDENT_ROADMAP)}
                      className="rounded-2xl bg-black px-5 py-2.5 text-[13px] font-bold text-white transition-transform hover:scale-105 active:scale-95"
                    >
                      {active ? 'Continue' : 'View'}
                    </button>
                  </div>
                </div>
              )
            })}

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 text-black'}`}
                >
                  <ArrowLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                  {buildPageList(page, totalPages).map((p, i) => (
                    p === "ellipsis" ? (
                      <span key={`e${i}`} className="h-10 w-8 flex items-center justify-center text-[14px] font-bold text-slate-300 select-none">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-10 w-10 rounded-full text-[14px] font-bold transition-colors ${page === p ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-black'}`}
                      >
                        {p}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-colors ${page === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 text-black'}`}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// 4. Quick Stats
export const QuickStatsWidget = () => {
  const { data } = useRoadmapProgress()

  const completed = data?.steps?.filter(s => s.status === 'completed').length || 0;
  const inProgress = data?.steps?.filter(s => s.status === 'current').length || 0;

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="flex flex-col justify-center rounded-3xl bg-[#f5f5f5] p-6">
        <div className="flex items-end gap-2">
          <span className="text-[42px] font-black leading-none text-black">{completed}</span>
          <span className="mb-1 text-[14px] font-bold leading-tight text-slate-500 max-w-[60px]">Milestones completed</span>
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-3xl bg-[#f5f5f5] p-6">
        <div className="flex items-end gap-2">
          <span className="text-[42px] font-black leading-none text-black">{inProgress}</span>
          <span className="mb-1 text-[14px] font-bold leading-tight text-slate-500 max-w-[60px]">Skills in progress</span>
        </div>
      </div>
    </div>
  )
}

// 5. Market Demand Chart
export const MarketDemandChartWidget = () => {
  const { data, status } = useDashboardData<MarketDemand>(
    () => studentDashboardService.getMarketDemand() as Promise<MarketDemand>
  )

  let rawChart = data?.chart || []
  if (rawChart.length > 0 && rawChart.length < 7) {
    // Pad left with 0 to ensure we have a full week visual
    rawChart = [...Array(7 - rawChart.length).fill(0), ...rawChart]
  }

  const chartData = rawChart.map((val, i) => ({
    name: ['mon','tue','wed','thu','fri','sat','sun'][i % 7] || `M${i}`,
    value: val 
  }))

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[20px] font-black text-black tracking-tight">Market Trend</h2>
        <button className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-bold text-black">
          Weekly <ChevronRight size={14} />
        </button>
      </div>

      <div className="h-[220px] w-full mt-4">
        {status === "loading" ? (
          <LoadingState rows={4} />
        ) : status === "error" || chartData.length === 0 ? (
          <EmptyState title="No trend data" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#000', color: '#fff', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.2)', fontSize: '13px', fontWeight: 700, padding: '8px 12px' }} 
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Demand"
                stroke="#000000" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorDemand)" 
                activeDot={{ r: 6, fill: '#000', stroke: '#fff', strokeWidth: 3 }}
                dot={{ r: 4, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

// 6. Skill Match — grouped progress instead of an unreadable 22-axis radar.
type SkillRow = {
  id: string
  name: string
  importance: "HIGH" | "AVG" | "LOW"
  pct: number
}

const IMPORTANCE_GROUPS: { key: SkillRow["importance"]; label: string; accent: string }[] = [
  { key: "HIGH", label: "Essential", accent: "#ef4444" },
  { key: "AVG", label: "Recommended", accent: "#f59e0b" },
  { key: "LOW", label: "Optional", accent: "#94a3b8" },
]

const barColor = (pct: number) =>
  pct >= 100 ? "#10b981" : pct > 0 ? "#3b82f6" : "#cbd5e1"

const SkillProgressRow = ({ row }: { row: SkillRow }) => {
  const mastered = row.pct >= 100
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-[12px] font-bold truncate ${mastered ? "text-slate-500" : "text-slate-800"}`}>
            {row.name}
          </span>
          <span className="shrink-0 text-[11px] font-bold tabular-nums" style={{ color: barColor(row.pct) }}>
            {mastered ? "Mastered" : `${Math.round(row.pct)}%`}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(row.pct, 3)}%`, backgroundColor: barColor(row.pct) }}
          />
        </div>
      </div>
      {mastered && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
    </div>
  )
}

export const SkillMatchWidget = () => {
  const { data, status } = useDashboardData<SkillResponse>(
    () => studentDashboardService.compareRoadmapSkills()
  )
  const [gapsOnly, setGapsOnly] = useState(false)

  const selectedIds = new Set(data?.selectedSkills.map((skill) => skill.skillId) ?? [])

  const rows: SkillRow[] = (data?.requiredSkills ?? []).map(({ skill, importanceLevel, progress }) => {
    const pct = progress !== undefined && progress !== null
      ? progress
      : selectedIds.has(skill.skillId) ? 100 : 0
    const imp = String(importanceLevel || "AVG").toUpperCase()
    return {
      id: skill.skillId,
      name: skill.skillName,
      importance: (imp === "HIGH" || imp === "LOW" ? imp : "AVG") as SkillRow["importance"],
      pct,
    }
  })

  const total = rows.length
  const mastered = rows.filter((r) => r.pct >= 100).length
  const readiness = total > 0 ? Math.round(rows.reduce((s, r) => s + r.pct, 0) / total) : 0

  const visible = gapsOnly ? rows.filter((r) => r.pct < 100) : rows

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-black text-black tracking-tight">Skill Match</h2>
        {total > 0 && (
          <button
            onClick={() => setGapsOnly((v) => !v)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
              gapsOnly ? "bg-black text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {gapsOnly ? "Showing gaps" : "Show gaps only"}
          </button>
        )}
      </div>

      <div className="w-full rounded-3xl bg-[#f9f9f9] p-5">
        {status === "loading" ? (
          <LoadingState rows={5} />
        ) : status === "error" || total === 0 ? (
          <EmptyState title="No skills to compare" description="Pick a target career to see your skill match." />
        ) : (
          <>
            {/* Readiness summary */}
            <div className="mb-5 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-black text-black tabular-nums">{readiness}%</span>
                  <span className="text-[12px] font-bold text-slate-500">career readiness</span>
                </div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-black transition-all duration-500" style={{ width: `${readiness}%` }} />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[20px] font-black text-black tabular-nums">{mastered}<span className="text-slate-400">/{total}</span></div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">mastered</div>
              </div>
            </div>

            {/* Grouped skill bars, gaps first within each group */}
            <div className="space-y-4">
              {IMPORTANCE_GROUPS.map((group) => {
                const groupRows = visible
                  .filter((r) => r.importance === group.key)
                  .sort((a, b) => a.pct - b.pct)
                if (groupRows.length === 0) return null
                return (
                  <div key={group.key}>
                    <div className="mb-2 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: group.accent }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {group.label}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">
                        {groupRows.filter((r) => r.pct >= 100).length}/{groupRows.length}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {groupRows.map((row) => <SkillProgressRow key={row.id} row={row} />)}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}


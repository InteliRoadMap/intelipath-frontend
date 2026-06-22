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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
import { useDashboardData } from "../hooks"
import type {
  MarketDemand,
  RoadmapProgress,
  SkillGap,
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
  const { data: roadmapData, status: roadmapStatus } = useDashboardData<RoadmapProgress>(
    () => studentDashboardService.getRoadmapProgress()
  )

  const currentNode = roadmapData?.steps?.find(s => s.status === 'current') || roadmapData?.steps?.[0]
  
  if (roadmapStatus === 'loading') return <LoadingState rows={1} />
  if (!currentNode) return null

  return (
    <div className="mt-6 flex flex-col md:flex-row items-center justify-between rounded-3xl bg-[#f5f5f5] p-4 md:p-5 gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm font-bold text-[18px]">
          <Target size={22} className="text-black" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-black">{currentNode.title}</h3>
          <p className="text-[13px] font-medium text-slate-500 line-clamp-1 max-w-[200px]">Next Milestone</p>
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
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 transition-colors hover:bg-slate-200">
            <ArrowLeft size={18} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 transition-colors hover:bg-slate-200">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// 3. Actionable List (Skill Gaps / Courses style)
export const ActionableListWidget = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'gaps' | 'recommendations'>('gaps')
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  const { data, status } = useDashboardData<SkillGap[]>(
    () => studentDashboardService.getSkillGaps()
  )

  const { data: recData } = useDashboardData<Recommendation[]>(
    () => studentDashboardService.getRecommendations()
  )

  // Handle Tab Switch
  const handleTabSwitch = (tab: 'gaps' | 'recommendations') => {
    setActiveTab(tab)
    setPage(1) // Reset page on tab switch
  }

  // Data processing
  // OLD CODE:
  // const highRecData = (recData as any)?.filter((item: any) => item.severity?.toUpperCase() === 'HIGH' || item.severity === 'High') || []
  // const sourceData = activeTab === 'gaps' ? (data || []) : highRecData
  const sourceData = activeTab === 'gaps' ? (data || []) : (Array.isArray(recData) ? recData : [])
  const totalItems = sourceData.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const currentData = sourceData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-[24px] font-black text-black tracking-tight">Your Action Items</h2>
        
        {/* Tabs */}
        <div className="flex gap-6 text-[14px] font-bold text-slate-400">
          <button 
            onClick={() => handleTabSwitch('gaps')}
            className={`pb-1 ${activeTab === 'gaps' ? 'text-black border-b-2 border-black' : 'hover:text-black transition-colors'}`}>
            Skill Gaps
          </button>
          <button 
            onClick={() => handleTabSwitch('recommendations')}
            className={`pb-1 ${activeTab === 'recommendations' ? 'text-black border-b-2 border-black' : 'hover:text-black transition-colors'}`}>
            Recommendations
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-h-[660px]">
        {status === "loading" ? (
          <LoadingState rows={6} />
        ) : status === "error" || currentData.length === 0 ? (
          <EmptyState title="No action items yet" description={activeTab === 'gaps' ? "You are fully aligned with the market." : "No recommendations found."} />
        ) : (
          <>
            {currentData.map((item: any, index: number) => (
              <div key={item.id || index} className="group flex flex-col sm:flex-row items-center justify-between rounded-3xl bg-[#f9f9f9] p-4 pr-5 transition-colors hover:bg-[#f0f0f0] gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm`}>
                    {index % 3 === 0 ? <BookOpen size={24} className="text-black" /> : index % 3 === 1 ? <Target size={24} className="text-black" /> : <Zap size={24} className="text-black" />}
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-black">{item.title || item.skillName || 'Action Item'}</h4>
                    <p className="text-[13px] font-medium text-slate-500 line-clamp-1 max-w-[250px]">{item.description || item.category || 'Skill Gap'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500">
                    <Clock size={16} />
                    <span>{item.type === 'critical' || item.severity?.toUpperCase() === 'HIGH' ? 'High Prio' : (item.type || 'Med Prio')}</span>
                  </div>
                  
                  {/* Progress Bar for Skill Gaps */}
                  {activeTab === 'gaps' && item.progress !== undefined && (
                    <div className="flex items-center gap-3 min-w-[100px]">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="text-[13px] font-black text-black">{item.progress}%</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-[14px] font-bold text-black min-w-[60px]">
                    <Flame size={16} className="text-black" />
                    {item.severity}
                  </div>
                  <button 
                    onClick={() => navigate(ROUTES.DASHBOARD_STUDENT_ROADMAP)}
                    className="rounded-2xl bg-black px-5 py-2.5 text-[13px] font-bold text-white transition-transform hover:scale-105 active:scale-95"
                  >
                    View skill
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 text-black'}`}
                >
                  <ArrowLeft size={16} />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`h-10 w-10 rounded-full text-[14px] font-bold transition-colors ${page === i + 1 ? 'bg-black text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-black'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
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
  const { data } = useDashboardData<RoadmapProgress>(
    () => studentDashboardService.getRoadmapProgress()
  )
  
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

// 6. Skill Radar Chart
export const SkillRadarChartWidget = () => {
  const { data, status } = useDashboardData<SkillResponse>(
    () => studentDashboardService.compareRoadmapSkills()
  )
  const selectedIds = new Set(data?.selectedSkills.map((skill) => skill.skillId) ?? [])
  const missingIds = new Set(data?.missingSkills.map((skill) => skill.skillId) ?? [])

  const chartData = data?.requiredSkills.map(({ skill, importanceLevel, progress }) => {
    const current = progress !== undefined ? progress : (missingIds.has(skill.skillId) ? 0 : selectedIds.has(skill.skillId) ? 100 : 0)
    const target = importanceLevel === "High" ? 100 : importanceLevel === "Medium" ? 70 : 40
    return {
      subject: skill.skillName.substring(0, 10),
      Current: current,
      Target: target,
      fullMark: 100,
    }
  }) || []

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-black text-black tracking-tight">Skill Match</h2>
      </div>

      <div className="h-[250px] w-full rounded-3xl bg-[#f9f9f9] p-4">
        {status === "loading" ? (
          <LoadingState rows={4} />
        ) : status === "error" || chartData.length === 0 ? (
          <EmptyState title="No skills to compare" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Target" dataKey="Target" stroke="#94a3b8" strokeWidth={2} fill="#cbd5e1" fillOpacity={0.3} />
              <Radar name="Current" dataKey="Current" stroke="#000000" strokeWidth={2} fill="#000000" fillOpacity={0.6} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '12px', fontWeight: 600 }} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}


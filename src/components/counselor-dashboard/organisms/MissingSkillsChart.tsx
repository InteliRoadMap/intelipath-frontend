import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"
import { Search, TrendingDown } from "lucide-react"
import { useMissingSkills } from "@/features/counselor-dashboard/hooks/useCounselorDashboard"
import { ErrorBanner } from "@/components/counselor-dashboard/atoms/ErrorBanner"
import { EmptyState } from "@/components/counselor-dashboard/atoms/EmptyState"
import { ChartTooltip } from "@/components/counselor-dashboard/atoms/ChartTooltip"

export function MissingSkillsChart({
  careerFilter,
  onTotalLoaded
}: {
  careerFilter?: string
  onTotalLoaded?: (total: number) => void
}) {
  const {
    data,
    totalStudents,
    loading,
    error,
    searchInput,
    setSearchInput,
    activeSearch,
    resolvedCareerName,
    handleSearch
  } = useMissingSkills(careerFilter, onTotalLoaded)

  const getSkillColor = (count: number) => {
    if (totalStudents === 0) return "#00FF19FF"
    const ratio = count / totalStudents
    if (ratio >= 0.75) return "#FF0000FF"
    if (ratio >= 0.5) return "#FF8000FF"
    if (ratio >= 0.25) return "#FFE900FF"
    return "#00FF19FF"
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
      {/* Chart Box */}
      <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] widget-container group hover:border-[#00838f]/30 transition-colors flex flex-col md:h-[480px]">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-slate-900 widget-title">
              Missing Skills
            </h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {resolvedCareerName
                ? `Missing skills for ${resolvedCareerName}`
                : activeSearch
                  ? `Missing skills for ${activeSearch}`
                  : "Search a career to view missing skills"}
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search career..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all w-full md:w-[220px]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#00838f] text-white px-4 py-2 rounded-xl text-[13px] font-semibold hover:bg-[#006064] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="h-[320px] w-full flex items-center justify-center relative flex-1 min-h-0">
          {!activeSearch ? (
            <EmptyState
              icon={Search}
              label="Search a career to see skill gaps"
            />
          ) : loading ? (
            <div className="w-[280px] h-[280px] rounded-full bg-slate-100 animate-pulse mx-auto" />
          ) : error ? (
            <ErrorBanner message={error} />
          ) : data.length === 0 ? (
            <EmptyState
              icon={TrendingDown}
              label="No skill gap data available"
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.slice(0, 10)}
                margin={{ top: 20, right: 10, left: -20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="skillName"
                  tick={
                    {
                      fontSize: 11,
                      fill: "#64748b",
                      angle: -45,
                      textAnchor: "end",
                      dy: 10
                    } as any
                  }
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={80}
                  tickFormatter={(value) =>
                    value.length > 15 ? value.substring(0, 15) + "..." : value
                  }
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  content={
                    <ChartTooltip
                      labelKey="skillName"
                      valueColorClass="text-rose-500"
                    />
                  }
                  isAnimationActive={false}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {data.map((item, idx) => (
                    <Cell key={idx} fill={getSkillColor(item.count)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Legend / Table Box */}
      <div className="w-full xl:w-[380px] bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] widget-container group hover:border-[#00838f]/30 transition-colors flex flex-col md:h-[480px]">
        {activeSearch && !loading && !error && data.length > 0 ? (
          <>
            <div className="flex items-center justify-between pb-4 mb-4 shrink-0 border-b border-slate-100">
              <span className="text-[16px] font-bold text-slate-800">
                Skill Details
              </span>
              <span className="bg-[#fff1f2] text-[#e11d48] px-3 py-1 rounded-lg text-[13px] font-bold">
                Total: {totalStudents}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
              {data.map((item) => (
                <div
                  key={item.skillName}
                  className="flex items-center w-full group/btn hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-all"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-sm shrink-0 shadow-sm"
                    style={{ background: getSkillColor(item.count) }}
                  />
                  <span className="text-[13.5px] text-slate-600 font-medium ml-3 text-left">
                    {item.skillName}
                  </span>
                  <span className="text-[14px] font-bold text-slate-900 ml-auto pl-2">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
            <TrendingDown size={36} className="mb-3 text-slate-200" />
            <p className="text-[14px] font-medium text-center px-4">
              Search a career to view detailed skill breakdown
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

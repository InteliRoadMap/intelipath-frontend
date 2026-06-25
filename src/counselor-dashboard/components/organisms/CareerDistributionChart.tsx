import React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen } from "lucide-react"
import { useCareerDistribution } from "@/counselor-dashboard/hooks/useCounselorDashboard"
import { ErrorBanner } from "@/counselor-dashboard/components/atoms/ErrorBanner"
import { EmptyState } from "@/counselor-dashboard/components/atoms/EmptyState"
import { ChartTooltip } from "@/counselor-dashboard/components/atoms/ChartTooltip"

const CAREER_COLORS = [
  "#024abd",
  "#026bff",
  "#1876ff",
  "#418dff",
  "#4293ff",
  "#69b9ff",
  "#7ad1ff",
  "#8dcdfb"
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function CareerDistributionChart({
  onSelectCareer,
  onTotalLoaded
}: {
  onSelectCareer?: (name: string) => void
  onTotalLoaded?: (total: number) => void
}) {
  const { data, loading, error, total } = useCareerDistribution(onTotalLoaded)

  const getDistributionColor = (idx: number) => {
    if (data.length <= 1) return CAREER_COLORS[0]
    const colorIdx = Math.round(
      (idx / (data.length - 1)) * (CAREER_COLORS.length - 1)
    )
    return CAREER_COLORS[Math.min(colorIdx, CAREER_COLORS.length - 1)]
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] widget-container group hover:border-[#00838f]/30 transition-colors flex flex-col md:h-[450px]">
      <div className="flex flex-col md:flex-row gap-8 items-stretch w-full chart-wrapper flex-1 md:min-h-0">
        <div className="flex-1 w-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-[18px] font-bold text-slate-900 widget-title">
              Students by Career Path
            </h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Distribution of students across career tracks
            </p>
          </div>

          <div className="h-[320px] w-full flex items-center justify-center relative">
            {loading ? (
              <div className="w-[280px] h-[280px] rounded-full bg-slate-100 animate-pulse mx-auto" />
            ) : error ? (
              <ErrorBanner message="Cannot load career distribution data." />
            ) : data.length === 0 ? (
              <EmptyState icon={BookOpen} label="No career data available" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={
                      <ChartTooltip
                        labelKey="careerName"
                        valueColorClass="text-[#006064]"
                      />
                    }
                    isAnimationActive={false}
                  />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={140}
                    dataKey="studentCount"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {data.map((item, idx) => (
                      <Cell
                        key={idx}
                        fill={getDistributionColor(idx)}
                        cursor="pointer"
                        onClick={() => onSelectCareer?.(item.careerName)}
                        className="hover:opacity-80 transition-opacity outline-none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Legend on the right, aligned to top */}
        {!loading && !error && data.length > 0 && (
          <div className="w-full md:w-[35%] flex flex-col self-stretch min-h-0 bg-transparent md:pl-5 pt-2 legend-container">
            <div className="flex items-center justify-between pb-3 mb-3 shrink-0">
              <span className="text-[15px] font-bold text-slate-800">
                Total Students
              </span>
              <span className="bg-[#e6f7f8] text-[#006064] px-3 py-1 rounded-lg text-[14px] font-bold">
                {total}
              </span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
              {data.map((item, idx) => (
                <button
                  key={item.careerName}
                  type="button"
                  onClick={() => onSelectCareer?.(item.careerName)}
                  className="flex items-center w-full group/btn hover:bg-white p-2 -mx-2 rounded-lg transition-all"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-sm shrink-0 shadow-sm"
                    style={{ background: getDistributionColor(idx) }}
                  />
                  <span className="text-[13.5px] text-slate-600 font-medium ml-3 text-left line-clamp-1 group-hover/btn:text-[#00838f] transition-colors">
                    {item.careerName}
                  </span>
                  <span className="text-[14px] font-bold text-slate-900 ml-auto pl-2">
                    {item.studentCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

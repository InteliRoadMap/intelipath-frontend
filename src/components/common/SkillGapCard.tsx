import React from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from "recharts"

const data = [
  { subject: "Algorithm", A: 80, B: 90, fullMark: 100 },
  { subject: "Backend", A: 70, B: 85, fullMark: 100 },
  { subject: "System Design", A: 50, B: 80, fullMark: 100 },
  { subject: "DevOps", A: 65, B: 70, fullMark: 100 },
  { subject: "Database", A: 60, B: 75, fullMark: 100 }
]

export const SkillGapCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full">
      <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
        Skill Gap Analysis
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#f0f0f0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Your Level"
              dataKey="A"
              stroke="#1E50FF"
              fill="#1E50FF"
              fillOpacity={0.2}
            />
            <Radar
              name="Required"
              dataKey="B"
              stroke="#F59E0B"
              fill="none"
              strokeDasharray="3 3"
            />
            <Legend
              wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
              iconType="circle"
              iconSize={8}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

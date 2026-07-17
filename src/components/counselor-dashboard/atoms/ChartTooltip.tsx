import React from "react";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  labelKey: string;
  valueColorClass: string;
}

export function ChartTooltip({ active, payload, labelKey, valueColorClass }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 z-50">
      <p className="text-[13px] font-bold text-slate-900">
        {payload[0].payload[labelKey]}
      </p>
      <p className={`text-[13px] font-semibold mt-0.5 ${valueColorClass}`}>
        {payload[0].value} students
      </p>
    </div>
  )
}

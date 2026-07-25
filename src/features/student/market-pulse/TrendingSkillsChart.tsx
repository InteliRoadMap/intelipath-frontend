import React, { useMemo } from 'react';
import { SkillTrend } from './marketPulse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Props {
  data: SkillTrend[];
}

const COLORS = ['#00838f', '#ffb300', '#e53935', '#43a047', '#3949ab'];

export default function TrendingSkillsChart({ data }: Props) {
  const displayData = data || [];

  const chartData = useMemo(() => {
    const dateMap = new Map<string, any>();

    displayData.forEach(skill => {
      skill.dataPoints.forEach(dp => {
        const existing = dateMap.get(dp.date) || { date: dp.date };
        // Coerce to a real number so recharts uses a sorted numeric Y-axis
        // instead of treating the values as unordered categories.
        existing[skill.skillName] = Number(dp.jobsNeeded) || 0;
        dateMap.set(dp.date, existing);
      });
    });

    return Array.from(dateMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [displayData]);

  const skillNames = useMemo(() => displayData.map(d => d.skillName), [displayData]);

  const chartConfig = useMemo(() => {
    const config: Record<string, any> = {};
    skillNames.forEach((skill, index) => {
      const labelStr = String(skill || `Skill ${index}`);
      const safeKey = labelStr.replace(/[^a-zA-Z0-9]/g, "");
      config[safeKey] = {
        label: labelStr,
        color: COLORS[index % COLORS.length]
      };
    });
    return config;
  }, [skillNames]);

  // Honest empty state instead of fabricated demo data.
  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-[13px] font-medium text-slate-500">No data available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            dy={10}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis
            type="number"
            domain={[0, 'auto']}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => `${value} jobs`}
            width={70}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          {skillNames.map((skill, index) => {
            const labelStr = String(skill || `Skill ${index}`);
            const safeKey = labelStr.replace(/[^a-zA-Z0-9]/g, "");
            return (
              <Line 
                key={skill}
                type="monotone" 
                dataKey={skill} 
                name={safeKey}
                stroke={`var(--color-${safeKey})`} 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: `var(--color-${safeKey})` }}
              />
            );
          })}
        </LineChart>
      </ChartContainer>
    </div>
  );
}

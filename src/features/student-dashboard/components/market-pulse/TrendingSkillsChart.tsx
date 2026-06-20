import React, { useMemo } from 'react';
import { SkillTrend } from '../../types/marketPulse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Props {
  data: SkillTrend[];
}

const COLORS = ['#00838f', '#ffb300', '#e53935', '#43a047', '#3949ab'];

const MOCK_DATA: SkillTrend[] = [
  {
    skillName: 'ReactJS',
    dataPoints: [
      { date: '2026-05-20', jobsNeeded: 120 },
      { date: '2026-05-25', jobsNeeded: 135 },
      { date: '2026-06-01', jobsNeeded: 125 },
      { date: '2026-06-10', jobsNeeded: 150 },
      { date: '2026-06-19', jobsNeeded: 180 },
    ]
  },
  {
    skillName: 'Spring Boot',
    dataPoints: [
      { date: '2026-05-20', jobsNeeded: 90 },
      { date: '2026-05-25', jobsNeeded: 85 },
      { date: '2026-06-01', jobsNeeded: 100 },
      { date: '2026-06-10', jobsNeeded: 110 },
      { date: '2026-06-19', jobsNeeded: 105 },
    ]
  },
  {
    skillName: 'TypeScript',
    dataPoints: [
      { date: '2026-05-20', jobsNeeded: 60 },
      { date: '2026-05-25', jobsNeeded: 70 },
      { date: '2026-06-01', jobsNeeded: 85 },
      { date: '2026-06-10', jobsNeeded: 95 },
      { date: '2026-06-19', jobsNeeded: 120 },
    ]
  }
];

export default function TrendingSkillsChart({ data }: Props) {
  const displayData = (!data || data.length === 0) ? MOCK_DATA : data;

  const chartData = useMemo(() => {
    const dateMap = new Map<string, any>();
    const skills = new Set<string>();

    displayData.forEach(skill => {
      skills.add(skill.skillName);
      skill.dataPoints.forEach(dp => {
        const existing = dateMap.get(dp.date) || { date: dp.date };
        existing[skill.skillName] = dp.jobsNeeded;
        dateMap.set(dp.date, existing);
      });
    });

    return Array.from(dateMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [displayData]);

  if (!chartData || chartData.length === 0) return null;

  const skillNames = displayData.map(d => d.skillName);

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

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

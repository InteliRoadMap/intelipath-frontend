import React, { useState } from 'react';
import { SalaryBracket } from '../../types/marketPulse';
import { PieChart, Pie, Cell, Sector } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Props {
  data: SalaryBracket[];
}

const COLORS = ['#00838f', '#00bcd4', '#4dd0e1', '#b2ebf2', '#006064'];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#1e293b" fontSize={16} fontWeight={800}>
        {payload.category}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#64748b" fontSize={13} fontWeight={600}>
        {value} jobs ({(percent * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
};

export default function SalaryOverviewChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data || data.length === 0) return null;

  const chartConfig = React.useMemo(() => {
    const config: Record<string, any> = {};
    data.forEach((entry, index) => {
      const labelStr = String(entry.category || `Bracket ${index}`);
      const safeKey = labelStr.replace(/[^a-zA-Z0-9]/g, "");
      config[safeKey] = {
        label: labelStr,
        color: COLORS[index % COLORS.length]
      };
    });
    return config;
  }, [data]);

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={3}
            dataKey="jobCount"
            nameKey="category"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {data.map((entry, index) => {
              const labelStr = String(entry.category || `Bracket ${index}`);
              const safeKey = labelStr.replace(/[^a-zA-Z0-9]/g, "");
              return (
                <Cell key={`cell-${index}`} fill={`var(--color-${safeKey})`} />
              );
            })}
          </Pie>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}

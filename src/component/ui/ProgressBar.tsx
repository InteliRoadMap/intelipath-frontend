import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number;
}

export const ProgressBar = ({ label, percentage }: ProgressBarProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className="bg-[#1E50FF] h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

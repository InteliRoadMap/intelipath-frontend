import React from 'react';
import { TriangleAlert } from 'lucide-react';
import { SkillGap } from '../../types/dashboard';

interface SkillGapsListProps {
  gaps: SkillGap[];
}

export const SkillGapsList = ({ gaps }: SkillGapsListProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <TriangleAlert size={20} className="text-red-500" strokeWidth={2.5} />
        <h3 className="text-lg font-bold text-[#1A1F36]">Skill Gaps</h3>
      </div>

      <div className="flex-grow space-y-4 overflow-y-auto pr-2">
        {gaps.map((gap) => {
          const isCritical = gap.type === 'critical';
          return (
            <div 
              key={gap.id} 
              className={`rounded-xl p-4 border-l-4 ${
                isCritical 
                  ? 'bg-red-50/50 border-red-500' 
                  : 'bg-cyan-50/50 border-cyan-500'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isCritical ? 'text-red-700' : 'text-[#0E7490]'
                }`}>
                  {gap.tag}
                </span>
                <span className={`text-[10px] font-medium ${
                  isCritical ? 'text-red-500' : 'text-[#0E7490]'
                }`}>
                  {gap.severity}
                </span>
              </div>
              <h4 className={`font-bold text-sm mb-1 ${
                isCritical ? 'text-red-900' : 'text-[#164E63]'
              }`}>
                {gap.title}
              </h4>
              <p className={`text-xs leading-relaxed ${
                isCritical ? 'text-red-700/80' : 'text-cyan-800/80'
              }`}>
                {gap.desc}
              </p>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-[#1A1F36] hover:bg-gray-50 transition-colors shadow-sm">
        Download Detailed Report
      </button>
    </div>
  );
};

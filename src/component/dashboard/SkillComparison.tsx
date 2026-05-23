import React from 'react';
import { Skill } from '../../types/dashboard';

interface SkillComparisonProps {
  skills: Skill[];
}

export const SkillComparison = ({ skills }: SkillComparisonProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1A1F36]">Skill Comparison</h3>
        <div className="flex items-center gap-4 text-[10px] font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-[#175C99] rounded-[2px]"></div>
            Current
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-[#93C5FD] rounded-[2px]"></div>
            Target
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>{skill.name}</span>
              <span className="text-gray-500 font-medium">{skill.current}% / {skill.target}%</span>
            </div>
            
            <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              {/* Target Bar (Light Blue) */}
              <div 
                className="absolute top-0 left-0 h-full bg-[#93C5FD] rounded-full" 
                style={{ width: `${skill.target}%` }}
              ></div>
              {/* Current Bar (Dark Blue) */}
              <div 
                className="absolute top-0 left-0 h-full bg-[#175C99] rounded-full z-10" 
                style={{ width: `${skill.current}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

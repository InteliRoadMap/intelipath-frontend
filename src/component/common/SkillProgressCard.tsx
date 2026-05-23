import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';

export const SkillProgressCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
      <h3 className="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider">Skill Progress</h3>
      
      <div className="flex justify-center mb-6 relative">
          <div className="w-20 h-20 rounded-full border-[6px] border-gray-100 border-t-[#1E50FF] border-r-[#1E50FF] flex items-center justify-center transform -rotate-45">
            <div className="transform rotate-45 flex flex-col items-center">
              <span className="font-bold text-xl text-[#1E50FF]">75%</span>
            </div>
          </div>
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 -translate-x-1/2 ml-10">
            <span className="text-sm font-medium text-[#1E50FF]">Overall</span>
          </div>
      </div>

      <div className="space-y-4">
        <ProgressBar label="Frontend" percentage={60} />
        <ProgressBar label="Backend" percentage={70} />
        <ProgressBar label="Database" percentage={60} />
        <ProgressBar label="DevOps" percentage={65} />
        <ProgressBar label="System Design" percentage={50} />
      </div>
    </div>
  );
};

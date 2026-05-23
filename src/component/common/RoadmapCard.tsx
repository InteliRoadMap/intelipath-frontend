import React from 'react';
import { Lock } from 'lucide-react';

export const RoadmapCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Your Learning Roadmap</h3>
        <span className="text-[#1E50FF] font-bold text-sm">68%</span>
      </div>

      {/* Steps */}
      <div className="relative flex justify-between mb-8 px-2">
        <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-[#1E50FF]"></div>
        
        <div className="flex flex-col items-center z-10 gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1E50FF] flex items-center justify-center text-white border-2 border-white shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="text-[10px] text-gray-500 text-center w-16">Fundamentals</span>
        </div>
        
        <div className="flex flex-col items-center z-10 gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1E50FF] flex items-center justify-center text-white border-2 border-white shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="text-[10px] text-gray-500 text-center w-16">Frontend</span>
        </div>

        <div className="flex flex-col items-center z-10 gap-2">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-[#1E50FF] flex items-center justify-center text-[#1E50FF] shadow-sm">
            <span className="text-xs font-bold">4</span>
          </div>
          <span className="text-[10px] font-medium text-gray-700 text-center w-16">Backend</span>
        </div>

        <div className="flex flex-col items-center z-10 gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
            <Lock size={12} />
          </div>
          <span className="text-[10px] text-gray-400 text-center w-16">System Design</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center mt-2">
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="text-xs text-gray-400">Learn</div>
          <div className="text-[#1E50FF] font-bold text-lg">12</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="text-xs text-gray-400">Track</div>
          <div className="text-[#1E50FF] font-bold text-lg">8</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="text-xs text-gray-400">Improve</div>
          <div className="text-[#1E50FF] font-bold text-lg">5</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="text-xs text-gray-400">Achieve</div>
          <div className="text-[#1E50FF] font-bold text-lg">3</div>
        </div>
      </div>
    </div>
  );
};

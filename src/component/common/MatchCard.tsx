import React from 'react';

export const MatchCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center h-full">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1E50FF] mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9 3h2v2h-2v-2zm-4 0h2v2H7v-2zm0 4h10v2H7v-2z"></path><path d="M16 5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4v2h16V5h-4z"></path></svg>
      </div>
      <h4 className="font-bold text-[#1A1F36]">Backend Developer</h4>
      <div className="text-[#1E50FF] font-bold mt-1">95% Match</div>
    </div>
  );
};

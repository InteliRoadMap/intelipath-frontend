import React from 'react';
import mentorImg from '../../assets/ai_mentor.png';

export const MentorCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 mb-4 relative">
        <img src={mentorImg} alt="AI Mentor" className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-100" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full border-2 border-white z-10"></div>
      </div>
      <p className="text-[#1E50FF] text-sm font-medium leading-relaxed max-w-[200px]">
        Hi! I'm your AI mentor.
        I'll help you navigate
        your learning journey.
      </p>
    </div>
  );
};

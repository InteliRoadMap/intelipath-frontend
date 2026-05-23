import React from 'react';
import { Check, User, Lock, Info } from 'lucide-react';

export const DetailedRoadmap = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-[#1A1F36]">Detailed Roadmap Progress</h3>
        <div className="flex bg-gray-100 rounded-full p-1">
          <button className="px-4 py-1.5 text-xs font-medium bg-[#1E50FF] text-white rounded-full shadow-sm">
            Foundations
          </button>
          <button className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700">
            Advanced
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between px-4 mb-8">
        <div className="absolute top-4 left-8 right-8 h-1 bg-gray-100"></div>
        <div className="absolute top-4 left-8 w-[60%] h-1 bg-[#1E50FF]"></div>
        
        <div className="flex flex-col items-center z-10 gap-3 w-20">
          <div className="w-9 h-9 rounded-full bg-[#1E50FF] flex items-center justify-center text-white ring-4 ring-white">
            <Check size={16} strokeWidth={3} />
          </div>
          <span className="text-xs font-bold text-[#1A1F36]">Linux Admin</span>
        </div>
        
        <div className="flex flex-col items-center z-10 gap-3 w-20">
          <div className="w-9 h-9 rounded-full bg-[#1E50FF] flex items-center justify-center text-white ring-4 ring-white">
            <Check size={16} strokeWidth={3} />
          </div>
          <span className="text-xs font-bold text-[#1A1F36]">Networking</span>
        </div>

        <div className="flex flex-col items-center z-10 gap-3 w-24">
          <div className="w-9 h-9 rounded-full bg-[#1E50FF] flex items-center justify-center text-white ring-4 ring-white">
            <Check size={16} strokeWidth={3} />
          </div>
          <span className="text-xs font-bold text-[#1A1F36]">Docker & K8s</span>
        </div>

        <div className="flex flex-col items-center z-10 gap-3 w-24">
          <div className="w-9 h-9 rounded-full bg-white border-2 border-[#1E50FF] flex items-center justify-center text-[#1E50FF] ring-4 ring-white shadow-sm">
            <User size={16} />
          </div>
          <span className="text-xs font-bold text-[#1E50FF]">System Design</span>
        </div>

        <div className="flex flex-col items-center z-10 gap-3 w-20">
          <div className="w-9 h-9 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center text-gray-300 ring-4 ring-white">
            <Lock size={14} />
          </div>
          <span className="text-xs font-medium text-gray-400">Serverless</span>
        </div>
      </div>

      {/* AI Tip Alert */}
      <div className="bg-[#F8FAFF] rounded-xl p-4 flex gap-3 border border-blue-50">
        <div className="text-[#1E50FF] mt-0.5 flex-shrink-0">
          <Info size={18} />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          AI Tip: You're learning System Design 15% faster than your goal. Focus on <strong className="font-semibold text-gray-800">**Caching Strategies**</strong> before Friday's mock interview.
        </p>
      </div>
    </div>
  );
};

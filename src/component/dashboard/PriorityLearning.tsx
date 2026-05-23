import React from 'react';
import { Network, Cpu } from 'lucide-react';

export const PriorityLearning = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-[#1A1F36] mb-4">Bridge Your Gaps - Priority Learning</h3>
      
      <div className="grid grid-cols-3 gap-6">
        
        {/* Card 1 - Course */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#0ea5e9] flex items-center justify-center text-white shadow-md">
              <Network size={20} />
            </div>
            <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase tracking-wider rounded-full">
              Course
            </span>
          </div>
          <h4 className="font-bold text-lg text-[#1A1F36] mb-2 leading-tight">Mastering Terraform</h4>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-grow">
            Learn Infrastructure as Code to bridge your critical Cloud Security...
          </p>
          <div className="flex gap-3">
            <button className="flex-1 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm font-semibold rounded-lg transition-colors">
              Start Now
            </button>
            <button className="flex-1 py-2 bg-white border border-[#0284c7] text-[#0284c7] hover:bg-cyan-50 text-sm font-semibold rounded-lg transition-colors">
              Details
            </button>
          </div>
        </div>

        {/* Card 2 - Project */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#0ea5e9] flex items-center justify-center text-white shadow-md">
              <Cpu size={20} />
            </div>
            <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase tracking-wider rounded-full">
              Project
            </span>
          </div>
          <h4 className="font-bold text-lg text-[#1A1F36] mb-2 leading-tight">Microservices in Go</h4>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed flex-grow">
            Hands-on application of Kubernetes and Go in a production-...
          </p>
          <div className="flex gap-3">
            <button className="flex-1 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm font-semibold rounded-lg transition-colors">
              Start Now
            </button>
            <button className="flex-1 py-2 bg-white border border-[#0284c7] text-[#0284c7] hover:bg-cyan-50 text-sm font-semibold rounded-lg transition-colors">
              Details
            </button>
          </div>
        </div>

        {/* Card 3 - Trend */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">
            Market Demand Trend
          </div>
          <div className="flex items-end gap-3 mb-6">
            <div className="text-4xl font-bold text-[#0284c7]">24%</div>
            <div className="pb-1">
              <div className="text-xs font-bold text-[#1A1F36]">YoY Growth</div>
              <div className="text-[10px] text-gray-500">Cloud Architect roles</div>
            </div>
          </div>
          
          {/* Simple CSS Bar Chart */}
          <div className="mt-auto flex items-end justify-between h-16 gap-2">
            {[40, 50, 60, 55, 75, 100].map((height, i) => (
              <div 
                key={i} 
                className="w-full bg-[#0284c7] rounded-sm transition-all duration-500 hover:opacity-80"
                style={{ 
                  height: `${height}%`,
                  opacity: i === 5 ? 1 : 0.2 + (i * 0.15) 
                }}
              ></div>
            ))}
          </div>
          <div className="text-[8px] text-center text-gray-400 mt-2">Projected demand for K8s mastery</div>
        </div>

      </div>
    </div>
  );
};

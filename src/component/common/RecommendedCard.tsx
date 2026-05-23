import React from 'react';
import { Layout, Database, MonitorPlay } from 'lucide-react';

export const RecommendedCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
      <h3 className="text-sm font-bold text-gray-700 mb-5 uppercase tracking-wider">Recommended For You</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E50FF]">
            <Layout size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1A1F36]">System Design Basics</div>
            <div className="text-xs text-gray-500">10 lessons</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Database size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1A1F36]">Database Indexing</div>
            <div className="text-xs text-gray-500">8 lessons</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
            <MonitorPlay size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1A1F36]">Docker Fundamentals</div>
            <div className="text-xs text-gray-500">12 lessons</div>
          </div>
        </div>
      </div>
    </div>
  );
};

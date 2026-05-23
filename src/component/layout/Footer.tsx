import React from 'react';
import { BookOpen, GraduationCap, Trophy } from 'lucide-react';

export const Footer = () => {
  return (
    <div className="bg-banner mt-auto py-6">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 flex flex-col sm:flex-row justify-between items-center text-white">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <BookOpen size={24} className="text-blue-200" />
          <div>
            <div className="font-bold text-xl">500+</div>
            <div className="text-sm text-blue-200">AI Roadmaps</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <GraduationCap size={24} className="text-amber-700" fill="currentColor" />
          <div>
            <div className="font-bold text-xl">20K+</div>
            <div className="text-sm text-blue-200">Students</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Trophy size={24} className="text-amber-400" />
          <div>
            <div className="font-bold text-xl">95%</div>
            <div className="text-sm text-blue-200">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Feedback } from '../../types/dashboard';

interface MentorFeedbackProps {
  feedbacks: Feedback[];
}

export const MentorFeedback = ({ feedbacks }: MentorFeedbackProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={20} className="text-[#1E50FF]" />
        <h3 className="text-lg font-bold text-[#1A1F36]">Mentor Feedback</h3>
      </div>

      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  {fb.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1F36]">{fb.author}</h4>
                  <div className="text-[10px] text-gray-500">{fb.role}</div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 group-hover:text-[#1E50FF] transition-colors">{fb.time}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mt-3 pl-11">
              "{fb.content}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

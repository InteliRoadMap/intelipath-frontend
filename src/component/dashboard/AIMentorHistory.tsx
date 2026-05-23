import React from 'react';
import { ExternalLink, Send } from 'lucide-react';

export const AIMentorHistory = () => {
  return (
    <div className="bg-[#F8FAFF] rounded-2xl p-6 border border-gray-200 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#1A1F36]">AI Mentor - History</h3>
        <button className="text-[#1E50FF] hover:text-blue-700">
          <ExternalLink size={18} />
        </button>
      </div>

      <div className="flex-grow space-y-4 overflow-y-auto mb-6">
        {/* Item 1 */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-[10px] font-semibold text-gray-500 mb-1">Yesterday</div>
          <h4 className="font-bold text-sm text-[#1A1F36] mb-1 truncate">Explain the difference between gRPC...</h4>
          <p className="text-xs text-gray-500 truncate">AI: gRPC uses HTTP/2 and Protobuf for...</p>
        </div>

        {/* Item 2 */}
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1E50FF]"></div>
          <div className="text-[10px] font-bold text-[#1E50FF] mb-1">Newest</div>
          <h4 className="font-bold text-sm text-[#1A1F36] mb-1 truncate">Code review: Microservices in Go</h4>
          <p className="text-xs text-gray-500 truncate">AI: Pay attention to synchronous error...</p>
        </div>
      </div>

      {/* Input */}
      <div className="relative mt-auto">
        <input 
          type="text" 
          placeholder="Ask your AI Mentor..." 
          className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1E50FF] focus:ring-1 focus:ring-[#1E50FF] bg-white shadow-sm placeholder-gray-400"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E50FF] hover:text-blue-700">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

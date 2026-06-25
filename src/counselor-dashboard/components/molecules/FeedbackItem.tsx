import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import type { Feedback } from "@/api/counselorApi";
import { ROUTES } from "@/shared";
import { useNavigate } from "react-router-dom";

const FEEDBACK_TYPE_COLOR: Record<string, string> = {
  CAREER: "bg-[#e0f2fe] text-[#0284c7]",
  SKILL: "bg-[#f0fdf4] text-[#16a34a]",
  GENERAL: "bg-[#fef9c3] text-[#ca8a04]",
  ACADEMIC: "bg-[#f3e8ff] text-[#7c3aed]",
  OTHER: "bg-slate-100 text-slate-600"
}

export function FeedbackItem({ feedback: fb }: { feedback: Feedback }) {
  const navigate = useNavigate();
  
  const name = fb.senderName || "Unknown Student";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "UN";
  const typeStyle = FEEDBACK_TYPE_COLOR[fb.type] ?? FEEDBACK_TYPE_COLOR.OTHER;
  const dateStr = new Date(fb.createAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return (
    <div
      className="feedback-item py-4 flex gap-3 hover:bg-slate-50 -mx-2 px-3 rounded-xl transition-all hover:shadow-sm group/fb"
    >
      <div className="w-9 h-9 rounded-full bg-[#e0f2fe] text-[#006064] flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm group-hover/fb:shadow-md transition-shadow">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px] font-bold text-slate-900 group-hover/fb:text-[#006064] transition-colors">
            {name}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyle}`}
          >
            {fb.type}
          </span>
        </div>
        <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2">
          {fb.content}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock size={11} />
            {dateStr}
          </div>
          <button
            type="button"
            onClick={() =>
              navigate(
                ROUTES.COUNSELOR_FEEDBACK +
                  "?studentId=" +
                  fb.senderId +
                  "&tab=feedback"
              )
            }
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006064] hover:text-white bg-[#e0f2fe] hover:bg-[#006064] px-2.5 py-1 rounded-md transition-all shadow-sm group-hover/fb:translate-x-0.5"
          >
            Reply <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

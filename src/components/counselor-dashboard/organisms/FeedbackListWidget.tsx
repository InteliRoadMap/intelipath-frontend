import React from "react"
import { MessageSquare } from "lucide-react"
import { useFeedbackList } from "@/features/counselor-dashboard/hooks/useCounselorDashboard"
import { ErrorBanner } from "@/components/counselor-dashboard/atoms/ErrorBanner"
import { EmptyState } from "@/components/counselor-dashboard/atoms/EmptyState"
import { FeedbackItem } from "@/components/counselor-dashboard/molecules/FeedbackItem"

export function FeedbackListWidget({
  onTotalLoaded
}: {
  onTotalLoaded?: (total: number) => void
}) {
  const { feedbacks, loading, error } = useFeedbackList(onTotalLoaded)

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] widget-container group hover:border-blue-400/30 transition-colors flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 widget-title">
            Student Feedback
          </h2>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Messages sent to you from students
          </p>
        </div>
        {!loading && !error && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] text-slate-600 font-semibold stats-badge">
            {feedbacks.length} feedbacks
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorBanner message="Cannot load feedback data." />
      ) : feedbacks.length === 0 ? (
        <EmptyState icon={MessageSquare} label="No feedbacks yet" />
      ) : (
        <div className="divide-y divide-slate-100 feedback-list flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
          {feedbacks.map((fb) => (
            <FeedbackItem key={fb.feedbackId} feedback={fb} />
          ))}
        </div>
      )}
    </div>
  )
}

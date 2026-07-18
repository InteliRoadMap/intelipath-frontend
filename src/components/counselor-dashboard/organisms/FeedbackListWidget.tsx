import React from "react"
import { MessageSquare } from "lucide-react"
import { useFeedbackList } from "@/features/counselor-dashboard/model/useCounselorDashboard"
import { ErrorBanner } from "@/components/counselor-dashboard/atoms/ErrorBanner"
import { EmptyState } from "@/components/counselor-dashboard/atoms/EmptyState"
import { FeedbackItem } from "@/components/counselor-dashboard/molecules/FeedbackItem"

export function FeedbackListWidget({
  onTotalLoaded
}: {
  onTotalLoaded?: (total: number) => void
}) {
  const { feedbacks, error } = useFeedbackList(onTotalLoaded)

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] widget-container group hover:border-blue-400/30 transition-colors flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 widget-title">
            History Feedback
          </h2>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Feedback history sent to your students
          </p>
        </div>
        {!error && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] text-slate-600 font-semibold stats-badge">
            {feedbacks.length} feedbacks
          </span>
        )}
      </div>

      {error ? (
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

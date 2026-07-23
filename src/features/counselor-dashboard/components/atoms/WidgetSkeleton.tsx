import React from "react";

export function WidgetSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-5 rounded bg-slate-100"
          style={{ width: `${82 - i * 10}%` }}
        />
      ))}
    </div>
  )
}

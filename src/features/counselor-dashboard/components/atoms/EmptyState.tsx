import React from "react";

export function EmptyState({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <Icon size={36} className="mb-3 text-slate-200" />
      <p className="text-[14px] font-medium">{label}</p>
    </div>
  )
}

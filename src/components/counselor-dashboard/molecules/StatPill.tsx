import React from "react";
import { StatItem } from "@/types/dashboard";

export function StatPill({ icon: Icon, label, value }: StatItem) {
  return (
    <div className="stat-pill flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2.5">
      <Icon size={16} className="text-white/80" />
      <div>
        <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </p>
        <p className="text-white text-[16px] font-bold leading-none">
          {value ?? "—"}
        </p>
      </div>
    </div>
  )
}

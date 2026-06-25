import React, { forwardRef } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { StatPill } from "@/counselor-dashboard/components/molecules/StatPill";
import { StatItem } from "@/types/dashboard";

interface CounselorHeroProps {
  stats: StatItem[];
}

export const CounselorHero = forwardRef<SVGSVGElement, CounselorHeroProps>(
  ({ stats }, sparkleRef) => {
    return (
      <div className="page-header relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003d40] via-[#005f63] to-[#00838f] p-7 md:p-9 shadow-[0_30px_60px_rgba(0,96,100,0.35)]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-[#00838f]/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-white/[0.03] blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Animated icon */}
            <div className="hero-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner">
              <Sparkles
                ref={sparkleRef}
                size={28}
                className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            </div>
            <div>
              <p className="text-white/60 text-[12px] font-semibold uppercase tracking-widest mb-1">
                Counselor Portal
              </p>
              <h1 className="text-white text-[26px] md:text-[30px] font-bold leading-tight">
                Counselor Dashboard
              </h1>
              <p className="text-white/70 text-[13px] mt-1">
                Overview of student learning, skill gaps &amp; feedback signals
              </p>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-3">
            {stats.map((stat, idx) => (
              <StatPill
                key={idx}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
              />
            ))}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-[13px] font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-2xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }
);

CounselorHero.displayName = "CounselorHero";

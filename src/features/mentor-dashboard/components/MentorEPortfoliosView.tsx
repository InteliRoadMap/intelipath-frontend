import React, { useState, useEffect, useRef } from 'react';
import { 
  Code, Star, ArrowSquareOut, PencilSimple, FolderOpen
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import mentorApi from '@/features/mentor-dashboard/api/mentorApi';

export function MentorEPortfoliosView() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setIsLoading(true);
    mentorApi.getStudentsList().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => {
      setData([]);
      setIsLoading(false);
    });
  }, []);

  useGSAP(() => {
    if (!isLoading && data && data.length > 0) {
      gsap.from(".gsap-portfolio-card", {
        y: 20,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all"
      });
    }
  }, { scope: containerRef, dependencies: [isLoading, data] });

  return (
    <div ref={containerRef} className="pb-10">
      <div className="mb-8">
        <h2 className="text-[24px] font-bold text-slate-900 tracking-tight mb-2">Student E-Portfolios</h2>
        <p className="text-[14px] text-slate-500 font-medium">Review repositories synced from GitHub</p>
      </div>
      
      <div className="flex flex-col gap-6">
        {isLoading || !data || data.length === 0 ? (
          Array.from({length: 2}).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-pulse">
               <div className="h-16 bg-slate-100 rounded-2xl w-full"></div>
               <div className="h-32 bg-slate-100 rounded-2xl w-full"></div>
            </div>
          ))
        ) : (
          data.map((item: any) => (
            <div key={item.id} className="gsap-portfolio-card bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[16px] font-bold ${
                    item.status === 'Pending review' ? 'bg-[#ccfbf1] text-[#0f766e]' : 'bg-[#e0e7ff] text-[#4338ca]'
                  }`}>
                    {item.initials}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5 mb-2.5">
                      {item.major} <span className="text-slate-300">|</span> {item.year} <span className="text-slate-300">|</span> {item.role}
                    </p>
                    {item.status === 'Reviewed' ? (
                      <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-md ring-1 ring-emerald-500/20">
                        {item.status}
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md ring-1 ring-amber-500/20">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-[13px] rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm active:scale-[0.98]">
                    <ArrowSquareOut size={16} weight="bold" /> Portfolio URL
                  </button>
                  <button 
                    onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_PORTFOLIO.replace(':studentId', item.id))}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00838f] text-white font-semibold text-[13px] rounded-xl hover:bg-[#006064] transition-colors shadow-sm active:scale-[0.98]"
                  >
                    <PencilSimple size={16} weight="bold" /> Review & feedback
                  </button>
                </div>
              </div>

              {/* Repositories */}
              <div>
                <p className="text-[13px] font-bold text-slate-500 mb-4">{item.repos.length} repos synced</p>
                <div className="flex flex-col gap-3">
                  {item.repos.map((repo: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl ring-1 ring-slate-900/5 group">
                      <div className="flex items-center gap-3">
                        <Code size={18} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                        <span className="text-[14px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{repo.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                          {repo.tags.map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white text-slate-500 text-[11px] font-bold tracking-wide rounded-md ring-1 ring-slate-200 shadow-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[13px] font-bold w-12 justify-end">
                          <Star size={14} weight="fill" /> {repo.stars}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

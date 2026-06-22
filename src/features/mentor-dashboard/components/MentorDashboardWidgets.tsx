import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, ChatTeardropText, Briefcase
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import mentorApi from '@/api/mentorApi';
import { ROUTES } from '@/shared';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const WelcomeBanner = ({ user }: { user: any }) => {
  return (
    <div className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8 md:p-10 shadow-[0_30px_60px_rgba(15,23,42,0.3)] mb-8 gap-6">
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-slate-500/20 blur-3xl" />
      
      <div className="relative z-10">
        <h1 className="text-[32px] font-black text-white tracking-tight mb-2">
          Good morning, {user?.name || user?.fullName || 'Mentor'}!
        </h1>
        <p className="text-[16px] text-white/70 font-medium">
          Here is a snapshot of your mentees' activity and your recent feedback.
        </p>
      </div>
    </div>
  );
};

export const MetricWidget = ({ title, icon: Icon, data, isLoading }: { title: string, icon: any, data: any, isLoading: boolean }) => {

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} weight="regular" className="text-slate-400 group-hover:text-[#00838f] transition-colors" />
        <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase">{title}</p>
      </div>
      {isLoading || data == null ? (
        <div className="h-10 w-16 bg-slate-100 animate-pulse rounded-md"></div>
      ) : (
        <h2 className="text-[36px] font-bold text-slate-900 leading-none tracking-tight">
          {typeof data === 'object' ? (data.value ?? data.count ?? data.score ?? data.hours ?? '0') : data}
        </h2>
      )}
    </div>
  );
};

export const PendingReviewsWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setIsLoading(true);
    mentorApi.getPendingReviews().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => {
      setData([]);
      setIsLoading(false);
    });
  }, []);

  useGSAP(() => {
    if (!isLoading && data && data.length > 0) {
      gsap.to(".gsap-mentee-card", {
        scaleX: 1,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "all"
      });
      gsap.from(".gsap-progress-bar", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.2
      });
    }
  }, { scope: containerRef, dependencies: [isLoading, data] });

  return (
    <div ref={containerRef} className="mt-10">
      <h3 className="font-bold text-slate-900 text-[18px] mb-4">Your Mentees</h3>
      
      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({length: 3}).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 animate-pulse rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-slate-100 animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-48 bg-slate-100 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : !data || data.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Users size={28} className="text-slate-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">No mentees yet</h4>
            <p className="text-sm text-slate-500 max-w-sm">
              You don't have any students assigned to you at the moment. When students request a review, they will appear here.
            </p>
          </div>
        ) : (
          data.map((item: any) => (
            <div key={item.id} className="gsap-mentee-card bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-bold ${
                    (item.status || 'Pending review') === 'Pending review' ? 'bg-[#ccfbf1] text-[#0f766e]' : 'bg-[#e0e7ff] text-[#4338ca]'
                  }`}>
                    {item.initials || item.studentName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-[16px] font-bold text-slate-900">{item.studentName || item.name}</h4>
                      {(item.status || 'Pending review') === 'Reviewed' ? (
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-md ring-1 ring-emerald-500/20">
                          {item.status || 'Reviewed'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-md ring-1 ring-amber-500/20">
                          {item.status || 'Pending review'}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
                      {item.university || item.major} <span className="text-slate-300">|</span> {item.yob || item.year} <span className="text-slate-300">|</span> {item.targetCareer || item.role}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_PORTFOLIO.replace(':studentId', item.studentId || item.id))}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-[13px] rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <Briefcase size={16} weight="bold" /> Portfolio
                </button>
              </div>


            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Kept for compatibility if they are still imported somewhere, though they might be removed later
export const QuickActionsWidget = () => <div/>;
export const MentorInsightWidget = () => <div/>;
export const CareerDistributionWidget = () => <div/>;

import React, { useState, useEffect, useRef } from 'react';
import { 
  Gauge, Users, Mail, Calendar, Layers, Lightbulb, ChevronRight, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mentorApi from '@/api/mentorApi';
import { ROUTES } from '@/shared';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const WelcomeBanner = ({ user }: { user: any }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    mentorApi.getWelcomeAlert().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-4 border-[#e0f2fe] bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
          <div className="w-full h-full bg-[#006064] flex items-center justify-center text-white text-[28px] font-bold">
            {(user?.fullName?.trim().split(' ').pop() || user?.name || 'S')[0].toUpperCase()}
          </div>
        </div>
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 mb-1">
            Good morning, {user?.name || user?.fullName || 'Dr. Sarah'}
          </h1>
          <p className="text-[14px] text-slate-500">Your mentoring impact is growing this week.</p>
        </div>
      </div>

      <button className="bg-[#00838f] hover:bg-[#006064] text-white p-4 rounded-xl flex items-center gap-4 transition-colors group shadow-md sm:min-w-[320px]">
        <Mail size={24} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
        <div className="text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-0.5">Action Required</p>
          {isLoading || !data ? (
            <div className="h-5 w-40 bg-white/20 animate-pulse rounded"></div>
          ) : (
            <p className="text-[16px] font-bold">{data.alertCount} {data.alertText}</p>
          )}
        </div>
      </button>
    </div>
  );
};

export const MetricWidget = ({ title, icon: Icon, apiFunction }: { title: string, icon: any, apiFunction: () => Promise<any> }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    apiFunction().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [apiFunction]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
      <div>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-2">{title}</p>
        {isLoading || !data ? (
          <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md"></div>
        ) : (
          <h2 className="text-[32px] font-bold text-[#006064] leading-none">
            {data.value}
          </h2>
        )}
      </div>
      <div className="text-slate-300 group-hover:text-[#bae6fd] group-hover:scale-110 transition-all duration-300">
        <Icon size={40} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export const PendingReviewsWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    mentorApi.getPendingReviews().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isLoading && data && data.length > 0) {
      gsap.from(".gsap-review-item", {
        x: 30,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
        clearProps: "all"
      });
    }
  }, { scope: containerRef, dependencies: [isLoading, data] });

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-[17px]">Pending Reviews</h3>
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_STUDENTS)}
          className="text-[13px] font-bold text-[#00838f] hover:text-[#006064] transition-colors flex items-center gap-1"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col gap-4">
        {isLoading || !data || data.length === 0 ? (
          Array.from({length: 3}).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 animate-pulse rounded-xl"></div>
                <div>
                  <div className="h-5 w-32 bg-slate-100 animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-24 bg-slate-100 animate-pulse rounded"></div>
                </div>
              </div>
              <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-lg"></div>
            </div>
          ))
        ) : (
          data.map((item: any) => (
            <div key={item.id} className="gsap-review-item bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-[#00838f] hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e0f2fe] text-[#0284c7] font-bold rounded-xl flex items-center justify-center text-[15px]">
                  {item.name ? item.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800 mb-0.5 group-hover:text-[#00838f] transition-colors">{item.name}</h4>
                  <p className="text-[12px] text-slate-500">{item.course} <span className="mx-1">•</span> {item.time}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_PORTFOLIO.replace(':studentId', item.id || '1'))}
                className="px-5 py-2 border border-[#006064] text-[#006064] font-bold text-[13px] rounded-lg hover:bg-[#006064] hover:text-white transition-colors"
              >
                Review
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const QuickActionsWidget = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-[16px] font-bold leading-snug text-slate-950 mb-3">Quick Actions</h3>
      <div className="flex-1 flex flex-col gap-4">
        {/* View Students Card */}
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_STUDENTS)}
          className="flex-1 bg-[#006064] hover:bg-[#004d40] text-white rounded-2xl p-5 flex flex-col justify-center text-left relative overflow-hidden group shadow-sm transition-colors min-h-[140px]"
        >
          <Search size={24} className="mb-3 opacity-90 group-hover:scale-110 transition-transform origin-left" />
          <h4 className="text-[15px] font-bold mb-1">View Students</h4>
          <p className="text-[12px] text-teal-100/80">Find and review student profiles</p>
          <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Search size={100} />
          </div>
        </button>

        {/* Additional Quick Actions can go here in the future */}
      </div>
    </div>
  );
};

export const MentorInsightWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    mentorApi.getInsight().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  if (isLoading || !data || !data.insightText) {
    return (
      <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-6 flex items-start gap-5 animate-pulse mt-0">
        <div className="w-12 h-12 bg-[#bae6fd] rounded-full shrink-0"></div>
        <div className="flex-1">
          <div className="h-4 w-32 bg-[#bae6fd] rounded mb-3"></div>
          <div className="h-4 w-3/4 bg-[#bae6fd] rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-[#bae6fd] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-6 shadow-sm">
      <div className="w-12 h-12 bg-[#006064] text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
        <Lightbulb size={24} />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-bold text-[#006064] tracking-widest uppercase mb-2">Mentor Insight</p>
        <p className="text-[15px] text-slate-700 font-medium leading-relaxed mb-4">
          {data.insightText}
        </p>
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_STUDENTS)}
          className="flex items-center gap-2 text-[14px] font-bold text-[#00838f] hover:text-[#006064] transition-colors group"
        >
          Apply to feedback <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export const CareerDistributionWidget = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mentorApi.getCareerDistribution().then(res => {
      // Ensure res is an array to prevent crashes (e.g. if API returns HTML or unexpected object)
      setData(Array.isArray(res) ? res : []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const safeData = Array.isArray(data) ? data : [];
  const maxStudents = Math.max(...safeData.map(d => d.students || 0), 1);

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isLoading && safeData.length > 0) {
      gsap.from(".gsap-bar", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "all" // Avoid leaving scale transforms after complete
      });
      
      gsap.from(".gsap-count", {
        textContent: 0,
        duration: 1.5,
        ease: "power3.out",
        snap: { textContent: 1 },
        stagger: 0.1
      });
    }
  }, { scope: containerRef, dependencies: [isLoading, safeData] });

  return (
    <div ref={containerRef} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow min-h-[280px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] flex items-center justify-center text-[#0284c7]">
          <Users size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-[17px]">Career Distribution</h3>
          <p className="text-[13px] text-slate-500 font-medium">Students pursuing each path</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {isLoading || safeData.length === 0 ? (
          Array.from({length: 4}).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-32 h-4 bg-slate-100 animate-pulse rounded"></div>
              <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-slate-100 animate-pulse rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
              </div>
            </div>
          ))
        ) : (
          safeData.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-36 text-[13px] font-bold text-slate-700 truncate" title={item.career}>
                {item.career}
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="gsap-bar h-full bg-linear-to-r from-[#00838f] to-[#00b4d8] rounded-full" 
                    style={{ width: `${(item.students / maxStudents) * 100}%` }}
                  ></div>
                </div>
                <div className="gsap-count w-10 text-right text-[12px] font-bold text-slate-900">
                  {item.students}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

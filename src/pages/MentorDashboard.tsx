import React, { useEffect, useState } from 'react';
import { 
  Bell, Settings, LogOut, LayoutDashboard, MessageSquare, IdCard,
  Star, Gauge, Users, Mail, Calendar, Layers, Lightbulb, ChevronRight
} from 'lucide-react';
import { Logo } from '../components/ui';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import mentorApi from '../api/mentorApi';

// -- WIDGETS --

const WelcomeBanner = ({ user }: { user: any }) => {
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
          {isLoading ? (
            <div className="h-5 w-40 bg-white/20 animate-pulse rounded"></div>
          ) : data ? (
            <p className="text-[16px] font-bold">{data.alertCount} {data.alertText}</p>
          ) : (
            <p className="text-[16px] font-bold">No new alerts</p>
          )}
        </div>
      </button>
    </div>
  );
};

const MetricWidget = ({ title, icon: Icon, apiFunction }: { title: string, icon: any, apiFunction: () => Promise<any> }) => {
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
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-md"></div>
        ) : (
          <h2 className="text-[32px] font-bold text-[#006064] leading-none">
            {data ? data.value : '0'}
          </h2>
        )}
      </div>
      <div className="text-slate-300 group-hover:text-[#bae6fd] group-hover:scale-110 transition-all duration-300">
        <Icon size={40} strokeWidth={1.5} />
      </div>
    </div>
  );
};

const PendingReviewsWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    mentorApi.getPendingReviews().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-bold text-slate-900 text-[17px] mb-4">Pending Reviews</h3>
      
      <div className="flex-1 flex flex-col gap-4">
        {isLoading ? (
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
        ) : data && data.length > 0 ? (
          data.map((item: any) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:border-[#00838f] hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e0f2fe] text-[#0284c7] font-bold rounded-xl flex items-center justify-center text-[15px]">
                  {item.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800 mb-0.5 group-hover:text-[#00838f] transition-colors">{item.name}</h4>
                  <p className="text-[12px] text-slate-500">{item.course} <span className="mx-1">•</span> {item.time}</p>
                </div>
              </div>
              <button className="px-5 py-2 border border-[#006064] text-[#006064] font-bold text-[13px] rounded-lg hover:bg-[#006064] hover:text-white transition-colors">
                Review
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 h-full min-h-[200px]">
            <Layers size={32} className="text-slate-200 mb-3" />
            <p className="text-sm font-medium">No pending reviews</p>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickActionsWidget = () => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="font-bold text-slate-900 text-[17px] mb-4 opacity-0 hidden lg:block">Quick Actions</h3> {/* Hidden title to align grid */}
      
      <div className="flex-1 flex flex-col gap-4">
        {/* Schedule Session Card */}
        <button className="flex-1 bg-[#006064] hover:bg-[#004d40] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-center text-left relative overflow-hidden group shadow-md transition-colors min-h-[160px]">
          <Calendar size={28} className="mb-4 opacity-90 group-hover:scale-110 transition-transform origin-left" />
          <h4 className="text-[18px] font-bold mb-1">Schedule Session</h4>
          <p className="text-[13px] text-teal-100/80">Book your next 1:1 sync with mentees</p>
          <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={140} />
          </div>
        </button>

        {/* Review Portfolios Card */}
        <button className="flex-1 bg-[#00838f] hover:bg-[#006064] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-center text-left relative overflow-hidden group shadow-md transition-colors min-h-[160px]">
          <Layers size={28} className="mb-4 opacity-90 group-hover:scale-110 transition-transform origin-left" />
          <h4 className="text-[18px] font-bold mb-1">Review Portfolios</h4>
          <p className="text-[13px] text-cyan-100/80">Batch review outstanding project files</p>
          <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers size={140} />
          </div>
        </button>
      </div>
    </div>
  );
};

const MentorInsightWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    mentorApi.getInsight().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-6 flex items-start gap-5 animate-pulse mt-6">
        <div className="w-12 h-12 bg-[#bae6fd] rounded-full shrink-0"></div>
        <div className="flex-1">
          <div className="h-4 w-32 bg-[#bae6fd] rounded mb-3"></div>
          <div className="h-4 w-3/4 bg-[#bae6fd] rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-[#bae6fd] rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || !data.insightText) return null;

  return (
    <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 mt-8 shadow-sm">
      <div className="w-12 h-12 bg-[#006064] text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
        <Lightbulb size={24} />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-bold text-[#006064] tracking-widest uppercase mb-2">Mentor Insight</p>
        <p className="text-[15px] text-slate-700 font-medium leading-relaxed mb-4">
          {data.insightText}
        </p>
        <div className="flex items-center gap-6">
          <button className="text-[14px] font-bold text-[#00838f] hover:text-[#006064] transition-colors">Apply to feedback</button>
          <button className="text-[14px] font-semibold text-slate-500 hover:text-slate-700 transition-colors">Dismiss</button>
        </div>
      </div>
    </div>
  );
};

// -- MAIN PAGE --

export default function MentorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      {/* TOP NAVIGATION */}
      <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6 md:gap-12">
          <Logo hideIcon={true} className="scale-90 origin-left" />
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
            <a href="#" className="flex items-center gap-2 text-[#00838f] border-b-[3px] border-[#00838f] py-4 -mb-3.5 transition-colors">
              <LayoutDashboard size={16} />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <MessageSquare size={16} />
              Feedback
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <IdCard size={16} />
              E-Portfolio
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 relative">
          <button className="text-slate-400 hover:text-slate-600 transition-colors hidden sm:block relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          
          {/* User Profile Area */}
          <div className="flex items-center gap-3 pl-0 sm:pl-6 sm:border-l border-slate-200 cursor-pointer group" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-bold text-slate-900 group-hover:text-[#00838f] transition-colors">{user?.fullName || user?.name || 'Dr. Sarah'}</p>
              <p className="text-[11px] font-medium text-slate-500">Mentor</p>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 group-hover:border-[#00838f] group-hover:shadow-sm transition-all relative">
              <div className="w-full h-full bg-[#006064] flex items-center justify-center text-white text-[14px] font-bold">
                {(user?.fullName?.trim().split(' ').pop() || user?.name || 'S')[0].toUpperCase()}
              </div>
            </div>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(false); }}></div>
                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button className="w-full text-left px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 font-medium">
                    <Settings size={16} className="text-slate-400" />
                    Settings
                  </button>
                  <div className="h-[1px] bg-slate-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-[14px] text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-3 font-bold"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        
        {/* WELCOME BANNER */}
        <WelcomeBanner user={user} />

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <MetricWidget 
            title="AVG. RATING" 
            icon={Star} 
            apiFunction={mentorApi.getRatingMetric} 
          />
          <MetricWidget 
            title="RESP. TIME" 
            icon={Gauge} 
            apiFunction={mentorApi.getResponseTimeMetric} 
          />
          <MetricWidget 
            title="MENTEES" 
            icon={Users} 
            apiFunction={mentorApi.getMenteesMetric} 
          />
        </div>

        {/* MIDDLE SECTION (PENDING REVIEWS & QUICK ACTIONS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PendingReviewsWidget />
          </div>
          <div className="lg:col-span-1">
            <QuickActionsWidget />
          </div>
        </div>

        {/* BOTTOM INSIGHT */}
        <MentorInsightWidget />

      </main>
    </div>
  );
}

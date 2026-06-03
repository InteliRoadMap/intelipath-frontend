import React, { useEffect, useState } from 'react';
import { 
  Search, Settings, Bell, LogOut, Users, TrendingUp, AlertTriangle, Zap,
  ChevronDown, MessageSquare, CheckCircle, ExternalLink, Calendar, Activity, LayoutDashboard
} from 'lucide-react';
import { Logo } from '@/components';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import counselorApi from '../api/counselorApi';

// -- WIDGETS --

const MetricWidget = ({ title, icon: Icon, color, apiFunction }: { title: string, icon: any, color: 'blue' | 'red', apiFunction: () => Promise<any> }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    apiFunction().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [apiFunction]);

  const colorStyles = color === 'blue' 
    ? 'bg-[#e0f2fe] text-[#0284c7]' 
    : 'bg-[#fee2e2] text-[#ef4444]';
    
  const badgeStyles = color === 'blue'
    ? 'bg-[#bae6fd] text-[#0369a1]'
    : 'bg-[#fecaca] text-[#b91c1c]';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-8">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${colorStyles}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {isLoading ? (
          <div className="h-6 w-12 bg-slate-100 animate-pulse rounded-md"></div>
        ) : (
          <span className={`text-[11px] font-bold px-2 py-1.5 rounded-md uppercase tracking-wider ${data ? badgeStyles : 'bg-slate-100 text-slate-400'}`}>
            {data ? data.growth : '-'}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">{title}</p>
        {isLoading ? (
          <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-md"></div>
        ) : (
          <h2 className="text-[32px] font-bold text-[#006064] leading-none">
            {data ? (data.total || data.rate || data.score) : '0'}
          </h2>
        )}
      </div>
    </div>
  );
};

const LearningActivityWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    counselorApi.getLearningActivity().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[380px] hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-[17px]">Student Learning Activity</h3>
          <p className="text-[12px] text-slate-500">Activity trends over the selected period</p>
        </div>
        <div className="bg-[#f8fafc] p-1 rounded-lg flex text-[13px] font-semibold border border-slate-100 w-fit">
          <button className="text-slate-500 px-4 py-1.5 hover:text-slate-700 transition-colors">Daily</button>
          <button className="bg-[#006064] text-white px-4 py-1.5 rounded-md shadow-sm">Weekly</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex-1 bg-slate-100 animate-pulse rounded-t-md" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <>
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pb-8">
              {[1,2,3,4].map(i => <div key={i} className="w-full border-t border-slate-100"></div>)}
            </div>
            
            {/* Bars */}
            <div className="flex items-end justify-between gap-1 sm:gap-4 h-[220px] z-10 relative">
              {data.map((item: any, i: number) => {
                const isMax = item.value === Math.max(...data.map((d: any) => d.value));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className="w-full flex items-end justify-center h-full pb-2">
                      <div 
                        className={`w-full max-w-[60px] rounded-t-sm transition-all duration-1000 ease-out group-hover:opacity-80
                          ${isMax ? 'bg-[#006064]' : 'bg-[#bae6fd]'}`} 
                        style={{ height: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-600 mt-2">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <Activity size={32} className="text-slate-200 mb-3" />
            <p className="text-sm font-medium">No activity data</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SkillDistributionWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    counselorApi.getSkillDistribution().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <h3 className="font-bold text-slate-900 text-[17px] mb-6">Skill Distribution</h3>

      <div className="flex-1 space-y-6">
        {isLoading ? (
          Array.from({length: 4}).map((_, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <div className="h-4 w-24 bg-slate-100 animate-pulse rounded"></div>
                <div className="h-4 w-8 bg-slate-100 animate-pulse rounded"></div>
              </div>
              <div className="h-2.5 w-full bg-slate-100 animate-pulse rounded-full"></div>
            </div>
          ))
        ) : data && data.length > 0 ? (
          data.map((skill: any) => (
            <div key={skill.id}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[13px] font-bold text-slate-800">{skill.name}</span>
                <span className="text-[12px] font-bold text-[#00838f]">{skill.percentage}%</span>
              </div>
              <div className="h-2.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden flex">
                <div 
                  className={`h-full rounded-r-full transition-all duration-1000 ease-out
                    ${skill.percentage > 80 ? 'bg-[#006064]' : skill.percentage > 70 ? 'bg-[#0284c7]' : 'bg-[#7dd3fc]'}`} 
                  style={{ width: `${skill.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <p className="text-sm font-medium">No skills data</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-4 border-t border-slate-100 text-center">
        <button className="text-[13px] font-bold text-[#006064] hover:text-[#00838f] transition-colors">
          View Full Skill Matrix
        </button>
      </div>
    </div>
  );
};

const RecentActivityWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    counselorApi.getRecentActivity().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'completion': return <div className="w-10 h-10 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center"><CheckCircle size={20} /></div>;
      case 'alert': return <div className="w-10 h-10 rounded-full bg-[#fef2f2] text-[#ef4444] flex items-center justify-center"><AlertTriangle size={20} /></div>;
      case 'counselor': return <div className="w-10 h-10 rounded-full bg-[#ecfeff] text-[#06b6d4] flex items-center justify-center"><MessageSquare size={20} /></div>;
      default: return <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"><Bell size={20} /></div>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 text-[17px]">Recent Activity</h3>
        <button className="text-[13px] font-bold text-[#00838f] hover:text-[#006064]">See all</button>
      </div>

      <div className="flex-1 space-y-6">
        {isLoading ? (
          Array.from({length: 3}).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-slate-100 animate-pulse rounded-full shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded"></div>
              </div>
            </div>
          ))
        ) : data && data.length > 0 ? (
          data.map((item: any) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="shrink-0 transition-transform group-hover:scale-105">{getIcon(item.type)}</div>
              <div className="flex-1 pt-1">
                <p className="text-[14px] text-slate-800 leading-snug mb-1">
                  <span className="font-bold">{item.title.split(' ')[0]} {item.title.split(' ')[1]}</span> 
                  {' '}{item.title.split(' ').slice(2).join(' ')}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  {item.time} <span className="w-1 h-1 bg-slate-300 rounded-full"></span> {item.category}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
            <Bell size={24} className="text-slate-200 mb-2" />
            <p className="text-sm font-medium">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TopStudentsWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    counselorApi.getTopStudents().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <h3 className="font-bold text-slate-900 text-[17px] mb-6">Top Performing Students</h3>

      <div className="flex-1">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 pb-3 border-b border-slate-100">
          <div className="col-span-2 sm:col-span-1 text-[11px] font-bold text-slate-500 uppercase">Rank</div>
          <div className="col-span-5 sm:col-span-6 text-[11px] font-bold text-slate-500 uppercase">Student</div>
          <div className="col-span-3 sm:col-span-3 text-[11px] font-bold text-slate-500 uppercase text-right pr-4 sm:pr-8">Progress</div>
          <div className="col-span-2 sm:col-span-2 text-[11px] font-bold text-slate-500 uppercase text-right">Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-50">
          {isLoading ? (
            Array.from({length: 3}).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 py-4 items-center">
                <div className="col-span-2 sm:col-span-1"><div className="w-6 h-6 bg-slate-100 animate-pulse rounded-full"></div></div>
                <div className="col-span-5 sm:col-span-6 flex gap-3 items-center">
                  <div className="w-8 h-8 bg-slate-100 animate-pulse rounded-full hidden sm:block"></div>
                  <div className="h-4 w-24 bg-slate-100 animate-pulse rounded"></div>
                </div>
                <div className="col-span-3 sm:col-span-3"><div className="h-2 w-full bg-slate-100 animate-pulse rounded-full"></div></div>
                <div className="col-span-2 sm:col-span-2 flex justify-end"><div className="w-5 h-5 bg-slate-100 animate-pulse rounded"></div></div>
              </div>
            ))
          ) : data && data.length > 0 ? (
            data.map((student: any) => (
              <div key={student.id} className="grid grid-cols-12 gap-2 py-3.5 items-center group hover:bg-slate-50 transition-colors -mx-2 px-2 rounded-lg">
                <div className="col-span-2 sm:col-span-1">
                  <div className="w-6 h-6 rounded-full bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center text-[11px] font-bold">
                    {student.rank}
                  </div>
                </div>
                <div className="col-span-5 sm:col-span-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f1f5f9] text-slate-600 font-bold text-[11px] flex items-center justify-center hidden sm:flex">
                    {student.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                  <span className="text-[14px] font-bold text-slate-800">{student.name}</span>
                </div>
                <div className="col-span-3 sm:col-span-3 flex flex-col sm:flex-row items-end sm:items-center justify-end sm:justify-start gap-2 pr-2 sm:pr-0">
                  <div className="h-1.5 w-12 sm:w-full max-w-[80px] bg-[#f1f5f9] rounded-full overflow-hidden hidden sm:flex">
                    <div className="h-full bg-[#006064] rounded-r-full" style={{ width: `${student.progress}%` }}></div>
                  </div>
                  <span className="text-[12px] font-bold text-slate-900">{student.progress}%</span>
                </div>
                <div className="col-span-2 sm:col-span-2 flex justify-end">
                  <button className="text-[#00838f] hover:text-[#006064] p-1 rounded-md hover:bg-[#e0f2fe] transition-colors">
                    <ExternalLink size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))
          ) : (
             <div className="flex flex-col items-center justify-center text-slate-400 py-8">
              <p className="text-sm font-medium">No student data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -- MAIN PAGE --

export default function CounselorDashboard() {
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
              <Users size={16} />
              Students
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <Settings size={16} />
              Settings
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[9px] font-bold">?</span>
              Help Center
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
              <p className="text-[13px] font-bold text-slate-900 group-hover:text-[#00838f] transition-colors">{user?.fullName || user?.name || 'Dr. Sarah Jenkins'}</p>
              <p className="text-[11px] font-medium text-slate-500">Senior Counselor</p>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 group-hover:border-[#00838f] group-hover:shadow-sm transition-all relative">
              {/* Fallback avatar matching design, or initials */}
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
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[24px] font-bold text-slate-900 mb-1">
              Counselor Dashboard
            </h1>
            <p className="text-[13px] text-slate-500">Overview of student performance and engagement metrics.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-fit">
            <Calendar size={16} className="text-slate-400" />
            Last 30 Days
            <ChevronDown size={16} className="text-slate-400 ml-1" />
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricWidget 
            title="TOTAL ACTIVE STUDENTS" 
            icon={Users} 
            color="blue" 
            apiFunction={counselorApi.getStudentsMetric} 
          />
          <MetricWidget 
            title="AVG. PROGRESS RATE" 
            icon={TrendingUp} 
            color="blue" 
            apiFunction={counselorApi.getProgressMetric} 
          />
          <MetricWidget 
            title="AT-RISK STUDENTS" 
            icon={AlertTriangle} 
            color="red" 
            apiFunction={counselorApi.getAtRiskMetric} 
          />
          <MetricWidget 
            title="ENGAGEMENT SCORE" 
            icon={Zap} 
            color="blue" 
            apiFunction={counselorApi.getEngagementMetric} 
          />
        </div>

        {/* MIDDLE ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <LearningActivityWidget />
          </div>
          <div className="lg:col-span-1">
            <SkillDistributionWidget />
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityWidget />
          <TopStudentsWidget />
        </div>

      </main>
    </div>
  );
}

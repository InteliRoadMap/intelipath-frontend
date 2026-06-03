import React, { useEffect, useState } from 'react';
import { Search, Settings, ChevronRight, Send, Download, Check, MapPin, Lock, Info, ExternalLink, Network, Box, AlertTriangle, LogOut, LayoutDashboard, Map, Bot, TrendingUp } from 'lucide-react';
import { Logo } from '@/components';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '@/api';

// --- Individual Widgets ---

const WelcomeHeader = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    dashboardApi.getRoadmapProgress().then(setData);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 mb-1">
          Good morning, {user?.fullName?.trim().split(' ').pop() || user?.name || 'User'}
        </h1>
      </div>
    </div>
  );
};

const RoadmapProgressWidget = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { dashboardApi.getRoadmapProgress().then(setData); }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[260px]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-slate-900 text-[17px]">Detailed Roadmap Progress</h3>
        <div className="bg-[#f8fafc] p-1 rounded-lg flex text-[13px] font-semibold border border-slate-100">
          <button className="bg-[#4fc3f7] text-white px-4 py-1.5 rounded-md shadow-sm">Foundations</button>
          <button className="text-slate-500 px-4 py-1.5 hover:text-slate-700">Advanced</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center pb-2">
        {/* Timeline */}
        {data && data.steps && (
          <div className="relative flex justify-between items-start mb-8 px-4">
            <div className="absolute top-[14px] left-8 right-8 h-[2px] bg-slate-200 z-0"></div>
            <div className="absolute top-[14px] left-8 h-[2px] bg-[#006064] z-0 transition-all" style={{ width: '60%' }}></div>
            
            {data.steps.map((step: any, index: number) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white
                  ${step.status === 'completed' ? 'border-[#006064] bg-[#006064] text-white' : 
                    step.status === 'current' ? 'border-[#006064] text-[#006064]' : 
                    'border-slate-200 text-slate-300'}`}>
                  {step.status === 'completed' && <Check size={14} strokeWidth={3} />}
                  {step.status === 'current' && <MapPin size={14} fill="currentColor" className="text-white bg-[#006064] rounded-full p-0.5" />}
                  {step.status === 'locked' && <Lock size={12} />}
                </div>
                <span className={`text-[12px] font-bold ${step.status === 'locked' ? 'text-slate-300' : step.status === 'current' ? 'text-[#006064]' : 'text-slate-700'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* AI Tip */}
        {data && data.aiTip && (
          <div className="bg-[#f0f9ff] border border-[#e0f2fe] rounded-xl p-4 flex gap-3 items-start">
            <div className="mt-0.5 text-[#00838f]"><Info size={20} /></div>
            <p className="text-[13px] text-slate-700 leading-relaxed">
              <span className="font-bold text-[#00838f]">AI Tip:</span> {data.aiTip.split('**')[0]}<span className="font-bold text-slate-900">{data.aiTip.split('**')[1]}</span>{data.aiTip.split('**')[2]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SkillGapsWidget = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { dashboardApi.getSkillGaps().then(setData); }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[300px]">
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle size={20} className="text-rose-500" strokeWidth={2.5} />
        <h3 className="font-bold text-slate-900 text-[17px]">Skill Gaps</h3>
      </div>
      
      <div className="flex-1 space-y-3.5">
        {data && data.length > 0 ? data.map((gap: any) => (
          <div key={gap.id} className={`rounded-xl p-4 border ${gap.type === 'critical' ? 'bg-[#fff5f5] border-[#ffe4e4]' : 'bg-[#f0f9ff] border-[#e0f2fe]'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[9px] font-bold tracking-wider uppercase ${gap.type === 'critical' ? 'text-rose-600' : 'text-[#0284c7]'}`}>
                {gap.type === 'critical' ? 'CRITICAL GAP' : 'MARKET REQUIREMENT'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${gap.type === 'critical' ? 'bg-[#fee2e2] text-rose-600' : 'bg-[#bae6fd] text-[#0369a1]'}`}>
                {gap.severity}
              </span>
            </div>
            <h4 className="text-[15px] font-bold text-slate-900 mb-1">{gap.title}</h4>
            <p className="text-[12px] text-slate-600 leading-snug">{gap.description}</p>
          </div>
        )) : (
          <div className="h-full"></div>
        )}
      </div>

      <button className="mt-5 w-full py-2.5 border border-slate-200 text-[#006064] text-[14px] font-bold rounded-xl hover:bg-slate-50 transition-colors">
        Download Detailed Report
      </button>
    </div>
  );
};

const MentorFeedbackWidget = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { dashboardApi.getMentorFeedback().then(setData); }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[300px]">
      <div className="flex items-center gap-2 mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#00838f]">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <h3 className="font-bold text-slate-900 text-[17px]">Recent Mentor Feedback</h3>
      </div>

      <div className="flex-1 space-y-4">
        {data && data.length > 0 ? data.map((feedback: any) => (
          <div key={feedback.id} className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#00838f] rounded-full opacity-90"></div>
            <div className="bg-[#f8fafc] rounded-xl rounded-l-none border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[14px] font-bold text-[#006064]">{feedback.name}</h4>
                <span className="text-[10px] text-slate-400 font-semibold">{feedback.time}</span>
              </div>
              <p className="text-[13px] text-slate-600 italic leading-relaxed">"{feedback.text}"</p>
            </div>
          </div>
        )) : (
          <div className="h-full"></div>
        )}
      </div>
    </div>
  );
};

const SkillComparisonWidget = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { dashboardApi.getSkillComparison().then(setData); }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-slate-900 text-[17px]">Skill Comparison</h3>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-wide">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#006064]"></span> Current</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#e0f2fe]"></span> Target</span>
        </div>
      </div>

      <div className="flex-1 space-y-5">
        {data && data.length > 0 ? data.map((skill: any) => (
          <div key={skill.id}>
            <div className="flex justify-between items-end mb-2">
              <span className="text-[12px] font-bold text-slate-800">{skill.name}</span>
              <span className="text-[11px] font-semibold text-slate-400">{skill.current}% / {skill.target}%</span>
            </div>
            <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden flex relative">
              {/* Target background */}
              <div className="absolute left-0 top-0 bottom-0 bg-[#e0f2fe] z-0" style={{ width: `${skill.target}%` }}></div>
              {/* Current bar */}
              <div className="absolute left-0 top-0 bottom-0 bg-[#006064] z-10 rounded-r-full" style={{ width: `${skill.current}%` }}></div>
            </div>
          </div>
        )) : (
          <div className="h-full"></div>
        )}
      </div>
    </div>
  );
};

const AiMentorHistoryWidget = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { dashboardApi.getAiHistory().then(setData); }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-900 text-[17px]">AI Mentor - History</h3>
        <button className="text-slate-400 hover:text-slate-600"><ExternalLink size={18} /></button>
      </div>

      <div className="flex-1 space-y-3">
        {data && data.length > 0 ? data.map((item: any, index: number) => (
          <div key={item.id} className={`p-4 rounded-xl border ${index === 1 ? 'border-[#00838f] bg-white border-l-[3px]' : 'border-slate-100 bg-[#f8fafc]'}`}>
            <span className="text-[10px] font-bold text-slate-500 mb-1 block uppercase">{item.tag}</span>
            <h4 className="text-[14px] font-bold text-slate-900 mb-1 truncate">{item.title}</h4>
            <p className="text-[12px] text-slate-500 truncate">{item.preview}</p>
          </div>
        )) : (
          <div className="h-full"></div>
        )}
      </div>

      <div className="mt-5 relative">
        <input 
          type="text" 
          placeholder="Ask your AI Mentor..." 
          className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-[13px] outline-none focus:border-[#00838f] transition-colors"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00838f] hover:text-[#006064]">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

const BridgeGapsWidget = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { dashboardApi.getRecommendations().then(setData); }, []);

  return (
    <div className="w-full mt-8">
      <h3 className="font-bold text-slate-900 text-[17px] mb-4">Bridge Your Gaps - Priority Learning</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[200px]">
        {data && data.length > 0 ? data.map((item: any) => (
          <div key={item.id} className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-[#e0f2fe] text-[#0284c7] rounded-xl flex items-center justify-center">
                {item.icon === 'Network' ? <Network size={20} strokeWidth={2.5} /> : <Box size={20} strokeWidth={2.5} />}
              </div>
              <span className="bg-[#e0f2fe] text-[#0369a1] text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {item.type}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-[16px] mb-2">{item.title}</h4>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-6 flex-1">{item.description}</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#006064] text-white text-[13px] font-bold py-2.5 rounded-xl hover:bg-[#00838f] transition-colors">
                Start Now
              </button>
              <button className="flex-1 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                Details
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 h-full min-h-[200px]"></div>
        )}
      </div>
    </div>
  );
};

const MarketDemandWidget = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => { dashboardApi.getMarketDemand().then(setData); }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-900 text-[17px]">Market Demand Trend</h3>
      </div>
      
      {data ? (
        <>
          <div className="flex items-center gap-3 mb-6 mt-2">
            <span className="text-[32px] font-bold text-slate-900 leading-none">{data.growth}%</span>
            <div className="flex flex-col justify-center">
              <span className="text-[#00838f] text-[10px] font-bold">YoY Growth</span>
              <span className="text-slate-500 text-[11px] leading-tight">{data.role}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex items-end justify-between h-28 gap-1.5 mb-4">
              {data.chart.map((height: number, i: number) => (
                <div key={i} className={`w-full rounded-t-sm ${i === data.chart.length - 1 ? 'bg-[#006064]' : 'bg-[#a3c9c9]'}`} style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <p className="text-center text-[8px] font-bold tracking-widest uppercase text-slate-800">Projected Demand For K8s Masters</p>
          </div>
        </>
      ) : (
        <div className="flex-1"></div>
      )}
    </div>
  );
};

// --- Main Page Component ---

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20 relative">
      
      {/* TOP NAVIGATION */}
      <nav className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-12">
          <Logo hideIcon={true} className="scale-90 origin-left" />
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
            <a href="#" className="flex items-center gap-2 text-[#00838f] border-b-[3px] border-[#00838f] py-4 -mb-3.5 transition-colors">
              <LayoutDashboard size={16} />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <Map size={16} />
              My Roadmap
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <Bot size={16} />
              AI Mentor
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <TrendingUp size={16} />
              Market Pulse
            </a>
          </div>
        </div>

        <div className="flex items-center gap-6 relative">
          <button className="text-slate-400 hover:text-slate-600 transition-colors"><Search size={20} /></button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors"><Settings size={20} /></button>
          {/* User Profile Area */}
          <div className="flex items-center gap-3 pl-0 sm:pl-6 sm:border-l border-slate-200 cursor-pointer group relative" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-bold text-slate-900 group-hover:text-[#00838f] transition-colors">{user?.fullName || user?.name || 'Student'}</p>
              <p className="text-[11px] font-medium text-slate-500 capitalize">{user?.role || 'Student'}</p>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 group-hover:border-[#00838f] group-hover:shadow-sm transition-all">
              <div className="w-full h-full bg-[#00838f] flex items-center justify-center text-white text-[14px] font-bold">
                {(user?.fullName?.trim().split(' ').pop() || user?.name || 'S')[0].toUpperCase()}
              </div>
            </div>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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

      {/* MAIN LAYOUT */}
      <main className="max-w-[1300px] mx-auto px-8 pt-8">
        
        <WelcomeHeader />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left/Middle Column (span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <RoadmapProgressWidget />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <MentorFeedbackWidget />
              </div>
              <div>
                <SkillComparisonWidget />
              </div>
            </div>
            <div>
              <BridgeGapsWidget />
            </div>
          </div>

          {/* Right Column (span 1) */}
          <div className="flex flex-col gap-6">
            <div>
              <SkillGapsWidget />
            </div>
            <div>
              <AiMentorHistoryWidget />
            </div>
            <div>
              <MarketDemandWidget />
            </div>
          </div>

        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-[#006064] hover:bg-[#00838f] text-white px-5 py-3 rounded-full font-bold shadow-lg shadow-[#006064]/30 flex items-center gap-2.5 transition-all hover:-translate-y-1 z-50 text-[14px]">
        <div className="bg-white/20 p-1 rounded-full"><Box size={14} fill="currentColor" /></div>
        Ask AI Mentor
      </button>

    </div>
  );
}

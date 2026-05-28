import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Search,
  Compass,
  Trophy,
  ChevronRight,
  GitFork,
  Bot,
  TrendingUp,
  IdCard,
  LogOut
} from 'lucide-react';
import Logo from '../components/Logo';

export default function StudentDashboard({ user, onLogout }: any) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="py-6 px-8 border-b border-slate-100 flex items-center">
          <Logo hideIcon={true} className="scale-90 origin-left" />
        </div>
        
        <nav className="flex-1 py-4 space-y-1">
          <a href="#" className="flex items-center gap-3 pl-8 pr-4 py-3 bg-[#a5e1fa] text-[#0d5060] rounded-r-2xl mr-4 font-bold transition-all">
            <LayoutDashboard size={20} className="text-[#0d5060]" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 pl-8 pr-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-r-2xl mr-4 font-medium transition-all">
            <GitFork size={20} />
            My Roadmap
          </a>
          <a href="#" className="flex items-center gap-3 pl-8 pr-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-r-2xl mr-4 font-medium transition-all">
            <Bot size={20} />
            AI Mentor
          </a>
          <a href="#" className="flex items-center gap-3 pl-8 pr-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-r-2xl mr-4 font-medium transition-all">
            <TrendingUp size={20} />
            Market Pulse
          </a>
          <a href="#" className="flex items-center gap-3 pl-8 pr-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-r-2xl mr-4 font-medium transition-all">
            <IdCard size={20} />
            E-Portfolio
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
            <Settings size={20} />
            Settings
          </a>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-slate-900 transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 group cursor-pointer" onClick={onLogout} title="Click to Logout">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-rose-500 transition-colors">{user?.name || user?.fullName || 'Student'}</p>
                <p className="text-xs font-medium text-slate-500 capitalize">{user?.role || 'Student'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                {(user?.name || user?.fullName || 'S')[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-20">
          
          {/* Welcome Banner */}
          <section className="relative bg-gradient-to-br from-slate-900 to-brand-blue rounded-3xl p-8 sm:p-10 text-white overflow-hidden shadow-xl shadow-brand-blue/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Welcome aboard, {user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed font-light">
                You haven't enrolled in any learning paths yet. Discover your personalized roadmap and start acquiring new skills today.
              </p>
              <button className="bg-brand-cyan hover:bg-white hover:text-brand-blue text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-brand-cyan/30 flex items-center gap-2 group">
                Explore Learning Paths
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Empty States Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Active Path Empty */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[320px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <Compass size={36} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Active Path</h3>
              <p className="text-slate-500 text-sm max-w-[280px] mb-6">
                Your current learning journey is empty. Pick a path to start tracking your progress and skills.
              </p>
              <button className="text-brand-blue font-semibold text-sm hover:underline hover:text-brand-electric transition-colors">
                Browse Catalog
              </button>
            </div>

            {/* Assignments Empty */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[320px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <Trophy size={36} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Upcoming Tasks</h3>
              <p className="text-slate-500 text-sm max-w-[280px] mb-6">
                You're all caught up! When you enroll in a path, your lessons and assignments will appear here.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

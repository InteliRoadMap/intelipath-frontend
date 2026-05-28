import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Search,
  Users,
  CalendarDays,
  LogOut,
  ChevronRight,
  UserPlus,
  MessageSquare,
  IdCard
} from 'lucide-react';
import Logo from '../components/Logo';

export default function MentorDashboard({ user, onLogout }: any) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="py-6 px-8 border-b border-slate-100 flex items-center">
          <Logo hideIcon={true} className="scale-90 origin-left" />
        </div>
        
        <nav className="flex-1 py-4 space-y-1">
          <a href="#" className="flex items-center gap-3 pl-8 pr-4 py-3 bg-[#bbf7d0] text-[#14532d] rounded-r-2xl mr-4 font-bold transition-all">
            <LayoutDashboard size={20} className="text-[#14532d]" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 pl-8 pr-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-r-2xl mr-4 font-medium transition-all">
            <MessageSquare size={20} />
            Feedback
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
                <p className="text-sm font-bold text-slate-900 group-hover:text-rose-500 transition-colors">{user?.name || user?.fullName || 'Mentor'}</p>
                <p className="text-xs font-medium text-slate-500 capitalize">{user?.role || 'Mentor'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                {(user?.name || user?.fullName || 'M')[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-20">
          
          {/* Welcome Banner */}
          <section className="relative bg-gradient-to-br from-slate-900 to-teal-900 rounded-3xl p-8 sm:p-10 text-white overflow-hidden shadow-xl shadow-teal-900/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Welcome back, Mentor {user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || ''}! 👋
              </h1>
              <p className="text-emerald-100 text-lg mb-8 leading-relaxed font-light">
                You don't have any assigned mentees yet. Complete your profile and set your availability to start guiding students on their journey.
              </p>
              <button className="bg-emerald-500 hover:bg-white hover:text-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-500/30 flex items-center gap-2 group">
                Set Availability
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Empty States Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Active Mentees Empty */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[320px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <Users size={36} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Active Mentees</h3>
              <p className="text-slate-500 text-sm max-w-[280px] mb-6">
                You haven't been assigned any students yet. Once a student requests your mentorship, they will appear here.
              </p>
              <button className="text-teal-600 font-semibold text-sm hover:underline hover:text-teal-800 transition-colors flex items-center gap-1 mx-auto">
                <UserPlus size={16} />
                Browse Student Requests
              </button>
            </div>

            {/* Upcoming Sessions Empty */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[320px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <CalendarDays size={36} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Upcoming Sessions</h3>
              <p className="text-slate-500 text-sm max-w-[280px] mb-6">
                Your calendar is clear! Make sure your weekly schedule is updated so students can book sessions.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

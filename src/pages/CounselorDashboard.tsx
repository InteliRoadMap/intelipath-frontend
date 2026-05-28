import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Search,
  Users,
  LogOut,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import Logo from '../components/Logo';

import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CounselorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="py-6 px-8 border-b border-slate-100 flex items-center">
          <Logo hideIcon={true} className="scale-90 origin-left" />
        </div>
        
        <nav className="flex-1 py-4 space-y-2 mt-2">
          <a href="#" className="flex items-center gap-3 px-5 py-3 mx-4 bg-[#bbf7d0] text-[#14532d] rounded-xl font-bold transition-all">
            <LayoutDashboard size={20} className="text-[#14532d]" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-5 py-3 mx-4 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all">
            <Users size={20} />
            Students
          </a>
          <a href="#" className="flex items-center gap-3 px-5 py-3 mx-4 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all">
            <Settings size={20} />
            Settings
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-medium transition-colors"
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
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 group cursor-pointer" onClick={handleLogout} title="Click to Logout">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-rose-500 transition-colors">{user?.name || user?.fullName || 'Counselor'}</p>
                <p className="text-xs font-medium text-slate-500 capitalize">{user?.role || 'Counselor'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                {(user?.name || user?.fullName || 'C')[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-20">
          
          {/* Welcome Banner */}
          <section className="relative bg-gradient-to-br from-slate-900 to-amber-900 rounded-3xl p-8 sm:p-10 text-white overflow-hidden shadow-xl shadow-amber-900/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Welcome back, Counselor {user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || ''}! 👋
              </h1>
              <p className="text-amber-100 text-lg mb-8 leading-relaxed font-light">
                You have no pending student consultations today. Stay ready to help students navigate their career paths.
              </p>
              <button className="bg-amber-500 hover:bg-white hover:text-amber-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-amber-500/30 flex items-center gap-2 group">
                Review Student Profiles
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Empty States Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Students Empty */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[320px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <Users size={36} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Students Assigned</h3>
              <p className="text-slate-500 text-sm max-w-[280px] mb-6">
                There are no students currently needing your guidance. Incoming consultation requests will appear here.
              </p>
            </div>

            {/* Reports Empty */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[320px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <ClipboardList size={36} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Reports Pending</h3>
              <p className="text-slate-500 text-sm max-w-[280px] mb-6">
                All student career assessment reports have been reviewed. You're completely up to date!
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

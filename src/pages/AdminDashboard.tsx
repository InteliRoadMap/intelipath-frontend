import React, { useEffect, useState } from 'react';
import { Search, Settings, ChevronRight, Bell, LogOut, Users, GraduationCap, Activity, Plus, ChevronLeft, MoreVertical, Edit2, Trash2, LayoutDashboard } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminApi from '../api/adminApi';

// Component: Total Users Metric
const TotalUsersWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    adminApi.getTotalUsers().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 bg-[#f0f9ff] text-[#0284c7] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <Users size={24} strokeWidth={2.5} />
        </div>
        {isLoading ? (
          <div className="h-6 w-12 bg-slate-100 animate-pulse rounded-md"></div>
        ) : (
          <span className={`text-[11px] font-bold px-2 py-1.5 rounded-md uppercase tracking-wider ${data ? 'bg-[#e0f2fe] text-[#0369a1]' : 'bg-slate-100 text-slate-400'}`}>
            {data ? `+${data.growth}%` : '-'}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase mb-1">TOTAL USERS</p>
        {isLoading ? (
          <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-md mb-3"></div>
        ) : (
          <h2 className="text-[32px] font-bold text-slate-900 leading-none mb-3">
            {data ? data.total.toLocaleString() : '0'}
          </h2>
        )}
        <p className="text-[12px] text-slate-500">Active learners across all paths</p>
      </div>
    </div>
  );
};

// Component: Courses Metric
const CoursesWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    adminApi.getTotalCourses().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 bg-[#f0fdf4] text-[#16a34a] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <GraduationCap size={24} strokeWidth={2.5} />
        </div>
        {isLoading ? (
          <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-md"></div>
        ) : (
          <span className={`text-[11px] font-bold px-2 py-1.5 rounded-md uppercase tracking-wider ${data ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-slate-100 text-slate-400'}`}>
            {data ? data.status : '-'}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase mb-1">COURSES</p>
        {isLoading ? (
          <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-md mb-4"></div>
        ) : (
          <h2 className="text-[32px] font-bold text-slate-900 leading-none mb-4">
            {data ? data.total : '0'}
          </h2>
        )}
        <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden flex relative">
          {isLoading ? (
            <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
          ) : (
            <div className="bg-[#006064] h-full rounded-r-full transition-all duration-1000 ease-out" style={{ width: data ? `${data.progress}%` : '0%' }}></div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component: System Health Metric
const SystemHealthWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    adminApi.getSystemHealth().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 bg-[#f8fafc] text-slate-600 border border-slate-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
          <Activity size={24} strokeWidth={2.5} />
        </div>
        {isLoading ? (
          <div className="h-6 w-20 bg-slate-100 animate-pulse rounded-md"></div>
        ) : (
          <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${data ? 'text-[#059669]' : 'text-slate-400'}`}>
            <span className={`w-2 h-2 rounded-full ${data ? 'bg-[#059669] animate-pulse' : 'bg-slate-300'}`}></span>
            {data ? data.status : '-'}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase mb-1">SYSTEM HEALTH</p>
        {isLoading ? (
          <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-md mb-3"></div>
        ) : (
          <h2 className="text-[32px] font-bold text-slate-900 leading-none mb-3">
            {data ? `${data.uptime}%` : '0%'}
          </h2>
        )}
        <p className="text-[12px] text-slate-500">Uptime maintained for 30 days</p>
      </div>
    </div>
  );
};

// Component: User Management Table
const UserManagementWidget = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    adminApi.getUsersList().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-[#f8fafc] border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-bold text-slate-900 text-[17px]">User Management</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full sm:w-64 bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-[13px] outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Table Headers */}
          <div className="grid grid-cols-4 px-6 py-3 border-b border-slate-200 bg-white">
            <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">NAME</div>
            <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">ROLE</div>
            <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">JOINED DATE</div>
            <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase text-right">ACTIONS</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100 bg-white min-h-[280px]">
            {isLoading ? (
              // Loading State
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="grid grid-cols-4 px-6 py-4 items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse"></div>
                    <div className="h-4 w-32 bg-slate-100 animate-pulse rounded"></div>
                  </div>
                  <div><div className="h-5 w-16 bg-slate-100 animate-pulse rounded-md"></div></div>
                  <div><div className="h-4 w-20 bg-slate-100 animate-pulse rounded"></div></div>
                  <div className="flex justify-end"><div className="h-4 w-8 bg-slate-100 animate-pulse rounded"></div></div>
                </div>
              ))
            ) : data && data.length > 0 ? (
              // Data State
              data.map((user: any) => (
                <div key={user.id} className="grid grid-cols-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#00838f] flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                      {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[14px] font-bold text-slate-900 group-hover:text-[#00838f] transition-colors">{user.name}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      user.role === 'Instructor' ? 'bg-[#e0f2fe] text-[#0369a1]' : 
                      user.role === 'Admin' ? 'bg-[#fce7f3] text-[#be185d]' : 
                      'bg-[#f1f5f9] text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[14px] text-slate-500">{user.joinedDate}</div>
                  <div className="text-right flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-[#00838f] hover:bg-[#e0f2fe] rounded-md transition-colors" title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Empty State
              <div className="h-[280px] flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Search size={24} className="text-slate-300" />
                </div>
                <p className="text-[14px] font-medium text-slate-500">No users found</p>
                <p className="text-[13px]">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#f8fafc] border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[12px] text-slate-500 font-medium">
          Showing {data?.length ? `1 to ${data.length}` : '0'} users
        </span>
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50" disabled>
            <ChevronLeft size={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-[#006064] rounded-md bg-[#006064] text-white text-[13px] font-bold shadow-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white text-slate-600 text-[13px] font-bold hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50" disabled={!data || data.length === 0}>
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50" disabled={!data || data.length === 0}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};


export default function AdminDashboard() {
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
              Users
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <GraduationCap size={16} />
              Courses
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors">
              <Activity size={16} />
              System Health
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 relative">
          <button className="text-slate-400 hover:text-slate-600 transition-colors hidden sm:block"><Bell size={20} /></button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors hidden sm:block"><Settings size={20} /></button>
          {/* User Profile Area */}
          <div className="flex items-center gap-3 pl-0 sm:pl-6 sm:border-l border-slate-200 cursor-pointer group relative" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-bold text-slate-900 group-hover:text-[#00838f] transition-colors">{user?.fullName || user?.name || 'Admin'}</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase">ADMIN</p>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 group-hover:border-[#00838f] group-hover:shadow-sm transition-all">
              <div className="w-full h-full bg-[#00838f] flex items-center justify-center text-white text-[14px] font-bold">
                {(user?.fullName?.trim().split(' ').pop() || user?.name || 'A')[0].toUpperCase()}
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

      {/* MAIN CONTENT */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-[24px] font-bold text-[#006064] mb-8 tracking-tight">
          System Overview
        </h1>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TotalUsersWidget />
          <CoursesWidget />
          <SystemHealthWidget />
        </div>

        {/* USER MANAGEMENT SECTION */}
        <UserManagementWidget />
      </main>

      {/* FLOATING ACTION BUTTON (Mobile only since top nav is hidden) */}
      <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#006064] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#00838f] hover:scale-105 active:scale-95 transition-all z-40">
        <Plus size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Settings, ChevronRight, Users, GraduationCap, Activity, Plus, ChevronLeft, Edit2, Trash2, LayoutDashboard } from 'lucide-react';
import { DashboardUserActions, Logo } from '@/components';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/api';
import { ROLES, ROUTES } from '@/shared';

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
const USERS_PER_PAGE = 10;
const ADMIN_ROLE_OPTIONS = [
  ROLES.STUDENT,
  ROLES.COUNSELOR,
  ROLES.MENTOR,
  ROLES.ADMIN
];

const UserManagementWidget = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleError, setRoleError] = useState('');
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  useEffect(() => { 
    adminApi.getUsersList().then(res => {
      setData(Array.isArray(res) ? res : []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((user) => {
      const name = String(user.name || '').toLowerCase();
      return name.includes(keyword);
    });
  }, [data, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  const visibleStart = filteredUsers.length ? startIndex + 1 : 0;
  const visibleEnd = Math.min(startIndex + USERS_PER_PAGE, filteredUsers.length);
  const firstVisiblePage = Math.max(1, Math.min(safeCurrentPage - 2, totalPages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => firstVisiblePage + index
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openRoleEditor = (user: any) => {
    setEditingUser(user);
    setSelectedRole(String(user.role || ROLES.STUDENT).toUpperCase());
    setRoleError('');
  };

  const closeRoleEditor = () => {
    setEditingUser(null);
    setSelectedRole('');
    setRoleError('');
  };

  const handleSaveRole = async () => {
    if (!editingUser || !selectedRole) return;

    setIsSavingRole(true);
    setRoleError('');

    try {
      const updatedUser = await adminApi.updateUserRole(editingUser.id, selectedRole);
      setData((users) =>
        users.map((user) =>
          user.id === editingUser.id
            ? { ...user, ...updatedUser, role: updatedUser?.role || selectedRole }
            : user
        )
      );
      closeRoleEditor();
    } catch {
      setRoleError('Could not update user role. Please try again.');
    } finally {
      setIsSavingRole(false);
    }
  };

  const openDeleteConfirm = (user: any) => {
    setDeletingUser(user);
    setDeleteError('');
  };

  const closeDeleteConfirm = () => {
    if (isDeletingUser) return;
    setDeletingUser(null);
    setDeleteError('');
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsDeletingUser(true);
    setDeleteError('');

    try {
      await adminApi.deleteUser(deletingUser.id);
      setData((users) => users.filter((user) => user.id !== deletingUser.id));
      setDeletingUser(null);
    } catch {
      setDeleteError('Could not delete this account. Please try again.');
    } finally {
      setIsDeletingUser(false);
    }
  };

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
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
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
            ) : paginatedUsers.length > 0 ? (
              // Data State
              paginatedUsers.map((user: any) => {
                const displayName = user.name || 'Unknown User';
                const displayRole = user.role || 'Unknown';
                const roleLabel = String(displayRole).toUpperCase();

                return (
                <div key={user.id} className="grid grid-cols-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#00838f] flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                      {displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[14px] font-bold text-slate-900 group-hover:text-[#00838f] transition-colors">{displayName}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      roleLabel === 'MENTOR' ? 'bg-[#e0f2fe] text-[#0369a1]' : 
                      roleLabel === 'ADMIN' ? 'bg-[#fce7f3] text-[#be185d]' : 
                      'bg-[#f1f5f9] text-slate-600'
                    }`}>
                      {displayRole}
                    </span>
                  </div>
                  <div className="text-[14px] text-slate-500">{user.joinedDate}</div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-lg border border-[#bae6fd] bg-[#e0f2fe] px-3 py-2 text-[12px] font-bold text-[#006064] shadow-sm transition-all hover:border-[#7dd3fc] hover:bg-[#bae6fd]"
                      title="Edit role"
                      onClick={() => openRoleEditor(user)}
                    >
                      <Edit2 size={14} />
                      Edit role
                    </button>
                    <button
                      className="inline-flex min-w-[76px] items-center justify-center gap-1.5 rounded-lg border border-rose-100 bg-white px-3 py-2 text-[12px] font-bold text-rose-600 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50"
                      title="Delete account"
                      onClick={() => openDeleteConfirm(user)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
                );
              })
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
          Showing {filteredUsers.length ? `${visibleStart} to ${visibleEnd}` : '0'} of {filteredUsers.length} users
        </span>
        <div className="flex items-center gap-1.5">
          <button
            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
            disabled={safeCurrentPage === 1 || filteredUsers.length === 0}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            <ChevronLeft size={14} />
          </button>
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              disabled={filteredUsers.length === 0}
              className={`w-8 h-8 flex items-center justify-center border rounded-md text-[13px] font-bold transition-all disabled:opacity-50 ${
                page === safeCurrentPage
                  ? 'border-[#006064] bg-[#006064] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
            disabled={safeCurrentPage === totalPages || filteredUsers.length === 0}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-[16px] font-bold text-slate-900">Edit user role</h3>
              <p className="mt-1 text-[13px] text-slate-500">{editingUser.name}</p>
            </div>

            <div className="px-6 py-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[14px] font-semibold text-slate-800 outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20"
              >
                {ADMIN_ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              {roleError && (
                <p className="mt-3 text-[13px] font-medium text-rose-600">{roleError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeRoleEditor}
                disabled={isSavingRole}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                disabled={isSavingRole}
                className="px-4 py-2 rounded-lg bg-[#006064] text-[13px] font-bold text-white hover:bg-[#00838f] disabled:opacity-60"
              >
                {isSavingRole ? 'Saving...' : 'Save role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-[16px] font-bold text-slate-900">Delete account</h3>
              <p className="mt-1 text-[13px] text-slate-500">
                This action will permanently delete this user account.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3">
                <p className="text-[13px] font-bold text-rose-700">{deletingUser.name}</p>
                <p className="mt-1 text-[12px] text-rose-600">Role: {deletingUser.role}</p>
              </div>

              {deleteError && (
                <p className="mt-3 text-[13px] font-medium text-rose-600">{deleteError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={isDeletingUser}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeletingUser}
                className="px-4 py-2 rounded-lg bg-rose-600 text-[13px] font-bold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {isDeletingUser ? 'Deleting...' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
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

        <div className="relative">
          <DashboardUserActions user={user} onLogout={handleLogout} />
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

import { Bell, LogOut, Settings } from 'lucide-react'

interface DashboardUserActionsProps {
  user: any
  onLogout: () => void
}

export default function DashboardUserActions({ user, onLogout }: DashboardUserActionsProps) {
  const fullName = user?.fullName || user?.name || 'User'
  const email = user?.email || 'No email'
  const role = String(user?.role || 'USER').toUpperCase()
  const initial = fullName.trim()[0]?.toUpperCase() || 'U'

  return (
    <div className="flex items-center gap-5 md:gap-6">
      <div className="flex items-center gap-3 pr-5 md:pr-6 border-r border-slate-200">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title="Settings"
        >
          <Settings size={20} />
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-[14px] font-bold leading-5 text-slate-900">{fullName}</p>
          <p className="text-[12px] font-medium leading-5 text-slate-500">{email}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#006064]">{role}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00838f] text-[14px] font-bold text-white shadow-sm">
          {initial}
        </div>
      </div>
    </div>
  )
}

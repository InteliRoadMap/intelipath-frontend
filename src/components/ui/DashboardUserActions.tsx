import { Bell, LogOut, Settings } from 'lucide-react'

interface DashboardUserActionsProps {
  user: any
  onLogout: () => void
  onSettings?: () => void
}

export default function DashboardUserActions({ user, onLogout, onSettings }: DashboardUserActionsProps) {
  const fullName = user?.fullName || user?.name || 'User'
  const email = user?.email || 'No email'
  const role = String(user?.role || 'USER').toUpperCase()
  const initial = fullName.trim()[0]?.toUpperCase() || 'U'

  return (
    <div className="flex min-w-0 items-center gap-3 lg:gap-4">
      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3 lg:gap-2 lg:pr-4">
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
        </button>
        <button
          type="button"
          onClick={onSettings}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title="Settings"
        >
          <Settings size={18} />
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden min-w-0 max-w-[180px] flex-col items-end justify-center text-right sm:flex lg:max-w-[260px]">
          <div className="flex max-w-full items-baseline justify-end gap-2">
            <p className="truncate text-[13px] font-bold leading-4 text-slate-900">{fullName}</p>
            <span className="shrink-0 text-[10px] font-bold uppercase leading-4 tracking-wide text-[#006064]">
              {role}
            </span>
          </div>
          <p className="mt-0.5 max-w-full truncate text-[12px] font-medium leading-4 text-slate-500">{email}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00838f] text-[13px] font-bold text-white shadow-sm">
          {initial}
        </div>
      </div>
    </div>
  )
}

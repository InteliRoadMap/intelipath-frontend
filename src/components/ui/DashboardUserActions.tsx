import { Bell, GearSix, SignOut } from '@phosphor-icons/react'
import type { User } from '@/features/auth'
import NotificationPanel from './NotificationPanel'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared'

interface DashboardUserActionsProps {
  user: User | null
  onLogout: () => void
  onSettings?: () => void
}

export default function DashboardUserActions({ user, onLogout, onSettings }: DashboardUserActionsProps) {
  const navigate = useNavigate()
  const fullName = user?.fullName || 'User'
  const email = user?.email || 'No email'
  const role = String(user?.role || 'USER').toUpperCase()
  const initial = fullName.trim()[0]?.toUpperCase() || 'U'

  return (
    <div className="flex min-w-0 items-center gap-3 lg:gap-4">
      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3 lg:gap-2 lg:pr-4">
        <NotificationPanel />
        <button
          type="button"
          onClick={onSettings || (() => {
            const roleKey = String(user?.role || 'USER').toUpperCase();
            if (roleKey === 'MENTOR') {
              navigate(ROUTES.MENTOR_SETTINGS || '/mentor/settings');
            } else if (roleKey === 'COUNSELOR') {
              navigate(ROUTES.COUNSELOR_SETTINGS || '/counselor/settings');
            } else {
              navigate(ROUTES.PROFILE_SETTINGS || '/profile/settings');
            }
          })}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title="Settings"
        >
          <GearSix size={18} weight="duotone" />
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          title="Logout"
        >
          <SignOut size={18} weight="duotone" />
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

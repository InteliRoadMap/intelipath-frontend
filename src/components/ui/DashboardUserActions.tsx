import React, { useState, useEffect } from 'react'
import { Bell, GearSix, SignOut } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared'
import type { User } from '@/features/auth'

interface DashboardUserActionsProps {
  user: User | null
  onLogout: () => void
  onSettings?: () => void
}

export default function DashboardUserActions({ user, onLogout, onSettings }: DashboardUserActionsProps) {
  const fullName = user?.fullName || 'User'
  const email = user?.email || 'No email'
  const role = String(user?.role || 'USER').toUpperCase()
  const initial = fullName.trim()[0]?.toUpperCase() || 'U'
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Listen for localstorage changes specifically for notifications
  useEffect(() => {
    const loadNotifications = () => {
      try {
        if (role !== 'STUDENT') {
          setNotifications([]);
          return;
        }
        
        const notifStr = localStorage.getItem('student_notification')
        if (notifStr) {
          const parsed = JSON.parse(notifStr)
          setNotifications([parsed])
        } else {
          setNotifications([])
        }
      } catch (e) {}
    }

    loadNotifications()
    const interval = setInterval(loadNotifications, 1000)
    return () => clearInterval(interval)
  }, [role])

  const handleClearNotifications = () => {
    localStorage.removeItem('student_notification')
    setNotifications([])
    setShowNotifications(false)
  }

  const handleNotificationClick = () => {
    setShowNotifications(false);
    navigate(ROUTES.DASHBOARD_STUDENT_PORTFOLIO);
  }

  return (
    <div className="flex min-w-0 items-center gap-3 lg:gap-4">
      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3 lg:gap-2 lg:pr-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
            title="Notifications"
          >
            <Bell size={18} weight="duotone" />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={handleClearNotifications} className="text-xs text-[#00838f] font-semibold hover:underline">
                    Mark as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div 
                      key={idx} 
                      onClick={handleNotificationClick}
                      className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
                    >
                      <p className="text-sm text-slate-800 font-medium mb-1">{notif.message}</p>
                      <span className="text-xs text-slate-400">Just now</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onSettings}
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

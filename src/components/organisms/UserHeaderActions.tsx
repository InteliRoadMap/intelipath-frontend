import React, { useState, useEffect, useRef } from 'react'
import { Bell, UserCircle, SignOut, CaretDown, GearSix, IdentificationBadge } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared'
import type { User } from '@/features/auth'

interface UserHeaderActionsProps {
  user: User | null
  onLogout: () => void
  onSettings?: () => void
}

export default function UserHeaderActions({ user, onLogout, onSettings }: UserHeaderActionsProps) {
  const navigate = useNavigate()
  const fullName = user?.fullName || 'User'
  const email = user?.email || 'No email'
  const role = String(user?.role || 'USER').toUpperCase()
  const initial = fullName.trim()[0]?.toUpperCase() || 'U'

  const [notifications, setNotifications] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSettingsClick = () => {
    setShowDropdown(false)
    if (onSettings) {
      onSettings()
    } else {
      const roleKey = String(user?.role || 'USER').toUpperCase()
      if (roleKey === 'MENTOR') {
        navigate(ROUTES.MENTOR_SETTINGS || '/mentor/settings')
      } else if (roleKey === 'COUNSELOR') {
        navigate(ROUTES.COUNSELOR_SETTINGS || '/counselor/settings')
      } else {
        navigate(ROUTES.PROFILE_SETTINGS || '/profile/settings')
      }
    }
  }

  const handleNotificationClick = () => {
    setShowDropdown(false)
    // Clear notification upon reading it by clicking it
    localStorage.removeItem('student_notification')
    setNotifications([])
    navigate(ROUTES.DASHBOARD_STUDENT_PORTFOLIO)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a0a0a] text-[14px] font-bold text-white shadow-sm overflow-hidden">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            initial
          )}
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-rose-500" />
          )}
        </div>
        <CaretDown size={14} weight="bold" className="text-slate-500" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* User Info Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-bold text-slate-900 truncate">{fullName}</span>
              <span className="text-[12px] font-medium text-slate-500 truncate">{email}</span>
            </div>
            <div className="mt-2 inline-flex px-2 py-0.5 bg-slate-200/70 text-slate-700 text-[10px] font-bold rounded-full uppercase tracking-widest">
              {role}
            </div>
          </div>

          <div className="p-2 flex flex-col gap-1">
            {/* Notifications */}
            <button
              onClick={notifications.length > 0 ? handleNotificationClick : undefined}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="relative text-slate-500">
                  <Bell size={18} weight="duotone" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <span className="text-[14px] font-medium text-slate-700">Notifications</span>
              </div>
              {notifications.length > 0 && (
                <span className="text-[12px] font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">{notifications.length}</span>
              )}
            </button>

            {/* Settings */}
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-700"
            >
              <GearSix size={18} weight="duotone" className="text-slate-500" />
              <span className="text-[14px] font-medium">Settings</span>
            </button>
            
            {/* Divider */}
            <div className="h-px bg-slate-100 my-1" />

            {/* Logout */}
            <button
              onClick={() => {
                setShowDropdown(false)
                onLogout()
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 transition-colors text-left text-rose-600 group"
            >
              <SignOut size={18} weight="duotone" className="text-rose-500 group-hover:text-rose-600" />
              <span className="text-[14px] font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

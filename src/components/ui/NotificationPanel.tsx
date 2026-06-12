<<<<<<< HEAD
import { useState } from "react"
import { AlertTriangle, Bell, CheckCheck, CheckCircle, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "./dialog"
=======
import { useState, useRef, useEffect } from "react"
import {
  Bell,
  X,
  CheckCircle,
  Info,
  AlertTriangle,
  ArrowLeft,
  CheckCheck
} from "lucide-react"
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba

export interface Notification {
  id: string
  type: "info" | "success" | "warning"
  title: string
  message: string
  time: string
  read: boolean
}

<<<<<<< HEAD
const MOCK_NOTIFICATIONS: Notification[] = []

function NotificationIcon({ type }: { type: Notification["type"] }) {
  if (type === "success") return <CheckCircle size={20} className="mt-0.5 shrink-0 text-emerald-500" />
  if (type === "warning") return <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" />
  return <Info size={20} className="mt-0.5 shrink-0 text-sky-500" />
}

function NotificationItem({
  notification,
  onRead,
  compact = false
}: {
  notification: Notification
=======
// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Roadmap updated",
    message:
      "Your learning roadmap has been updated based on your latest skill assessment.",
    time: "2 min ago",
    read: false
  },
  {
    id: "2",
    type: "info",
    title: "New mentor available",
    message:
      "A new mentor specializing in React and TypeScript is now available for booking.",
    time: "1 hr ago",
    read: false
  },
  {
    id: "3",
    type: "warning",
    title: "Skill gap detected",
    message:
      "Market demand for Python has risen significantly. Consider adding it to your roadmap.",
    time: "3 hr ago",
    read: false
  },
  {
    id: "4",
    type: "info",
    title: "AI Mentor session ready",
    message:
      "Your scheduled AI Mentor session is ready. Join now to get personalized guidance.",
    time: "Yesterday",
    read: true
  },
  {
    id: "5",
    type: "success",
    title: "Profile setup complete",
    message:
      "Great! Your profile is fully set up. You can now access all features.",
    time: "2 days ago",
    read: true
  },
  {
    id: "6",
    type: "info",
    title: "Weekly report available",
    message:
      "Your weekly learning progress report is now available. Check your dashboard.",
    time: "3 days ago",
    read: true
  },
  {
    id: "7",
    type: "warning",
    title: "Incomplete skills",
    message:
      "You have 3 unrated skills. Rate them to get a more accurate roadmap suggestion.",
    time: "4 days ago",
    read: true
  },
  {
    id: "8",
    type: "success",
    title: "Counselor feedback received",
    message:
      "Your counselor has reviewed your progress and left new feedback for you.",
    time: "5 days ago",
    read: true
  }
]

// ─── Icons per type ────────────────────────────────────────────────────────────
function NotifIcon({ type }: { type: Notification["type"] }) {
  if (type === "success")
    return (
      <CheckCircle size={22} className="text-emerald-500 shrink-0 mt-0.5" />
    )
  if (type === "warning")
    return (
      <AlertTriangle size={22} className="text-amber-500 shrink-0 mt-0.5" />
    )
  return <Info size={22} className="text-sky-500 shrink-0 mt-0.5" />
}

// ─── Single notification row ───────────────────────────────────────────────────
function NotifItem({
  notif,
  onRead,
  compact = false
}: {
  notif: Notification
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
  onRead: (id: string) => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
<<<<<<< HEAD
      onClick={() => onRead(notification.id)}
      className={`flex w-full cursor-pointer items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 ${
        notification.read ? "bg-white" : "bg-[#f0fafa]"
      }`}
    >
      <NotificationIcon type={notification.type} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-[14px] leading-5 ${
              notification.read ? "font-medium text-slate-700" : "font-semibold text-slate-900"
            } ${compact ? "line-clamp-1" : ""}`}
          >
            {notification.title}
          </p>
          <span className="mt-0.5 shrink-0 whitespace-nowrap text-[12px] font-medium text-slate-400">
            {notification.time}
          </span>
        </div>
        <p className={`mt-1 text-[13px] leading-5 text-slate-500 ${compact ? "line-clamp-1" : "line-clamp-2"}`}>
          {notification.message}
        </p>
      </div>
      {!notification.read && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#00838f]" />}
=======
      onClick={() => onRead(notif.id)}
      className={`w-full text-left flex items-start gap-4 px-6 py-4 transition-colors hover:bg-slate-50 ${
        !notif.read ? "bg-[#f0fafa]" : "bg-white"
      }`}
    >
      <NotifIcon type={notif.type} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-[15px] leading-6 ${
              !notif.read
                ? "font-semibold text-slate-900"
                : "font-medium text-slate-700"
            } ${compact ? "line-clamp-1" : ""}`}
          >
            {notif.title}
          </p>
          <span className="shrink-0 text-[13px] text-slate-400 font-medium mt-0.5 whitespace-nowrap">
            {notif.time}
          </span>
        </div>
        <p
          className={`mt-1 text-[13px] leading-5 text-slate-500 ${
            compact ? "line-clamp-1" : "line-clamp-2"
          }`}
        >
          {notif.message}
        </p>
      </div>
      {!notif.read && (
        <span className="mt-2 shrink-0 h-2.5 w-2.5 rounded-full bg-[#00838f]" />
      )}
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
    </button>
  )
}

<<<<<<< HEAD
export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) => notification.id === id ? { ...notification, read: true } : notification)
=======
// ─── Full-page panel (fixed overlay) ──────────────────────────────────────────
function NotifFullPage({
  notifications,
  onRead,
  onReadAll,
  onClose
}: {
  notifications: Notification[]
  onRead: (id: string) => void
  onReadAll: () => void
  onClose: () => void
}) {
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div
      className="fixed inset-0 flex flex-col bg-white"
      style={{
        zIndex: 9999,
        animation: "notif-slide-up 0.22s cubic-bezier(0.22,1,0.36,1)"
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-white sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e0f5f5]">
            <Bell size={22} className="text-[#00838f]" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-slate-900">
              Notifications
            </h2>
            <p className="text-[13px] text-slate-500">
              {unread > 0 ? `${unread} unread` : "All caught up"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              type="button"
              onClick={onReadAll}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[14px] font-semibold text-[#00838f] hover:bg-[#e0f5f5] transition-colors"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-w-2xl w-full mx-auto">
        {notifications.map((n) => (
          <NotifItem key={n.id} notif={n} onRead={onRead} />
        ))}
      </div>

      {/* Footer — collapse button */}
      <div className="border-t border-slate-200 bg-white px-6 py-4 flex justify-center">
        <button
          type="button"
          id="notification-collapse-btn"
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl px-8 py-2.5 text-[14px] font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <style>{`
        @keyframes notif-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── Main exported component ───────────────────────────────────────────────────
export default function NotificationPanel() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isFullPage, setIsFullPage] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length
  const previewNotifs = notifications.slice(0, 4)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
    )
  }

  const markAllRead = () => {
<<<<<<< HEAD
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
          )}
        </button>

      </div>

      <DialogContent className="max-w-[560px] overflow-hidden p-0">
        <DialogHeader className="mb-0 border-b border-slate-100 bg-slate-50/80 px-6 py-5 pr-14">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e0f5f5] text-[#00838f]">
              <Bell size={22} />
            </div>
            <div>
              <DialogTitle className="text-[19px]">Notifications</DialogTitle>
              <DialogDescription>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {unreadCount > 0 && (
          <div className="flex justify-end border-b border-slate-100 px-5 py-3">
            <button
              type="button"
              onClick={markAllRead}
              className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold text-[#00838f] transition-colors hover:bg-[#e0f5f5]"
            >
              <CheckCheck size={15} />
              Mark all read
            </button>
          </div>
        )}

        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Bell size={25} />
              </div>
              <p className="text-[15px] font-bold text-slate-900">No notifications yet</p>
              <p className="mx-auto mt-2 max-w-xs text-[13px] leading-6 text-slate-500">
                Updates about roadmap progress, mentor responses, and system alerts will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onRead={markRead} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
=======
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleViewAll = () => {
    setIsDropdownOpen(false)
    setIsFullPage(true)
  }

  return (
    <>
      {/* Bell button + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          id="notification-bell-btn"
          onClick={() => setIsDropdownOpen((v) => !v)}
          className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors"
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          )}
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            style={{
              top: "100%",
              zIndex: 9998,
              animation: "notif-dropdown-in 0.18s cubic-bezier(0.22,1,0.36,1)"
            }}
          >
            {/* Dropdown header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-slate-900">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    markAllRead()
                  }}
                  className="text-[11px] font-semibold text-[#00838f] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
              {previewNotifs.map((n) => (
                <NotifItem key={n.id} notif={n} onRead={markRead} compact />
              ))}
            </div>

            {/* View all button */}
            <div className="border-t border-slate-100 p-2">
              <button
                type="button"
                id="notification-view-all-btn"
                onClick={handleViewAll}
                className="w-full rounded-xl py-2 text-center text-[13px] font-semibold text-[#00838f] hover:bg-[#e0f5f5] transition-colors"
              >
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full-page panel */}
      {isFullPage && (
        <NotifFullPage
          notifications={notifications}
          onRead={markRead}
          onReadAll={markAllRead}
          onClose={() => {
            setIsFullPage(false)
            setIsDropdownOpen(true)
          }}
        />
      )}

      <style>{`
        @keyframes notif-dropdown-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
>>>>>>> 0c78e0a64b9c26c878f319025fc41274d1b07fba
  )
}

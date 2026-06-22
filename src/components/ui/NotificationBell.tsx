import { useState, useRef, useEffect } from "react"
import dashboardApi from "../../api/dashboardApi"
import { createPortal } from "react-dom"
import {
  Bell,
  X,
  CheckCircle,
  Info,
  AlertTriangle,
  ArrowLeft,
  CheckCheck
} from "lucide-react"

export interface Notification {
  id: string
  type: "info" | "success" | "warning"
  title: string
  message: string
  time: string
  read: boolean
}

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
  onRead: (id: string) => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
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
    </button>
  )
}

function NotifSkeletonItem() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
      </div>
      <div className="hidden md:block h-4 w-1/4 rounded bg-slate-100 animate-pulse" />
      <div className="h-8 w-16 shrink-0 rounded-lg bg-slate-100 animate-pulse" />
    </div>
  )
}

// ─── Full-page panel (fixed overlay) ──────────────────────────────────────────
export function NotifFullPage({
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

  return createPortal(
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
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <NotifItem key={n.id} notif={n} onRead={onRead} />
          ))
        ) : (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <NotifSkeletonItem key={i} />
            ))}
          </div>
        )}
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
    </div>,
    document.body
  )
}

// ─── Main exported component ───────────────────────────────────────────────────
export default function NotificationBell({ asMenuItem, onCloseMenu }: { asMenuItem?: boolean; onCloseMenu?: () => void } = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isFullPage, setIsFullPage] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length
  const previewNotifs = notifications.slice(0, 4)

  useEffect(() => {
    // Fetch notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await dashboardApi.getMentorFeedback()
        const data = res.data?.data || res.data
        
        let mappedNotifs: Notification[] = []
        
        if (data && Array.isArray(data)) {
          mappedNotifs = data.map((fb: any) => ({
            id: fb.feedbackId || fb.id || Math.random().toString(),
            type: "info",
            title: `New Feedback from ${fb.senderName || 'Mentor/Counselor'}`,
            message: fb.content || "No content provided",
            time: new Date(fb.createAt || Date.now()).toLocaleDateString(),
            read: false,
          }))
        }

        // Check local storage mock notification
        const localNotif = localStorage.getItem('student_notification')
        if (localNotif) {
          try {
            const parsed = JSON.parse(localNotif)
            mappedNotifs.unshift({
              id: "local-mock-1",
              type: "success",
              title: `New Feedback from ${parsed.senderName || 'Mentor'}`,
              message: "Your portfolio has received a new review!",
              time: new Date().toLocaleDateString(),
              read: false,
            })
          } catch(e) {}
        }
        
        setNotifications(mappedNotifs)
      } catch (err) {
        console.error("Failed to fetch notifications:", err)
      }
    }
    fetchNotifications()
  }, [])

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
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleViewAll = () => {
    setIsDropdownOpen(false)
    setIsFullPage(true)
    if (onCloseMenu) onCloseMenu()
  }

  return (
    <>
      {/* Bell button + Dropdown */}
      <div className={asMenuItem ? "w-full" : "relative"} ref={dropdownRef}>
        {asMenuItem ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsDropdownOpen((v) => !v)
            }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="relative text-slate-500">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500" />
                )}
              </div>
              <span className="text-[14px] font-medium text-slate-700">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="text-[12px] font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
        ) : (
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
        )}

        {/* Dropdown */}
        {isDropdownOpen && (
          <div
            className={`absolute mt-2 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ${asMenuItem ? '' : 'right-0'}`}
            style={{
              top: asMenuItem ? "0" : "100%",
              right: asMenuItem ? "100%" : "0",
              marginRight: asMenuItem ? "8px" : "0",
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
              {notifications.length > 0 ? (
                previewNotifs.map((n) => (
                  <NotifItem key={n.id} notif={n} onRead={markRead} compact />
                ))
              ) : (
                <div className="divide-y divide-slate-100">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <NotifSkeletonItem key={i} />
                  ))}
                </div>
              )}
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
  )
}

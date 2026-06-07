import { useState } from "react"
import { AlertTriangle, Bell, CheckCheck, CheckCircle, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "./dialog"

export interface Notification {
  id: string
  type: "info" | "success" | "warning"
  title: string
  message: string
  time: string
  read: boolean
}

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
  onRead: (id: string) => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
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
    </button>
  )
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) => notification.id === id ? { ...notification, read: true } : notification)
    )
  }

  const markAllRead = () => {
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
  )
}

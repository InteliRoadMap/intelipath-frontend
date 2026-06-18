export type AdminRole = "STUDENT" | "COUNSELOR" | "MENTOR" | "ADMIN"

export interface AdminUserMetric {
  total: number
  growth: number
}

export interface AdminCourseMetric {
  total: number
  status: string
  progress: number
}

export interface AdminSystemHealth {
  uptime: number
  status: string
}

export interface AdminUserListItem {
  id: string
  name: string
  email?: string
  role: AdminRole
  joinedDate: string
}

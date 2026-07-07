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

export interface AdminServiceStatus {
  name: string
  up: boolean
}

export interface AdminSystemHealth {
  status: string
  servicesUp: number
  servicesTotal: number
  services: AdminServiceStatus[]
}

export interface AdminUserListItem {
  id: string
  name: string
  email?: string
  role: AdminRole
  joinedDate: string
}

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  OAUTH_CALLBACK: "/auth/callback",
  DASHBOARD: "/dashboard",
  DASHBOARD_STUDENT: "/dashboard/student",
  DASHBOARD_STUDENT_ROADMAP: "/dashboard/student/roadmap",
  DASHBOARD_COUNSELOR: "/dashboard/counselor",
  COUNSELOR_FEEDBACK: "/dashboard/counselor/feedback",
  DASHBOARD_MENTOR: "/dashboard/mentor",
  DASHBOARD_ADMIN: "/dashboard/admin",
  PROFILE_SETTINGS: "/profile-settings",
  MENTOR_SETTINGS: "/dashboard/mentor/settings",
  COUNSELOR_SETTINGS: "/dashboard/counselor/settings",
  AI_MENTOR: "/mentor"
} as const

export const ROLES = {
  STUDENT: "STUDENT",
  COUNSELOR: "COUNSELOR",
  MENTOR: "MENTOR",
  ADMIN: "ADMIN"
} as const

export type Role = keyof typeof ROLES

export const ROUTES = {
  HOME: '/',
  WELCOME_DEMO: '/welcome-demo',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  OAUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  DASHBOARD_STUDENT: '/dashboard/student',
  DASHBOARD_STUDENT_ROADMAP: '/dashboard/student/roadmap',
  AI_MENTOR: '/dashboard/student/ai-mentor',
  DASHBOARD_STUDENT_PORTFOLIO: '/dashboard/student/portfolio',
  DASHBOARD_STUDENT_FEEDBACK: '/dashboard/student/feedback',
  DASHBOARD_STUDENT_SETTINGS: '/dashboard/student/settings',
  DASHBOARD_COUNSELOR: '/dashboard/counselor',
  COUNSELOR_FEEDBACK: "/dashboard/counselor/feedback",
  DASHBOARD_MENTOR: '/dashboard/mentor',
  DASHBOARD_MENTOR_STUDENTS: '/dashboard/mentor/students',
  DASHBOARD_MENTOR_FEEDBACK: '/dashboard/mentor/feedback',
  DASHBOARD_MENTOR_PORTFOLIO: '/dashboard/mentor/portfolio/:studentId',
  DASHBOARD_MENTOR_SETTINGS: '/dashboard/mentor/settings',
  DASHBOARD_ADMIN: '/dashboard/admin',
  PROFILE_SETTINGS: "/profile-settings",
  MENTOR_SETTINGS: "/dashboard/mentor/settings",
  COUNSELOR_SETTINGS: "/dashboard/counselor/settings"
} as const

export const ROLES = {
  STUDENT: "STUDENT",
  COUNSELOR: "COUNSELOR",
  MENTOR: "MENTOR",
  ADMIN: "ADMIN"
} as const

export type Role = keyof typeof ROLES

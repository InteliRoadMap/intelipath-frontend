export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  OAUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  DASHBOARD_STUDENT: '/dashboard/student',
  DASHBOARD_STUDENT_ROADMAP: '/dashboard/student/roadmap',
  DASHBOARD_STUDENT_PORTFOLIO: '/dashboard/student/portfolio',
  DASHBOARD_COUNSELOR: '/dashboard/counselor',
  DASHBOARD_MENTOR: '/dashboard/mentor',
  DASHBOARD_MENTOR_STUDENTS: '/dashboard/mentor/students',
  DASHBOARD_MENTOR_FEEDBACK: '/dashboard/mentor/feedback',
  DASHBOARD_MENTOR_PORTFOLIO: '/dashboard/mentor/portfolio/:studentId',
  DASHBOARD_ADMIN: '/dashboard/admin',
} as const

export const ROLES = {
  STUDENT: 'STUDENT',
  COUNSELOR: 'COUNSELOR',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
} as const

export type Role = keyof typeof ROLES

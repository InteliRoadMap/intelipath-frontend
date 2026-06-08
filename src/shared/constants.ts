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
  DASHBOARD_COUNSELOR: '/dashboard/counselor',
  DASHBOARD_MENTOR: '/dashboard/mentor',
  DASHBOARD_ADMIN: '/dashboard/admin',
} as const

export const ROLES = {
  STUDENT: 'STUDENT',
  COUNSELOR: 'COUNSELOR',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
} as const

export type Role = keyof typeof ROLES

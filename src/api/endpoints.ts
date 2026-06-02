// API Endpoints Configuration

export const ENDPOINTS = {
  // Authentication & Authorization
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh'
  },
  COUNSELOR_DASHBOARD: {
    METRICS_STUDENTS: '/api/v1/counselor/dashboard/metrics/students',
    METRICS_PROGRESS: '/api/v1/counselor/dashboard/metrics/progress',
    METRICS_AT_RISK: '/api/v1/counselor/dashboard/metrics/at-risk',
    METRICS_ENGAGEMENT: '/api/v1/counselor/dashboard/metrics/engagement',
    LEARNING_ACTIVITY: '/api/v1/counselor/dashboard/learning-activity',
    SKILL_DISTRIBUTION: '/api/v1/counselor/dashboard/skill-distribution',
    RECENT_ACTIVITY: '/api/v1/counselor/dashboard/recent-activity',
    TOP_STUDENTS: '/api/v1/counselor/dashboard/top-students',
  },
  MENTOR_DASHBOARD: {
    WELCOME_ALERT: '/api/v1/mentor/dashboard/welcome-alert',
    METRICS_RATING: '/api/v1/mentor/dashboard/metrics/rating',
    METRICS_RESPONSE_TIME: '/api/v1/mentor/dashboard/metrics/response-time',
    METRICS_MENTEES: '/api/v1/mentor/dashboard/metrics/mentees',
    PENDING_REVIEWS: '/api/v1/mentor/dashboard/pending-reviews',
    INSIGHT: '/api/v1/mentor/dashboard/insight',
  }
} as const;

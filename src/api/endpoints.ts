// API Endpoints Configuration

export const ENDPOINTS = {
  // ─── Authentication & Authorization ──────────────────────────
  // Authentication & Authorization
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH_TOKEN: "/auth/refresh"
  },
  USERS: {
    ME: "/user/me"
  },
  STUDENT_DASHBOARD: {
    ROADMAP_PROGRESS: "/student/dashboard/roadmap-progress",
    SKILL_GAPS: "/student/dashboard/skill-gaps",
    MENTOR_FEEDBACK: "/student/dashboard/mentor-feedback",
    SKILL_COMPARISON: "/student/dashboard/skill-comparison",
    RECOMMENDATIONS: "/student/dashboard/recommendations",
    MARKET_DEMAND: "/student/dashboard/market-demand",
    AI_HISTORY: "/student/dashboard/ai-history"
  },
  ADMIN_DASHBOARD: {
    METRICS_USERS: "/admin/dashboard/metrics/users",
    METRICS_COURSES: "/admin/dashboard/metrics/courses",
    METRICS_HEALTH: "/admin/dashboard/metrics/health",
    USERS: "/admin/dashboard/users"
  },
  COUNSELOR_DASHBOARD: {
    METRICS_STUDENTS: "/counselor/dashboard/metrics/students",
    METRICS_PROGRESS: "/counselor/dashboard/metrics/progress",
    METRICS_AT_RISK: "/counselor/dashboard/metrics/at-risk",
    METRICS_ENGAGEMENT: "/counselor/dashboard/metrics/engagement",
    LEARNING_ACTIVITY: "/counselor/dashboard/learning-activity",
    SKILL_DISTRIBUTION: "/counselor/dashboard/skill-distribution",
    RECENT_ACTIVITY: "/counselor/dashboard/recent-activity",
    TOP_STUDENTS: "/counselor/dashboard/top-students"
  },
  MENTOR_DASHBOARD: {
    WELCOME_ALERT: "/mentor/dashboard/welcome-alert",
    METRICS_RATING: "/mentor/dashboard/metrics/rating",
    METRICS_RESPONSE_TIME: "/mentor/dashboard/metrics/response-time",
    METRICS_MENTEES: "/mentor/dashboard/metrics/mentees",
    PENDING_REVIEWS: "/mentor/dashboard/pending-reviews",
    INSIGHT: "/mentor/dashboard/insight"
  },
  // ─── User Profile (general) ────────────────────────────────────
  EDIT: {
    USERPROFILE: "/user/profile" // PATCH /user/profile
  },

  // ─── Student Profile ──────────────────────────────────────────

  STUDENT: {
    PROFILE: "/student/profile", // PATCH /student/profile
    SKILLS: "/student/skills", // GET  /student/{student_id}/skills  → truyền studentId vào URL khi gọi
    FILTER_SKILLS: "/student/skills", // GET  /student/skills/{category}     → truyền category vào URL khi gọi
    SELECT_SKILLS: "/student/skills/select" // POST /student/skills/select
  },

  // ─── Careers ──────────────────────────────────────────────────

  CAREER: {
    LIST: "/careers", // GET  /careers
    REQUIREMENTS: "/careers" // GET  /careers/{career_id}/requirements → truyền career_id vào URL khi gọi
  },

  // ─── Roadmap ──────────────────────────────────────────────────

  ROADMAP: {
    GET_ROAD_MAP: "/roadmap", // GET   /roadmap/{career_id}
    TOTAL_PROGRESS: "/roadmap", // GET   /roadmap/{career_id}/progress
    GET_NODE: "/roadmap/node", // GET   /roadmap/node/{node_id}
    UPDATE_PROGRESS: "/roadmap/node/progress", // PATCH /roadmap/node/progress  (nodeId + status trong body)
    SKILLS_COMPARE: "/roadmap/skills/compare" // POST  /roadmap/skills/compare
  }

  // Add other feature endpoints here as the project grows...
} as const

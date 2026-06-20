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
    ME: '/users/me',
    PROFILE: '/users/profile',
  },
  STUDENT_OLD: {
    PROFILE: '/students/profile',
    TARGET_CAREER: '/students/target-career',
    SKILLS: '/students/skills',
    SELECT_SKILLS: '/students/skills/select',
    ME: "/user/me",
    PROFILE_USER: "/user/profile"
  },
  STUDENT: {
    PROFILE: "/student/profile",
    SKILLS: "/student/skills",
    SELECT_SKILLS: "/student/skills/select",
    PORTFOLIO_ME: "/student/portfolio/me",
    PORTFOLIO_SLUG: "/student/portfolio/slug",
    PORTFOLIO_GITHUB_IMPORT: "/student/portfolio/projects/github-import"
  },
  CAREER_ROLES: {
    LIST: "/careers"
  },
  ROADMAP: {
    CAREER_ROADMAP: (careerId: string) => `/roadmaps/${careerId}`,
    CAREER_PROGRESS: (careerId: string) => `/roadmaps/${careerId}/progress`,
    STUDENT_ROADMAP: '/roadmaps/student',
    NODE_DETAIL: (nodeId: string) => `/roadmaps/nodes/${nodeId}`,
    UPDATE_NODE_PROGRESS: '/roadmaps/nodes/progress',
    COMPARE_SKILLS: '/roadmap/skills/compare',
  },
  STUDENT_DASHBOARD: {
    OVERVIEW: '/student/dashboard',
    ROADMAP_PROGRESS: '/student/dashboard/roadmap-progress',
    SKILL_GAPS: '/student/dashboard/skill-gaps',
    MENTOR_FEEDBACK: '/student/dashboard/mentor-feedback',
    RECOMMENDATIONS: '/student/dashboard/recommendations',
    MARKET_DEMAND: '/student/dashboard/market-demand',
    AI_HISTORY: '/student/dashboard/ai-history',
    COMPARE_SKILLS: "/roadmap/skills/compare"
  },
  MARKET_TRENDS: {
    TOP_HIRING: '/market-trends/companies/top-hiring',
    TRENDING_SKILLS: '/market-trends/skills/trending',
    SALARY_OVERVIEW: '/market-trends/salary-overview'
  },
  RECRUITMENT_POSTS: {
    ALL: '/recruitment-posts/',
    COMPANY: (companyId: string) => `/recruitment-posts/company/${companyId}`,
    RECRUITMENT: (recruitmentId: string) => `/recruitment-posts/recruitment/${recruitmentId}`
  },
  ADMIN_DASHBOARD: {
    METRICS_USERS: "/admin/dashboard/metrics/users",
    METRICS_COURSES: "/admin/dashboard/metrics/courses",
    METRICS_HEALTH: "/admin/dashboard/metrics/health",
    USERS: "/admin/dashboard/users",
    USER: (userId: string) => `/admin/dashboard/users/${userId}`,
    USER_ROLE: (userId: string) => `/admin/dashboard/users/${userId}/role`,
    TRIGGER_SKILL_EXTRACTION: "/admin/dashboard/trigger-skill-extraction"
  },
  COUNSELOR: {
    PROFILE: '/counselor/profile',
  },
  COUNSELOR_DASHBOARD: {
    METRICS_STUDENTS: "/counselor/dashboard/metrics/students",
    METRICS_PROGRESS: "/counselor/dashboard/metrics/progress",
    METRICS_AT_RISK: "/counselor/dashboard/metrics/at-risk",
    METRICS_ENGAGEMENT: "/counselor/dashboard/metrics/engagement",
    LEARNING_ACTIVITY: "/counselor/dashboard/learning-activity",
    CAREER_DISTRIBUTION: "/counselor/dashboard",
    MISSING_SKILLS: "/counselor/dashboard/missing-skills",
    GET_STUDENT_FEEDBACK: "/counselor/dashboard/feedback/me",
    GET_STUDENT_LIST: "/counselor/feedback/students",
    HISTORY_FEEDBACK: (studentId: string) => `/counselor/feedback/${studentId}`,
    CREATE_FEEDBACK: "/counselor/feedback/create",

    GET_COUNSELOR_PROFILE: "/counselor/me/profile"
  },
  MENTOR_DASHBOARD: {
    WELCOME_ALERT: "/mentor/dashboard/welcome-alert",
    METRICS: "/mentor/dashboard/metrics",
    PENDING_REVIEWS: "/mentor/dashboard/pending-reviews",
    INSIGHT: "/mentor/dashboard/insight",
    CAREER_DISTRIBUTION: '/mentor/dashboard/career-distribution',
    STUDENT_LIST: '/mentor/feedback/students',
    FEEDBACK_HISTORY: '/mentor/feedback/history',
    SUBMIT_FEEDBACK: '/mentor/feedback/submit',
    PROGRESS_REPORTS: '/mentor/dashboard/progress-reports'
  },
  MENTOR: {
    PROFILE: '/mentor/profile',
  },
  CHAT: {
    SESSIONS: "/chat/sessions",
    SESSION: (sessionId: string) => `/chat/sessions/${sessionId}`,
    MESSAGES: (sessionId: string) => `/chat/sessions/${sessionId}/messages`,
    STREAM: (sessionId: string) => `/chat/sessions/${sessionId}/stream`,
    UPLOAD_FILE: "/chat/files/upload"
  }
} as const

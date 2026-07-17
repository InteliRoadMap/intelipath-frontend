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
    ME: "/users/me",
    PROFILE: "/users/profile"
  },
  STUDENT_OLD: {
    PROFILE: "/students/profile",
    TARGET_CAREER: "/students/target-career",
    SKILLS: "/students/skills",
    SELECT_SKILLS: "/students/skills/select",
    ME: "/user/me",
    PROFILE_USER: "/user/profile"
  },
  STUDENT: {
    PROFILE: "/student/profile",
    SKILLS: "/student/skills",
    SELECT_SKILLS: "/student/skills/select",
    PORTFOLIO_ME: "/student/portfolio/me",
    PORTFOLIO_SLUG: "/student/portfolio/slug",
    // OLD CODE: (no old code for UPLOAD_TRANSCRIPT, just adding new endpoint)
    PORTFOLIO_GITHUB_IMPORT: "/student/portfolio/projects/github-import",
    PORTFOLIO_REQUEST_REVIEW: "/student/portfolio/request-review",
    UPLOAD_TRANSCRIPT: "/student/profile/transcript"
  },
  CAREER_ROLES: {
    LIST: "/careers"
  },
  ROADMAP: {
    CAREER_ROADMAP: (careerId: string) => `/roadmaps/${careerId}`,
    CAREER_PROGRESS: (careerId: string) => `/roadmaps/${careerId}/progress`,
    STUDENT_ROADMAP: "/roadmaps/student",
    NODE_DETAIL: (nodeId: string) => `/roadmaps/nodes/${nodeId}`,
    UPDATE_NODE_PROGRESS: "/roadmaps/nodes/progress",
    COMPARE_SKILLS: "/roadmap/skills/compare",
    SELECTIONS: "/roadmaps/selections",
    CLEAR_SELECTION: (groupNodeId: string) => `/roadmaps/selections/${groupNodeId}`
  },
  CURRICULUM: {
    FPT_SUBJECTS: "/curriculum/fpt-subjects",
    CURRICULUM_TERM: "/curriculum/term",
    SET_CURRICULUM: "/curriculum/set"
  },
  ROADMAP_RECOMMENDATIONS: {
    PENDING: "/roadmaps/recommendations",
    GENERATE: "/roadmaps/recommendations/generate",
    ACCEPT: (recommendationId: string) =>
      `/roadmaps/recommendations/${recommendationId}/accept`,
    REJECT: (recommendationId: string) =>
      `/roadmaps/recommendations/${recommendationId}/reject`
  },
  ROADMAP_EDITOR: {
    CAREER_NODES: (careerId: string) =>
      `/roadmaps/editor/careers/${careerId}/nodes`,
    CREATE_NODE: (careerId: string) =>
      `/roadmaps/editor/careers/${careerId}/nodes`,
    UPDATE_NODE: (nodeId: string) => `/roadmaps/editor/nodes/${nodeId}`,
    DELETE_NODE: (nodeId: string) => `/roadmaps/editor/nodes/${nodeId}`,
    SAVE_POSITIONS: "/roadmaps/editor/nodes/positions"
  },
  STUDENT_DASHBOARD: {
    OVERVIEW: "/student/dashboard",
    ROADMAP_PROGRESS: "/student/dashboard/roadmap-progress",
    SKILL_GAPS: "/student/dashboard/skill-gaps",
    MENTOR_FEEDBACK: "/student/dashboard/mentor-feedback",
    RECOMMENDATIONS: "/student/dashboard/recommendations",
    MARKET_DEMAND: "/student/dashboard/market-demand",
    AI_HISTORY: "/student/dashboard/ai-history",
    COMPARE_SKILLS: "/roadmap/skills/compare"
  },
  MARKET_TRENDS: {
    TOP_HIRING: "/market-trends/companies/top-hiring",
    TRENDING_SKILLS: "/market-trends/skills/trending",
    SALARY_OVERVIEW: "/market-trends/salary-overview"
  },
  // UNIVERSITIES: {
  //   LIST: "/universities"
  // },
  RECRUITMENT_POSTS: {
    ALL: "/recruitment-posts/",
    COMPANY: (companyId: string) => `/recruitment-posts/company/${companyId}`,
    RECRUITMENT: (recruitmentId: string) =>
      `/recruitment-posts/recruitment/${recruitmentId}`
  },
  ADMIN_DASHBOARD: {
    METRICS_USERS: "/admin/dashboard/metrics/users",
    METRICS_COURSES: "/admin/dashboard/metrics/courses",
    METRICS_HEALTH: "/admin/dashboard/metrics/health",
    USERS: "/admin/dashboard/users",
    USER: (userId: string) => `/admin/dashboard/users/${userId}`,
    USER_ROLE: (userId: string) => `/admin/dashboard/users/${userId}/role`,
    USER_STATUS: (userId: string) => `/admin/dashboard/users/${userId}/status`,
    TRIGGER_SKILL_EXTRACTION: "/admin/dashboard/trigger-skill-extraction",
    TRIGGER_JOB_SCRAPER: "/admin/dashboard/trigger-job-scraper"
  },
  ADMIN_FLM: {
    SYNC: "/admin/flm/sync",
    STATUS: "/admin/flm/status",
    JOBS: "/admin/flm/jobs",
    JOB: (jobId: string) => `/admin/flm/jobs/${jobId}`
  },
  COUNSELOR: {
    PROFILE: "/counselor/me/profile"
  },
  COUNSELOR_DASHBOARD: {
    // METRICS_STUDENTS: "/counselor/dashboard/metrics/students",
    // METRICS_PROGRESS: "/counselor/dashboard/metrics/progress",
    // METRICS_AT_RISK: "/counselor/dashboard/metrics/at-risk",
    // METRICS_ENGAGEMENT: "/counselor/dashboard/metrics/engagement",
    LEARNING_ACTIVITY: "/counselor/dashboard/learning-activity",
    CAREER_DISTRIBUTION: "/counselor/dashboard",
    CURRICULUMS: "/counselor/curriculums",
    MISSING_SKILLS: "/counselor/dashboard/missing-skills",
    GET_STUDENT_FEEDBACK: "/counselor/dashboard/feedback/me",
    GET_STUDENT_LIST: "/counselor/feedback/students",
    GET_STUDENT_INFO: (studentId: string) =>
      `/counselor/feedback/student/info/${studentId}`,
    HISTORY_FEEDBACK: (studentId: string) =>
      `/counselor/feedback/student/info/${studentId}`,
    CREATE_FEEDBACK: "/counselor/feedback/create",
    MODIFY_FEEDBACK: "/counselor/feedback/modify",
    DELETE_FEEDBACK: (feedbackId: string) =>
      `/counselor/feedback/delete/${feedbackId}`,
    EXPORT_STUDENTS: "/counselor/export-students",
    IMPORT_STUDENTS: "/counselor/import-students",
    CHECK_STUDENT_EMAIL: (email: string) => `/counselor/import-student/${email}`,
    GET_COUNSELOR_PROFILE: "/counselor/me/profile"
  },
  MENTOR_DASHBOARD: {
    WELCOME_ALERT: "/mentor/dashboard/welcome-alert",
    METRICS: "/mentor/dashboard/metrics",
    PENDING_REVIEWS: "/mentor/dashboard/pending-reviews",
    INSIGHT: "/mentor/dashboard/insight",
    CAREER_DISTRIBUTION: "/mentor/dashboard/career-distribution",
    STUDENT_LIST: "/mentor/feedback/students",
    FEEDBACK_HISTORY: "/mentor/feedback/history",
    SUBMIT_FEEDBACK: "/mentor/feedback/submit",
    PROGRESS_REPORTS: "/mentor/dashboard/progress-reports"
  },
  MENTOR: {
    PROFILE: "/mentor/profile"
  },
  CHAT: {
    SESSIONS: "/chat/sessions",
    SESSION: (sessionId: string) => `/chat/sessions/${sessionId}`,
    MESSAGES: (sessionId: string) => `/chat/sessions/${sessionId}/messages`,
    STREAM: (sessionId: string) => `/chat/sessions/${sessionId}/stream`,
    UPLOAD_FILE: "/chat/files/upload"
  },
  MENTOR_COURSES: {
    LIST: "/mentor/courses",
    CREATE: "/mentor/courses",
    UPDATE: (id: string) => `/mentor/courses/${id}`,
    DELETE: (id: string) => `/mentor/courses/${id}`,
    PUBLISH: (id: string) => `/mentor/courses/${id}/publish`
  },
  COURSES: {
    BROWSE: "/courses",
    DETAIL: (id: string) => `/courses/${id}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    PROGRESS: (id: string) => `/courses/${id}/progress`,
    MY_ENROLLMENTS: "/courses/me/enrollments"
  }
} as const

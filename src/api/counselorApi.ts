import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Counselor API Service
 * Fetches dashboard metrics for the Counselor role.
 */
export interface UpdateCounselorProfilePayload {
  fullName: string
  yob: string
  bio: string
  email: string
  university: string
  department: string
}
export interface CareerStatistics {
  careerName: string
  studentCount: number
}

export interface CounselorResponse {
  total: number
  careerStatistics: Record<string, number> | null
  missingSkills: Record<string, number>
  careerName?: string
}

export interface MissingSkillItem {
  skillName: string
  count: number
}

export interface Feedback {
  feedbackId: string
  senderId: string
  receiverId: string
  senderName: string
  content: string
  type: "GENERAL" | "SKILL" | "CAREER"
  createAt: string
  updateAt: string
}

export interface FeedbackListResponse {
  feedbacks: Feedback[]
}
export interface MyStudent {
  studentId: string
  fullName: string
  email?: string
  university: string
  careerPath: string | null
  roadmapProgress: number
  missingSkills: MissingSkillItem[]
}
export interface CreateFeedback {
  receiverId: string
  content: string
  type: "GENERAL" | "SKILL" | "CAREER"
}

const counselorApi = {
  getStudentsMetric: async () => {
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.METRICS_STUDENTS)
  },

  getProgressMetric: async () => {
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.METRICS_PROGRESS)
  },

  getAtRiskMetric: async () => {
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.METRICS_AT_RISK)
  },

  getEngagementMetric: async () => {
    return await mainClient.get(
      ENDPOINTS.COUNSELOR_DASHBOARD.METRICS_ENGAGEMENT
    )
  },

  getLearningActivity: async () => {
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.LEARNING_ACTIVITY)
  },

  getCareerDistribution: async (): Promise<CareerStatistics[]> => {
    const res = await mainClient.get(
      ENDPOINTS.COUNSELOR_DASHBOARD.CAREER_DISTRIBUTION
    )
    return res.data
  },

  getSkillMissing: async (careerName: string): Promise<CounselorResponse> => {
    const url = `${ENDPOINTS.COUNSELOR_DASHBOARD.MISSING_SKILLS}/${encodeURIComponent(careerName)}`
    const res = await mainClient.get(url)
    return res.data
  },

  getFeedback: async (): Promise<FeedbackListResponse> => {
    const res = await mainClient.get(
      ENDPOINTS.COUNSELOR_DASHBOARD.GET_STUDENT_FEEDBACK
    )
    return res.data
  },

  getMyStudent: async (search?: string): Promise<MyStudent[]> => {
    const url =
      search && search.trim()
        ? `${ENDPOINTS.COUNSELOR_DASHBOARD.GET_STUDENT_LIST}/${encodeURIComponent(search.trim())}`
        : ENDPOINTS.COUNSELOR_DASHBOARD.GET_STUDENT_LIST
    const res = await mainClient.get(url)
    return res.data?.students ?? []
  },
  getHistoryFeedback: async (
    studentId: string
  ): Promise<FeedbackListResponse> => {
    const res = await mainClient.get(
      ENDPOINTS.COUNSELOR_DASHBOARD.HISTORY_FEEDBACK(studentId)
    )
    return res.data
  },
  createFeedback: async (payload: CreateFeedback): Promise<CreateFeedback> => {
    const res = await mainClient.post(
      ENDPOINTS.COUNSELOR_DASHBOARD.CREATE_FEEDBACK,
      payload
    )
    return res.data
  }
}

export default counselorApi

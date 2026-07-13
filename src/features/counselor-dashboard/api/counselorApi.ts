import { ENDPOINTS, mainClient } from "@/shared/api"

import type {
  UpdateCounselorProfilePayload,
  CareerStatistics,
  CounselorResponse,
  MissingSkillItem,
  Feedback,
  FeedbackListResponse,
  MyStudent,
  CreateFeedback
} from "../types"

export type {
  UpdateCounselorProfilePayload,
  CareerStatistics,
  CounselorResponse,
  MissingSkillItem,
  Feedback,
  FeedbackListResponse,
  MyStudent,
  CreateFeedback
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
  // counselor dashboard
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
    const data = res.data?.data || res.data
    if (data && Array.isArray(data.content)) return { feedbacks: data.content }
    if (Array.isArray(data)) return { feedbacks: data }
    return data
  },
  // counselor feedbackS
  getMyStudent: async (search?: string): Promise<MyStudent[]> => {
    // Clean pagination via query params; request a large page so the full list
    // is returned (the view shows every assigned student, no client paging yet).
    const params = new URLSearchParams({ page: "0", size: "1000" })
    if (search && search.trim()) params.set("search", search.trim())
    const url = `${ENDPOINTS.COUNSELOR_DASHBOARD.GET_STUDENT_LIST}?${params.toString()}`
    try {
      const res = await mainClient.get(url)
      const data = res.data?.data || res.data
      if (data && Array.isArray(data.content)) return data.content
      if (Array.isArray(data)) return data
      return data?.students ?? []
    } catch {
      return []
    }
  },
  // New Add
  getStudentInfo: async (studentId: string): Promise<any> => {
    const res = await mainClient.get(
      ENDPOINTS.COUNSELOR_DASHBOARD.GET_STUDENT_INFO(studentId)
    )
    return res.data?.data || res.data
  },
  getHistoryFeedback: async (
    studentId: string
  ): Promise<FeedbackListResponse> => {
    // The counselor's per-student endpoint returns stats + the feedback history
    // together; pull just the feedbacks out of it.
    const res = await mainClient.get(
      ENDPOINTS.COUNSELOR_DASHBOARD.HISTORY_FEEDBACK(studentId)
    )
    const data = res.data?.data || res.data
    return { feedbacks: data?.feedbacks ?? [] }
  },
  createFeedback: async (payload: CreateFeedback): Promise<CreateFeedback> => {
    const res = await mainClient.post(
      ENDPOINTS.COUNSELOR_DASHBOARD.CREATE_FEEDBACK,
      payload
    )
    return res.data
  },
  modifyFeedback: async (payload: {
    feedbackId: string
    content: string
    type: string
  }): Promise<any> => {
    const res = await mainClient.patch(
      ENDPOINTS.COUNSELOR_DASHBOARD.MODIFY_FEEDBACK,
      payload
    )
    return res.data
  },
  deleteFeedback: async (feedbackId: string): Promise<any> => {
    const res = await mainClient.delete(
      ENDPOINTS.COUNSELOR_DASHBOARD.DELETE_FEEDBACK(feedbackId)
    )
    return res.data
  }
}

export default counselorApi

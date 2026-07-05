import { mainClient } from "../../../api/apiClients"
import { ENDPOINTS } from "../../../api/endpoints"

import type {
  UpdateCounselorProfilePayload,
  CareerStatistics,
  CounselorResponse,
  MissingSkillItem,
  Feedback,
  FeedbackListResponse,
  MyStudent,
  CreateFeedback,
  PaginatedStudentResponse
} from "../types"

export type {
  UpdateCounselorProfilePayload,
  CareerStatistics,
  CounselorResponse,
  MissingSkillItem,
  Feedback,
  FeedbackListResponse,
  MyStudent,
  CreateFeedback,
  PaginatedStudentResponse
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
  getMyStudent: async (
    page: number = 0,
    size: number = 7,
    search?: string,
    signal?: AbortSignal
  ): Promise<PaginatedStudentResponse> => {
    const searchParam = search && search.trim() ? encodeURIComponent(search.trim()) : ""
    const url = `${ENDPOINTS.COUNSELOR_DASHBOARD.GET_STUDENT_LIST}/page=${page}/size=${size}/search=${searchParam}`
    
    try {
      const res = await mainClient.get(url, { signal })
      const data = res.data?.data || res.data
      
      return {
        totalPages: data?.totalPages ?? 1,
        currentPage: data?.currentPage ?? 0,
        students: data?.students ?? data?.content ?? []
      }
    } catch {
      return { totalPages: 1, currentPage: 0, students: [] }
    }
  },
  // New Add
  getStudentInfo: async (studentId: string, signal?: AbortSignal): Promise<any> => {
    const res = await mainClient.get(
      ENDPOINTS.COUNSELOR_DASHBOARD.GET_STUDENT_INFO(studentId),
      { signal }
    )
    return res.data?.data || res.data
  },
  getHistoryFeedback: async (
    studentId: string
  ): Promise<FeedbackListResponse> => {
    const res = await mainClient.get(
      ENDPOINTS.COUNSELOR_DASHBOARD.GET_STUDENT_INFO(studentId)
    )
    return res.data
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

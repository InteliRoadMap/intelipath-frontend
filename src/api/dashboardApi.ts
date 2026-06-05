import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"
import type { RoadmapProgress } from "@/features/student-dashboard/types"

/**
 * Dashboard API Service
 * Mocked to return exactly the data shown in the screenshot.
 */
const unwrapResponse = <T>(responseData: unknown): T => {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    return (responseData as { data: T }).data
  }

  return responseData as T
}

const normalizeRoadmapProgress = (data: unknown): RoadmapProgress => {
  const roadmap = unwrapResponse<RoadmapProgress>(data)
  return {
    ...roadmap,
    steps: Array.isArray(roadmap?.steps)
      ? roadmap.steps.map((step) => ({
          ...step,
          status: String(step.status).toLowerCase() as RoadmapProgress["steps"][number]["status"]
        }))
      : []
  }
}

const dashboardApi = {
  getRoadmapProgress: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.ROADMAP_PROGRESS)
    return normalizeRoadmapProgress(response.data)
  },
  
  getSkillGaps: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.SKILL_GAPS)
    return unwrapResponse(response.data)
  },

  getMentorFeedback: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MENTOR_FEEDBACK)
    return unwrapResponse(response.data)
  },

  getRecommendations: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.RECOMMENDATIONS)
    return unwrapResponse(response.data)
  },

  getMarketDemand: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MARKET_DEMAND)
    return unwrapResponse(response.data)
  },
  
  getAiHistory: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.AI_HISTORY)
    return unwrapResponse(response.data)
  }
}

export default dashboardApi

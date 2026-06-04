import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Dashboard API Service
 * Mocked to return exactly the data shown in the screenshot.
 */
const dashboardApi = {
  getRoadmapProgress: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.ROADMAP_PROGRESS)
    return response.data
  },
  
  getSkillGaps: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.SKILL_GAPS)
    return response.data
  },

  getMentorFeedback: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MENTOR_FEEDBACK)
    return response.data
  },

  getRecommendations: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.RECOMMENDATIONS)
    return response.data
  },

  getMarketDemand: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MARKET_DEMAND)
    return response.data
  },
  
  getAiHistory: async () => {
    const response = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.AI_HISTORY)
    return response.data
  }
}

export default dashboardApi

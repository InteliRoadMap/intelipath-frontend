import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Dashboard API Service
 * Mocked to return exactly the data shown in the screenshot.
 */
const dashboardApi = {
  getRoadmapProgress: async () => {
    return await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.ROADMAP_PROGRESS)
  },
  
  getSkillGaps: async () => {
    return await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.SKILL_GAPS)
  },

  getMentorFeedback: async () => {
    return await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MENTOR_FEEDBACK)
  },

  getSkillComparison: async () => {
    return await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.SKILL_COMPARISON)
  },

  getRecommendations: async () => {
    return await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.RECOMMENDATIONS)
  },

  getMarketDemand: async () => {
    return await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MARKET_DEMAND)
  },
  
  getAiHistory: async () => {
    return await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.AI_HISTORY)
  }
}

export default dashboardApi

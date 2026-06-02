import { publicClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Dashboard API Service
 * Mocked to return exactly the data shown in the screenshot.
 */
const dashboardApi = {
  getRoadmapProgress: async () => {
    return await publicClient.get('/api/v1/student/dashboard/roadmap-progress')
  },
  
  getSkillGaps: async () => {
    return await publicClient.get('/api/v1/student/dashboard/skill-gaps')
  },

  getMentorFeedback: async () => {
    return await publicClient.get('/api/v1/student/dashboard/mentor-feedback')
  },

  getSkillComparison: async () => {
    return await publicClient.get('/api/v1/student/dashboard/skill-comparison')
  },

  getRecommendations: async () => {
    return await publicClient.get('/api/v1/student/dashboard/recommendations')
  },

  getMarketDemand: async () => {
    return await publicClient.get('/api/v1/student/dashboard/market-demand')
  },
  
  getAiHistory: async () => {
    return await publicClient.get('/api/v1/student/dashboard/ai-history')
  }
}

export default dashboardApi

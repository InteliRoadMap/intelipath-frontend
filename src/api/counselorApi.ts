import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Counselor API Service
 * Fetches dashboard metrics for the Counselor role.
 */
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
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.METRICS_ENGAGEMENT)
  },

  getLearningActivity: async () => {
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.LEARNING_ACTIVITY)
  },

  getSkillDistribution: async () => {
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.SKILL_DISTRIBUTION)
  },
  
  getRecentActivity: async () => {
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.RECENT_ACTIVITY)
  },
  
  getTopStudents: async () => {
    return await mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.TOP_STUDENTS)
  }
}

export default counselorApi

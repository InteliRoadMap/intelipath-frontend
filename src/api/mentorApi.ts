import { publicClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Mentor API Service
 * Fetches dashboard metrics for the Mentor role.
 */
const mentorApi = {
  getWelcomeAlert: async () => {
    return await publicClient.get(ENDPOINTS.MENTOR_DASHBOARD.WELCOME_ALERT)
  },
  
  getRatingMetric: async () => {
    return await publicClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_RATING)
  },

  getResponseTimeMetric: async () => {
    return await publicClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_RESPONSE_TIME)
  },

  getMenteesMetric: async () => {
    return await publicClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_MENTEES)
  },

  getPendingReviews: async () => {
    return await publicClient.get(ENDPOINTS.MENTOR_DASHBOARD.PENDING_REVIEWS)
  },

  getInsight: async () => {
    return await publicClient.get(ENDPOINTS.MENTOR_DASHBOARD.INSIGHT)
  }
}

export default mentorApi

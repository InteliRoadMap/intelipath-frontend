import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Mentor API Service
 * Fetches dashboard metrics for the Mentor role.
 */
const mentorApi = {
  getWelcomeAlert: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.WELCOME_ALERT)
  },
  
  getRatingMetric: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_RATING)
  },

  getResponseTimeMetric: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_RESPONSE_TIME)
  },

  getMenteesMetric: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_MENTEES)
  },

  getPendingReviews: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.PENDING_REVIEWS)
  },

  getInsight: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.INSIGHT)
  }
}

export default mentorApi

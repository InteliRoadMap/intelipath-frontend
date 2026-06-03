import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Admin API Service
 * Each widget/section on the admin dashboard fetches its own data independently.
 */
const adminApi = {
  getTotalUsers: async () => {
    return await mainClient.get(ENDPOINTS.ADMIN_DASHBOARD.METRICS_USERS)
  },
  
  getTotalCourses: async () => {
    return await mainClient.get(ENDPOINTS.ADMIN_DASHBOARD.METRICS_COURSES)
  },

  getSystemHealth: async () => {
    return await mainClient.get(ENDPOINTS.ADMIN_DASHBOARD.METRICS_HEALTH)
  },

  getUsersList: async () => {
    return await mainClient.get(ENDPOINTS.ADMIN_DASHBOARD.USERS)
  }
}

export default adminApi;

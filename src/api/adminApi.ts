import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Admin API Service
 * Each widget/section on the admin dashboard fetches its own data independently.
 */
const adminApi = {
  getTotalUsers: async () => {
    const response = await mainClient.get(ENDPOINTS.ADMIN_DASHBOARD.METRICS_USERS)
    return response.data
  },
  
  getTotalCourses: async () => {
    const response = await mainClient.get(ENDPOINTS.ADMIN_DASHBOARD.METRICS_COURSES)
    return response.data
  },

  getSystemHealth: async () => {
    const response = await mainClient.get(ENDPOINTS.ADMIN_DASHBOARD.METRICS_HEALTH)
    return response.data
  },

  getUsersList: async () => {
    const response = await mainClient.get(ENDPOINTS.ADMIN_DASHBOARD.USERS)
    return response.data
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await mainClient.patch(ENDPOINTS.ADMIN_DASHBOARD.USER_ROLE(userId), { role })
    return response.data
  },

  deleteUser: async (userId: string) => {
    await mainClient.delete(ENDPOINTS.ADMIN_DASHBOARD.USER(userId))
  }
}

export default adminApi;

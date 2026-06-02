import { publicClient } from "./apiClients"

/**
 * Admin API Service
 * Each widget/section on the admin dashboard fetches its own data independently.
 */
const adminApi = {
  getTotalUsers: async () => {
    return await publicClient.get('/api/v1/admin/dashboard/metrics/users')
  },
  
  getTotalCourses: async () => {
    return await publicClient.get('/api/v1/admin/dashboard/metrics/courses')
  },

  getSystemHealth: async () => {
    return await publicClient.get('/api/v1/admin/dashboard/metrics/health')
  },

  getUsersList: async () => {
    return await publicClient.get('/api/v1/admin/dashboard/users')
  }
}

export default adminApi;

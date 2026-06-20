import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"
import type {
  AdminCourseMetric,
  AdminRole,
  AdminSystemHealth,
  AdminUserListItem,
  AdminUserMetric
} from "@/features/admin/admin.types"

/**
 * Admin API Service
 * Each widget/section on the admin dashboard fetches its own data independently.
 */
const adminApi = {
  getTotalUsers: async () => {
    const response = await mainClient.get<AdminUserMetric>(ENDPOINTS.ADMIN_DASHBOARD.METRICS_USERS)
    return response.data
  },
  
  getTotalCourses: async () => {
    const response = await mainClient.get<AdminCourseMetric>(ENDPOINTS.ADMIN_DASHBOARD.METRICS_COURSES)
    return response.data
  },

  getSystemHealth: async () => {
    const response = await mainClient.get<AdminSystemHealth>(ENDPOINTS.ADMIN_DASHBOARD.METRICS_HEALTH)
    return response.data
  },

  getUsersList: async () => {
    const response = await mainClient.get<AdminUserListItem[]>(ENDPOINTS.ADMIN_DASHBOARD.USERS)
    return response.data
  },

  updateUserRole: async (userId: string, role: AdminRole) => {
    const response = await mainClient.patch<AdminUserListItem>(ENDPOINTS.ADMIN_DASHBOARD.USER_ROLE(userId), { role })
    return response.data
  },

  deleteUser: async (userId: string) => {
    await mainClient.delete(ENDPOINTS.ADMIN_DASHBOARD.USER(userId))
  },

  triggerSkillExtraction: async () => {
    const response = await mainClient.post(ENDPOINTS.ADMIN_DASHBOARD.TRIGGER_SKILL_EXTRACTION)
    return response.data
  }
}

export default adminApi;

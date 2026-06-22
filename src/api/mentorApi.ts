import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"
import { mapToFrontendData } from "./portfolioApi"

/**
 * Mentor Dashboard API Functions
 */

const mentorApi = {
  getWelcomeAlert: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.WELCOME_ALERT)
  },
  
  getMetrics: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS);
      return res.data?.data || res.data;
    } catch { return null; }
  },

  getPendingReviews: async (page = 0, size = 10) => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.PENDING_REVIEWS, { params: { page, size } });
      const data = res.data?.data || res.data;
      if (data && Array.isArray(data.content)) return data.content;
      if (Array.isArray(data)) return data;
      return [];
    } catch { return []; }
  },

  getInsight: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.INSIGHT);
      return res.data?.data || res.data;
    } catch { return null; }
  },

  getCareerDistribution: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.CAREER_DISTRIBUTION);
      const data = res.data?.data || res.data;
      if (data && Array.isArray(data.content)) return data.content;
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },

  getStudentsList: async (page = 0, size = 10) => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.STUDENT_LIST, { params: { page, size } });
      const data = res.data?.data || res.data;
      if (data && Array.isArray(data.content)) return data.content;
      if (Array.isArray(data)) return data;
      return [];
    } catch { return []; }
  },

  getStudentPortfolio: async (studentId: string) => {
    try {
      // FE routes to the public portfolio API as suggested by BE
      const res = await mainClient.get(`/public-portfolio/${studentId}`);
      const rawData = res.data?.data || res.data;
      return mapToFrontendData(rawData);
    } catch {
      return null;
    }
  },

  getFeedbackHistory: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.FEEDBACK_HISTORY);
      const data = res.data?.data || res.data;
      if (data && Array.isArray(data.content)) return data.content;
      if (Array.isArray(data)) return data;
      return [];
    } catch { return []; }
  },

  submitFeedback: async (receiverId: string, payload: { type: string, content: string }) => {
    try {
      const res = await mainClient.post(ENDPOINTS.MENTOR_DASHBOARD.SUBMIT_FEEDBACK, { receiverId, ...payload });
      return res.data?.data || res.data || { success: true, message: "Feedback submitted successfully." };
    } catch { return { success: false, message: "Failed to submit feedback." }; }
  },

  getProgressReports: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.PROGRESS_REPORTS);
      return res.data?.data || res.data;
    } catch {
      return {
        metrics: [],
        studentsProgress: [],
        needsAttention: [],
        skillGaps: []
      };
    }
  }
}

export default mentorApi

import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

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
      return res.data?.data || res.data || [];
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
      return res.data?.data || res.data || [];
    } catch {
      return [];
    }
  },

  getStudentsList: async (page = 0, size = 10) => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.STUDENT_LIST, { params: { page, size } });
      return res.data?.data || res.data || [];
    } catch { return []; }
  },

  getStudentPortfolio: async (studentId: string) => {
    try {
      // FE routes to the public portfolio API as suggested by BE
      const res = await mainClient.get(`/public-portfolio/${studentId}`);
      return res.data?.data || res.data;
    } catch {
      return null;
    }
  },

  getFeedbackHistory: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.FEEDBACK_HISTORY);
      return res.data?.data || res.data || [];
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

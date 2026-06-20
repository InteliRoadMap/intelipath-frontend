import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

/**
 * Mentor Dashboard API Functions
 */

const mentorApi = {
  getWelcomeAlert: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.WELCOME_ALERT)
  },
  
  getRatingMetric: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_RATING);
      return res.data?.data || res.data;
    } catch { return null; }
  },
  getResponseTimeMetric: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_RESPONSE_TIME);
      return res.data?.data || res.data;
    } catch { return null; }
  },
  getTotalStudentsMetric: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_MENTEES);
      return res.data?.data || res.data;
    } catch { return null; }
  },
  getPendingReviewsCountMetric: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_PENDING_REVIEWS);
      return res.data?.data || res.data;
    } catch { return null; }
  },
  getFeedbackSubmittedMetric: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.METRICS_FEEDBACK);
      return res.data?.data || res.data;
    } catch { return null; }
  },

  getPendingReviews: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.PENDING_REVIEWS);
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

  getStudentsList: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.STUDENT_LIST);
      return res.data?.data || res.data || [];
    } catch { return []; }
  },

  getStudentPortfolio: async (studentId: string) => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.STUDENT_PORTFOLIO(studentId));
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

  submitFeedback: async (studentId: string, payload: { type: string, content: string }) => {
    try {
      const res = await mainClient.post(ENDPOINTS.MENTOR_DASHBOARD.SUBMIT_FEEDBACK, { studentId, ...payload });
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

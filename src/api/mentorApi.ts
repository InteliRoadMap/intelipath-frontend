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
    return new Promise(() => {}); // Infinite loading
  },

  getResponseTimeMetric: async () => {
    return new Promise(() => {}); // Infinite loading
  },

  getTotalStudentsMetric: async () => {
    return new Promise(() => {}); // Infinite loading
  },

  getPendingReviewsCountMetric: async () => {
    return new Promise(() => {}); // Infinite loading
  },

  getFeedbackSubmittedMetric: async () => {
    return new Promise(() => {}); // Infinite loading
  },

  getPendingReviews: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.PENDING_REVIEWS)
  },

  getInsight: async () => {
    return await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.INSIGHT)
  },

  getCareerDistribution: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.CAREER_DISTRIBUTION)
      return res.data
    } catch {
      return []
    }
  },

  getStudentsList: async () => {
    // Return empty array to show no data
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 500);
    });
  },

  getStudentPortfolio: async (studentId: string) => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.STUDENT_PORTFOLIO(studentId))
      return res.data
    } catch {
      // Return empty state or basic object to show empty UI
      return {
        id: studentId,
        fullName: "",
        email: "",
        university: "",
        major: "",
        career: "",
        github_profile: "",
        bio: "",
        skills: [],
        projects: []
      }
    }
  },

  getFeedbackHistory: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 500);
    });
  },

  submitFeedback: async (studentId: string, payload: { type: string, content: string }) => {
    // Just simulate network latency for mock
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: "Feedback submitted successfully." };
  }
}

export default mentorApi

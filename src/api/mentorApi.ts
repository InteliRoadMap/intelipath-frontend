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
    return new Promise((resolve) => setTimeout(() => resolve({ score: 4.8, increase: 0.2 }), 500));
  },
  getResponseTimeMetric: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ hours: 2, increase: -0.5 }), 500));
  },
  getTotalStudentsMetric: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ count: 15, increase: 3 }), 500));
  },
  getPendingReviewsCountMetric: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ count: 4, increase: -1 }), 500));
  },
  getFeedbackSubmittedMetric: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ count: 120, increase: 15 }), 500));
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

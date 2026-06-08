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

  // --- NEW FEATURES (With Mock Data Fallbacks) ---
  getCareerDistribution: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.CAREER_DISTRIBUTION)
      return res.data
    } catch {
      // Empty fallback until backend is ready
      return []
    }
  },

  getStudentsList: async () => {
    return new Promise(() => {}); // Infinite loading
  },

  getStudentPortfolio: async (studentId: string) => {
    try {
      const res = await mainClient.get(ENDPOINTS.MENTOR_DASHBOARD.STUDENT_PORTFOLIO(studentId))
      return res.data
    } catch {
      // Mock Fallback matching exact DB Schema
      return {
        id: studentId,
        fullName: "Nguyễn Văn A",
        email: "nva@fpt.edu.vn",
        university: "FPT University",
        major: "Software Engineering",
        career: "Frontend Developer",
        github_profile: "https://github.com/nva123",
        bio: "Passionate about creating beautiful and functional user interfaces. Always eager to learn new technologies.",
        skills: ["React", "TypeScript", "Tailwind CSS", "Figma", "Node.js"],
        projects: [
          { 
            repo_url: "https://github.com/nva123/ecommerce-frontend", 
            description: "Built a fully functional e-commerce platform using React and Redux with advanced state management.", 
            tech_stack: ["React", "Redux", "Tailwind", "Vite"],
            stars: 12
          },
          { 
            repo_url: "https://github.com/nva123/task-manager-dashboard", 
            description: "A drag-and-drop kanban board built with Tailwind and modern CSS for tracking tasks.", 
            tech_stack: ["TypeScript", "TailwindCSS", "Zustand"],
            stars: 5
          }
        ]
      }
    }
  },

  getFeedbackHistory: async () => {
    return new Promise(() => {}); // Infinite loading
  },

  submitFeedback: async (studentId: string, payload: { type: string, content: string }) => {
    try {
      // We will pretend to POST to backend
      // return await mainClient.post(ENDPOINTS.MENTOR_DASHBOARD.SUBMIT_FEEDBACK(studentId), payload)
      
      // Simulate network latency for mock
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, message: "Feedback submitted successfully." };
    } catch {
      throw new Error("Failed to submit feedback.");
    }
  }
}

export default mentorApi

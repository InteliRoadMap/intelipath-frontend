import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const studentApi = {
  getFeedback: async () => {
    try {
      const res = await mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MENTOR_FEEDBACK);
      const data = res.data?.data || res.data;
      let results = [];
      if (data && Array.isArray(data)) {
        results = data.map((fb: any) => ({
          id: fb.feedbackId || fb.id || Math.random().toString(),
          mentorName: fb.senderName || 'Reviewer',
          mentorRole: 'Professional Reviewer',
          type: fb.type || 'GENERAL',
          submittedAt: fb.createAt || Date.now(),
          content: fb.content || ''
        }));
      }

      // Prepend local mock if exists
      const localNotif = localStorage.getItem('student_notification');
      if (localNotif) {
        try {
          const parsed = JSON.parse(localNotif);
          results.unshift({
            id: 'local-mock-1',
            mentorName: parsed.senderName || 'Mentor',
            mentorRole: 'Industry Expert',
            type: parsed.type || 'SKILL',
            submittedAt: Date.now(),
            content: parsed.content || 'Your portfolio has received a new review!'
          });
        } catch(e) {}
      }

      return results;
    } catch {
      return [];
    }
  },

  replyFeedback: async (feedbackId: string, content: string) => {
    // In reality: await mainClient.post(ENDPOINTS.STUDENT.REPLY_FEEDBACK(feedbackId), { content })
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  requestPortfolioReview: async (mentorEmail: string) => {
    // We send the email to the backend, backend maps to mentor_id and creates portfolio_review_requests
    try {
      const res = await mainClient.post(ENDPOINTS.STUDENT.PORTFOLIO_REQUEST_REVIEW, { email: mentorEmail });
      return res.data;
    } catch (e) {
      throw e;
    }
  }
}

export default studentApi;

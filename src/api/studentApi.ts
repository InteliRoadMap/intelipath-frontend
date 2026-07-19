import type { AxiosRequestConfig } from "axios"
import { ENDPOINTS, mainClient, type RequestConfig } from "@/shared/api"

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
    // COMMENTED OUT ORIGINAL FOR TEAM CONTRIBUTION PRESERVATION:
    // // In reality: await mainClient.post(ENDPOINTS.STUDENT.REPLY_FEEDBACK(feedbackId), { content })
    // return new Promise((resolve) => {
    //   setTimeout(() => resolve({ success: true }), 500);
    // });

    // NEW LOGIC: Instant resolve for mock
    return { success: true };
  },

  requestPortfolioReview: async (mentorEmail: string) => {
    // We send the email to the backend, backend maps to mentor_id and creates portfolio_review_requests.
    // skipErrorToast: RequestReviewModal already renders its own inline error banner —
    // without this the global interceptor's toast duplicates the same message.
    const res = await mainClient.post(
      ENDPOINTS.STUDENT.PORTFOLIO_REQUEST_REVIEW,
      { email: mentorEmail },
      { skipErrorToast: true } as AxiosRequestConfig & RequestConfig
    );
    return res.data;
  }
}

export default studentApi;

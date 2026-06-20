import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const studentApi = {
  getFeedback: async () => {
    // In reality, this would be: await mainClient.get(ENDPOINTS.STUDENT.FEEDBACK)
    // For now, return empty array as requested
    return new Promise<any[]>((resolve) => {
      setTimeout(() => resolve([]), 500);
    });
  },

  replyFeedback: async (feedbackId: string, content: string) => {
    // In reality: await mainClient.post(ENDPOINTS.STUDENT.REPLY_FEEDBACK(feedbackId), { content })
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  }
}

export default studentApi;

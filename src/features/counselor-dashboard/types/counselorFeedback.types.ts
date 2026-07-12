export interface Feedback {
  feedbackId: string
  senderId: string
  receiverId: string
  senderName: string
  content: string
  type: "GENERAL" | "SKILL" | "CAREER"
  createAt: string
  updateAt: string
}

export interface FeedbackListResponse {
  feedbacks: Feedback[]
}

export interface CreateFeedback {
  receiverId: string
  content: string
  type: "GENERAL" | "SKILL" | "CAREER"
}

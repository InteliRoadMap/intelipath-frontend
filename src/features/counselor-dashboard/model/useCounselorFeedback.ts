import { useEffect, useState, useCallback } from "react"
import counselorApi, { type MyStudent, type Feedback } from "@/features/counselor-dashboard/api/counselorApi"

// ─── useStudentList ───────────────────────────────────────────────────────────
export interface UseStudentListResult {
  students: MyStudent[]
  loading: boolean
  refetch: () => void
}

export function useStudentList(): UseStudentListResult {
  const [students, setStudents] = useState<MyStudent[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(() => {
    setLoading(true)
    counselorApi
      .getMyStudent()
      .then((r) => {
        setStudents(Array.isArray(r) ? r : [])
      })
      .catch((error) => {
        console.error("Failed to fetch students:", error)
        setStudents([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { students, loading, refetch }
}

// ─── useFeedbackHistory ───────────────────────────────────────────────────────
export interface UseFeedbackHistoryResult {
  feedbacks: Feedback[]
  loading: boolean
  refetch: () => void
}

export function useFeedbackHistory(studentId: string): UseFeedbackHistoryResult {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(() => {
    setLoading(true)
    counselorApi
      .getHistoryFeedback(studentId)
      .then((r) => setFeedbacks(r?.feedbacks ?? []))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false))
  }, [studentId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { feedbacks, loading, refetch }
}

// ─── useSendFeedback ──────────────────────────────────────────────────────────
export interface SendFeedbackPayload {
  receiverId: string
  content: string
  type: "GENERAL" | "SKILL" | "CAREER"
}

export interface UseSendFeedbackResult {
  send: (payload: SendFeedbackPayload) => Promise<void>
  sending: boolean
  sent: boolean
  resetSent: () => void
}

export function useSendFeedback(onSuccess?: () => void): UseSendFeedbackResult {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const send = useCallback(
    async (payload: SendFeedbackPayload) => {
      if (!payload.content.trim()) return
      setSending(true)
      try {
        await counselorApi.createFeedback(payload)
        setSent(true)
        setTimeout(() => setSent(false), 3000)
        onSuccess?.()
      } catch {
        // silently fail — API may not be ready
      } finally {
        setSending(false)
      }
    },
    [onSuccess]
  )

  const resetSent = useCallback(() => setSent(false), [])

  return { send, sending, sent, resetSent }
}

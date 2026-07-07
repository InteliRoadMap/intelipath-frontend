import { useEffect, useState, useCallback } from "react"

import counselorApi, {
  type MyStudent,
  type Feedback
} from "@/features/counselor-dashboard/api/counselorApi"

// ─── useStudentList ───────────────────────────────────────────────────────────
export interface UseStudentListResult {
  students: MyStudent[]
  loading: boolean
  page: number
  setPage: (page: number) => void
  search: string
  setSearch: (search: string) => void
  totalPages: number
  size: number
  setSize: (size: number) => void
  refetch: (signal?: AbortSignal) => void
}

export function useStudentList(): UseStudentListResult {
  const [students, setStudents] = useState<MyStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0) // 0-indexed for backend
  const [search, setSearch] = useState("")
  const [size, setSize] = useState(7)
  const [totalPages, setTotalPages] = useState(1)

  const refetch = useCallback(
    (signal?: AbortSignal) => {
      setLoading(true)
      counselorApi
        .getMyStudent(page, size, search, signal)
        .then((r) => {
          setStudents(r.students)
          setTotalPages(r.totalPages)
        })
        .catch((error) => {
          if (error?.name === "CanceledError" || error?.message === "canceled")
            return // Axios aborted
          console.error("Failed to fetch students:", error)
          setStudents([])
          setTotalPages(1)
        })
        .finally(() => setLoading(false))
    },
    [page, search, size]
  )

  useEffect(() => {
    const controller = new AbortController()
    refetch(controller.signal)
    return () => {
      controller.abort()
    }
  }, [refetch])

  return {
    students,
    loading,
    page,
    setPage,
    search,
    setSearch,
    totalPages,
    size,
    setSize,
    refetch
  }
}

// ─── useFeedbackHistory ───────────────────────────────────────────────────────
export interface UseFeedbackHistoryResult {
  feedbacks: Feedback[]
  loading: boolean
  refetch: () => void
}

export function useFeedbackHistory(
  studentId: string
): UseFeedbackHistoryResult {
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
  attachments?: File[]
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

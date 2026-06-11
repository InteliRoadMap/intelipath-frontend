import { useEffect, useState, useCallback } from "react"
import counselorApi, {
  type CareerStatistics,
  type MissingSkillItem,
  type Feedback
} from "@/api/counselorApi"

// ─── useCareerDistribution ────────────────────────────────────────────────────
export interface UseCareerDistributionResult {
  data: CareerStatistics[]
  loading: boolean
  error: boolean
  total: number
}

export function useCareerDistribution(
  onTotalLoaded?: (total: number) => void
): UseCareerDistributionResult {
  const [data, setData] = useState<CareerStatistics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    counselorApi
      .getCareerDistribution()
      .then((payload: any) => {
        let formatted: CareerStatistics[] = []
        if (payload?.careerStatistics) {
          formatted = Object.entries(
            payload.careerStatistics as Record<string, number>
          )
            .map(([name, count]) => ({
              careerName: name,
              studentCount: Number(count)
            }))
            .sort((a, b) => b.studentCount - a.studentCount)
        } else if (Array.isArray(payload)) {
          formatted = [...payload].sort(
            (a, b) => b.studentCount - a.studentCount
          )
        } else if (payload && typeof payload === "object") {
          formatted = Object.entries(payload as Record<string, number>)
            .map(([name, count]) => ({
              careerName: name,
              studentCount: Number(count)
            }))
            .sort((a, b) => b.studentCount - a.studentCount)
        }
        setData(formatted)
        const total = formatted.reduce((s, c) => s + c.studentCount, 0)
        onTotalLoaded?.(total)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const total = data.reduce((s, c) => s + c.studentCount, 0)

  return { data, loading, error, total }
}

// ─── useMissingSkills ─────────────────────────────────────────────────────────
export interface UseMissingSkillsResult {
  data: MissingSkillItem[]
  totalStudents: number
  loading: boolean
  error: string | null
  searchInput: string
  setSearchInput: (v: string) => void
  activeSearch: string
  resolvedCareerName: string | null
  handleSearch: (e: React.FormEvent) => void
}

export function useMissingSkills(
  careerFilter?: string,
  onTotalLoaded?: (total: number) => void
): UseMissingSkillsResult {
  const [data, setData] = useState<MissingSkillItem[]>([])
  const [totalStudents, setTotalStudents] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(careerFilter || "")
  const [activeSearch, setActiveSearch] = useState(careerFilter || "")
  const [resolvedCareerName, setResolvedCareerName] = useState<string | null>(null)

  useEffect(() => {
    setSearchInput(careerFilter || "")
    setActiveSearch(careerFilter || "")
  }, [careerFilter])

  useEffect(() => {
    if (!activeSearch) {
      setData([])
      setTotalStudents(0)
      setResolvedCareerName(null)
      return
    }

    setLoading(true)
    setError(null)

    counselorApi
      .getSkillMissing(activeSearch)
      .then((res: any) => {
        setTotalStudents(res.total ?? 0)
        const items: MissingSkillItem[] = Object.entries(
          res.missingSkills ?? {}
        )
          .map(([skillName, count]) => ({ skillName, count: Number(count) }))
          .sort((a, b) => b.count - a.count)
        setData(items)
        setResolvedCareerName(res.careerName || activeSearch)
        onTotalLoaded?.(items.length)
      })
      .catch((err: any) => {
        const msg = err?.response?.data?.message || "Cannot load missing skill data."
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [activeSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSearch(searchInput.trim())
  }

  return {
    data,
    totalStudents,
    loading,
    error,
    searchInput,
    setSearchInput,
    activeSearch,
    resolvedCareerName,
    handleSearch
  }
}

// ─── useFeedbackList ──────────────────────────────────────────────────────────
export interface UseFeedbackListResult {
  feedbacks: Feedback[]
  loading: boolean
  error: boolean
}

export function useFeedbackList(
  onTotalLoaded?: (total: number) => void
): UseFeedbackListResult {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    counselorApi
      .getFeedback()
      .then((res) => {
        const list = res.feedbacks ?? []
        setFeedbacks(list)
        onTotalLoaded?.(list.length)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { feedbacks, loading, error }
}

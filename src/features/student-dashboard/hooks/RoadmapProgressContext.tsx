import { createContext, useContext, type ReactNode } from "react"
import type { DashboardLoadStatus, RoadmapProgress } from "../types"
import { studentDashboardService } from "../services"
import { useDashboardData } from "./useDashboardData"

type RoadmapProgressValue = {
  data: RoadmapProgress | null
  status: DashboardLoadStatus
}

const RoadmapProgressContext = createContext<RoadmapProgressValue | null>(null)

/**
 * Fetches the roadmap progress once and shares it with every widget below,
 * so the dashboard's milestone banner, quick stats and action list don't each
 * fire the same (heavy) query.
 */
export const RoadmapProgressProvider = ({ children }: { children: ReactNode }) => {
  const value = useDashboardData<RoadmapProgress>(
    () => studentDashboardService.getRoadmapProgress()
  )
  return (
    <RoadmapProgressContext.Provider value={value}>
      {children}
    </RoadmapProgressContext.Provider>
  )
}

export const useRoadmapProgress = (): RoadmapProgressValue => {
  const ctx = useContext(RoadmapProgressContext)
  if (!ctx) {
    throw new Error("useRoadmapProgress must be used within a RoadmapProgressProvider")
  }
  return ctx
}

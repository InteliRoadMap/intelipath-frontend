export type RoadmapStep = {
  id: string
  status: "completed" | "current" | "locked"
  title: string
}

export type RoadmapProgress = {
  steps: RoadmapStep[]
  aiTip?: string
}

export type SkillGap = {
  id: string
  type: "critical" | "market"
  severity: string
  title: string
  description: string
}

export type MentorFeedback = {
  id: string
  name: string
  time: string
  text: string
}

export type AiHistoryItem = {
  id: string
  tag: string
  title: string
  preview: string
}

export type Recommendation = {
  id: string
  icon: "Network" | string
  type: string
  title: string
  description: string
}

export type MarketDemand = {
  growth: number
  role: string
  chart: number[]
}

export type DashboardLoadStatus = "loading" | "success" | "error"

export type StudentSetupStep = "profile" | "skills" | null

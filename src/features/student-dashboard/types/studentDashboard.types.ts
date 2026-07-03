export type RoadmapStep = {
  id: string
  // Original: status: "completed" | "current" | "locked"
  status: "completed" | "current" | "locked" | "in_progress"
  title: string
}

// Original: export type RoadmapNodeStatus = "completed" | "current" | "locked"
export type RoadmapNodeStatus = "completed" | "current" | "locked" | "in_progress"

export type RoadmapResource = {
  title: string
  url: string
  type?: string
}

export type RoadmapNode = {
  id: string
  title: string
  status: RoadmapNodeStatus
  description?: string
  level?: number
  resources: RoadmapResource[]
  children: RoadmapNode[]
}

export type RoadmapProgress = {
  steps: RoadmapStep[]
  aiTip?: string
}

export type StudentRoadmap = {
  targetCareerRole?: string
  progress?: number
  nodes: RoadmapNode[]
}

export type CareerRole = {
  careerId: string
  careerName: string
  prerequisite?: string
  description?: string
}

export type SkillItem = {
  skillId: string
  skillName: string
  category: string
  career: string
}

export type RequiredSkill = {
  skill: SkillItem
  importanceLevel: string
  progress?: number
}

export type SkillResponse = {
  selectedSkills: SkillItem[]
  skills: SkillItem[]
  requiredSkills: RequiredSkill[]
  missingSkills: SkillItem[]
}

export type SkillGap = {
  id: string
  type: "critical" | "market"
  severity: string
  title: string
  description: string
  progress?: number
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

// ─── Roadmap Personalization (AI recommendations) ──────────────
export type RoadmapRecommendationAction =
  | "MARK_COMPLETE" | "SKIP" | "UNLOCK" | "PRIORITIZE" | "ADD" | "REMOVE"

export type RoadmapRecommendationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED"

export type RoadmapRecommendationItem = {
  recItemId: string
  nodeId: string
  nodeName: string | null
  action: RoadmapRecommendationAction
  reason: string | null
  confidence: number | null
  evidenceIds: string[] | null
}

export type RoadmapRecommendation = {
  recommendationId: string
  type: string
  title: string | null
  summary: string | null
  reason: string | null
  confidence: number | null
  status: RoadmapRecommendationStatus
  createdAt: string
  decidedAt: string | null
  items: RoadmapRecommendationItem[]
}

export type RoadmapRecommendationDecision = {
  recommendationId: string
  status: RoadmapRecommendationStatus
  decidedAt: string | null
  roadmapProgress: number | null
}

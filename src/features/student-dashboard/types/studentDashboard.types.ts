export type RoadmapStep = {
  id: string
  status: "completed" | "current" | "locked"
  title: string
}

export type RoadmapNodeStatus = "completed" | "current" | "locked"

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

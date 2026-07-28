import { isAxiosError } from "axios"
import { careerApi, dashboardApi, profileApi, roadmapApi, skillApi } from "@/api"
import { isUuid } from "@/lib/utils"
import type {
  AiHistoryItem,
  CareerRole,
  MarketDemand,
  MentorFeedback,
  NodeSelection,
  Recommendation,
  RoadmapProgress,
  SkillGap,
  SkillItem,
  SkillResponse,
  StudentRoadmap
} from "../types"
import {
  buildRoadmapGraph,
  normalizeCareerRole,
  normalizeRoadmapProgress,
  normalizeSkillResponse,
  normalizeStudentRoadmap,
  unwrapResponse,
  type RawCareerRole
} from "./studentDashboardNormalizers"

export const getSkillErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return "Cannot connect to server."

  const backendMessage = typeof error.response?.data === "object" && error.response?.data
    ? (error.response.data as { message?: string }).message
    : undefined

  switch (error.response?.status) {
    case 400:
      return backendMessage || "Select at least one valid skill."
    case 401:
    case 403:
      return backendMessage || "Your session or role is not authorized to select skills."
    case 404:
      return backendMessage || "One or more selected skills no longer exist."
    default:
      return backendMessage || "Unable to update selected skills."
  }
}

export const studentDashboardService = {
  getStudentProfile: async () => {
    const response = await profileApi.getStudentProfile()
    return unwrapResponse(response.data)
  },

  updateUserProfile: (payload: Parameters<typeof profileApi.updateUserProfile>[0]) =>
    profileApi.updateUserProfile(payload),

  updateStudentProfile: (payload: any) => {
    if (payload.careerId && typeof payload.careerId !== "string") {
      throw new Error("Career ID must be a valid string ID.")
    }

    return profileApi.updateStudentProfile({
      universityName: payload.universityName || payload.university || null,
      admissionDate: payload.admissionDate || null,
      major: payload.major || null,
      careerId: payload.careerId || null,
      bio: payload.bio || null,
      yob: payload.yob || null
    })
  },

  getCareerRoles: async (): Promise<CareerRole[]> => {
    const response = await careerApi.getCareerRoles()
    const careers = unwrapResponse<RawCareerRole[]>(response.data)

    return Array.isArray(careers)
      ? careers
          .map(normalizeCareerRole)
          .filter((career): career is CareerRole => Boolean(career))
      : []
  },

  updateTargetCareer: async (careerId: string) => {
    if (!careerId) throw new Error("Career ID must be a valid string ID.")

    const response = await careerApi.updateTargetCareer(careerId)
    return unwrapResponse(response.data)
  },

  getSkills: async (): Promise<SkillResponse> => {
    const response = await skillApi.getSkills()
    return normalizeSkillResponse(response.data)
  },

  getSelectedSkills: async (): Promise<SkillItem[]> => {
    return (await studentDashboardService.getSkills()).selectedSkills
  },

  searchSkills: async (search: string): Promise<SkillItem[]> => {
    const response = await skillApi.searchSkills(search)
    return normalizeSkillResponse(response.data).skills
  },

  selectSkills: async (skillIds: string[]): Promise<SkillItem[]> => {
    const payload = {
      skillIds: [...new Set(skillIds)]
    }

    if (payload.skillIds.some((skillId) => !isUuid(skillId))) {
      throw new Error("Every selected skill ID must be a valid UUID.")
    }

    const response = await skillApi.selectSkills(payload)
    return normalizeSkillResponse(response.data).selectedSkills
  },

  compareRoadmapSkills: async (): Promise<SkillResponse> => {
    const response = await skillApi.compareRoadmapSkills()
    return normalizeSkillResponse(response.data)
  },

  getStudentRoadmap: async (): Promise<StudentRoadmap> => {
    const response = await roadmapApi.getStudentRoadmap()
    return normalizeStudentRoadmap(response.data)
  },

  updateNodeProgress: async (nodeId: string, status: string): Promise<any> => {
    const response = await roadmapApi.updateNodeProgress(nodeId, status);
    return unwrapResponse(response.data);
  },

  getRoadmapProgress: async (): Promise<RoadmapProgress> => {
    const response = await dashboardApi.getRoadmapProgress()
    return normalizeRoadmapProgress(response.data)
  },

  getSkillGaps: async (): Promise<SkillGap[]> => {
    // REFACTOR: Use skillApi.getSkills() instead of deprecated dashboardApi.getSkillGaps()
    const response = await skillApi.getSkills()
    const data = unwrapResponse(response.data) as any
    // Depending on the exact structure, it could be data.missingSkills or data.missing
    return data.missingSkills || data.missing || []
  },

  getNodeDetail: async (nodeId: string): Promise<any> => {
    const response = await roadmapApi.getNodeDetail(nodeId)
    return unwrapResponse(response.data)
  },

  // ─── Choose-one selections ─────────────────────────────────────
  getRoadmapSelections: async (): Promise<NodeSelection[]> => {
    const response = await roadmapApi.getSelections()
    const data = unwrapResponse<any>(response.data)
    return Array.isArray(data) ? data : []
  },

  selectAlternative: async (groupNodeId: string, chosenNodeId: string): Promise<NodeSelection> => {
    const response = await roadmapApi.selectAlternative(groupNodeId, chosenNodeId)
    return unwrapResponse(response.data)
  },

  clearRoadmapSelection: async (groupNodeId: string): Promise<void> => {
    await roadmapApi.clearSelection(groupNodeId)
  },

  getMentorFeedback: async (): Promise<MentorFeedback[]> => {
    const response = await dashboardApi.getMentorFeedback()
    return unwrapResponse(response.data)
  },

  getRecommendations: async (): Promise<Recommendation[]> => {
    const response = await dashboardApi.getRecommendations()
    return unwrapResponse(response.data)
  },

  getMarketDemand: async (): Promise<MarketDemand> => {
    const response = await dashboardApi.getMarketDemand()
    return unwrapResponse(response.data)
  },

  getAiHistory: async (): Promise<AiHistoryItem[]> => {
    const response = await dashboardApi.getAiHistory()
    return unwrapResponse(response.data)
  },

  // Pure transform (no fetch); RoadmapVectorGraph feeds it the payload the page
  // already loaded. Implementation lives in studentDashboardNormalizers.
  buildRoadmapGraph,
}

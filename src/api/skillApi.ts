import { isAxiosError } from 'axios'
import { mainClient } from './apiClients'
import { ENDPOINTS } from './endpoints'

export interface SkillItem {
  skillId: string
  skillName: string
  category: string
  career: string
}

export interface RequiredSkill {
  skill: SkillItem
  importanceLevel: string
}

export interface SkillResponse {
  selectedSkills: SkillItem[]
  skills: SkillItem[]
  requiredSkills: RequiredSkill[]
  missingSkills: SkillItem[]
}

export interface SelectSkillsPayload {
  skillIds: string[]
}

const emptySkillResponse = (): SkillResponse => ({
  selectedSkills: [],
  skills: [],
  requiredSkills: [],
  missingSkills: [],
})

const normalizeSkillResponse = (data: unknown): SkillResponse => {
  if (!data || typeof data !== 'object') return emptySkillResponse()

  const response = 'data' in data && data.data && typeof data.data === 'object'
    ? data.data
    : data
  const dto = response as Partial<SkillResponse>

  return {
    selectedSkills: Array.isArray(dto.selectedSkills) ? dto.selectedSkills : [],
    skills: Array.isArray(dto.skills) ? dto.skills : [],
    requiredSkills: Array.isArray(dto.requiredSkills) ? dto.requiredSkills : [],
    missingSkills: Array.isArray(dto.missingSkills) ? dto.missingSkills : [],
  }
}

export const getSkillErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return 'Cannot connect to server.'

  const backendMessage = typeof error.response?.data === 'object' && error.response?.data
    ? (error.response.data as { message?: string }).message
    : undefined

  switch (error.response?.status) {
    case 400:
      return backendMessage || 'Select at least one valid skill.'
    case 401:
    case 403:
      return backendMessage || 'Your session or role is not authorized to select skills.'
    case 404:
      return backendMessage || 'One or more selected skills no longer exist.'
    default:
      return backendMessage || 'Unable to update selected skills.'
  }
}

const skillApi = {
  getSelectedSkills: async (): Promise<SkillItem[]> => {
    const response = await mainClient.get<SkillResponse>(ENDPOINTS.STUDENT.SKILLS)
    return normalizeSkillResponse(response.data).selectedSkills
  },

  searchSkills: async (search: string): Promise<SkillItem[]> => {
    const response = await mainClient.get<SkillResponse>(
      `${ENDPOINTS.STUDENT.SKILLS}/${encodeURIComponent(search)}`,
    )
    return normalizeSkillResponse(response.data).skills
  },

  selectSkills: async (skillIds: string[]): Promise<SkillItem[]> => {
    const payload: SelectSkillsPayload = {
      skillIds: [...new Set(skillIds)],
    }
    const response = await mainClient.post<SkillResponse>(
      ENDPOINTS.STUDENT.SELECT_SKILLS,
      payload,
    )
    return normalizeSkillResponse(response.data).selectedSkills
  },

  compareRoadmapSkills: async (): Promise<SkillResponse> => {
    const response = await mainClient.post<SkillResponse>(
      ENDPOINTS.ROADMAP.COMPARE_SKILLS,
    )
    return normalizeSkillResponse(response.data)
  },
}

export default skillApi

import { isAxiosError } from "axios"
import { careerApi, dashboardApi, profileApi, roadmapApi, skillApi } from "@/api"
import { isUuid, toIsoDateOnly } from "@/lib/utils"
import type {
  CareerRole,
  RoadmapNode,
  RoadmapNodeStatus,
  RoadmapResource,
  SkillItem,
  SkillResponse,
  StudentRoadmap
} from "../types"
import type {
  AiHistoryItem,
  MarketDemand,
  MentorFeedback,
  Recommendation,
  RoadmapProgress,
  SkillGap
} from "../types"

type RawCareerRole = {
  careerId?: string
  career_id?: string
  id?: string
  careerName?: string
  career_name?: string
  name?: string
  prerequisite?: string
  description?: string
}

type RawRoadmapResource = Partial<RoadmapResource> | string

type RawRoadmapNode = {
  id?: string
  nodeId?: string
  title?: string
  nodeName?: string
  status?: string
  description?: string
  level?: number
  resources?: RawRoadmapResource[]
  resource?: RawRoadmapResource[] | string
  children?: RawRoadmapNode[]
}

type RawStudentRoadmap = {
  targetCareerRole?: string
  careerName?: string
  progress?: number
  nodes?: RawRoadmapNode[]
  roadmap?: RawRoadmapNode[]
  steps?: RawRoadmapNode[]
}

type StudentProfilePayload = {
  university: string
  yearOfAdmission: string
  major: string
  careerId: string
}

const unwrapResponse = <T>(responseData: unknown): T => {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    return (responseData as { data: T }).data
  }

  return responseData as T
}

const normalizeCareerRole = (career: RawCareerRole): CareerRole | null => {
  const careerId = career.careerId || career.career_id || career.id
  const careerName = career.careerName || career.career_name || career.name

  if (!careerId || !careerName || !isUuid(careerId)) return null

  return {
    careerId,
    careerName,
    prerequisite: career.prerequisite,
    description: career.description
  }
}

const emptySkillResponse = (): SkillResponse => ({
  selectedSkills: [],
  skills: [],
  requiredSkills: [],
  missingSkills: []
})

const isValidSkillItem = (skill: unknown): skill is SkillItem => {
  const item = skill as Partial<SkillItem>
  return Boolean(item?.skillId && isUuid(item.skillId) && item.skillName)
}

const normalizeSkillResponse = (data: unknown): SkillResponse => {
  if (!data || typeof data !== "object") return emptySkillResponse()

  const dto = unwrapResponse<Partial<SkillResponse>>(data)

  return {
    selectedSkills: Array.isArray(dto.selectedSkills) ? dto.selectedSkills.filter(isValidSkillItem) : [],
    skills: Array.isArray(dto.skills) ? dto.skills.filter(isValidSkillItem) : [],
    requiredSkills: Array.isArray(dto.requiredSkills)
      ? dto.requiredSkills.filter(({ skill }) => isValidSkillItem(skill))
      : [],
    missingSkills: Array.isArray(dto.missingSkills) ? dto.missingSkills.filter(isValidSkillItem) : []
  }
}

const normalizeStatus = (status?: string): RoadmapNodeStatus => {
  const value = String(status || "locked").toLowerCase()
  if (value === "completed" || value === "current" || value === "locked" || value === "in_progress") return value
  return "locked"
}

const parseResourceField = (resource?: RawRoadmapResource[] | string): RawRoadmapResource[] => {
  if (!resource) return []
  if (Array.isArray(resource)) return resource

  try {
    const parsed = JSON.parse(resource) as RawRoadmapResource[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const normalizeResource = (resource: RawRoadmapResource, index: number): RoadmapResource | null => {
  if (typeof resource === "string") {
    return {
      title: `Resource ${index + 1}`,
      url: resource
    }
  }

  if (!resource?.url) return null

  return {
    title: resource.title || `Resource ${index + 1}`,
    url: resource.url,
    type: resource.type
  }
}

const normalizeNode = (node: RawRoadmapNode): RoadmapNode | null => {
  const id = node.id || node.nodeId
  if (!id || !isUuid(id)) return null

  const rawResources = node.resources ?? parseResourceField(node.resource)

  return {
    id,
    title: node.title || node.nodeName || "Untitled node",
    status: normalizeStatus(node.status),
    description: node.description,
    level: node.level,
    resources: rawResources
      .map((resource, index) => normalizeResource(resource, index))
      .filter((resource): resource is RoadmapResource => Boolean(resource)),
    children: Array.isArray(node.children)
      ? node.children
          .map(normalizeNode)
          .filter((child): child is RoadmapNode => Boolean(child))
      : []
  }
}

const normalizeStudentRoadmap = (responseData: unknown): StudentRoadmap => {
  const data = unwrapResponse<RawStudentRoadmap>(responseData)
  const nodes = data.nodes ?? data.roadmap ?? data.steps ?? []

  return {
    targetCareerRole: data.targetCareerRole || data.careerName,
    progress: typeof data.progress === "number" ? data.progress : undefined,
    nodes: Array.isArray(nodes)
      ? nodes
          .map(normalizeNode)
          .filter((node): node is RoadmapNode => Boolean(node))
      : []
  }
}

const normalizeRoadmapProgress = (data: unknown): RoadmapProgress => {
  const roadmap = unwrapResponse<RoadmapProgress>(data)
  return {
    ...roadmap,
    steps: Array.isArray(roadmap?.steps)
      ? roadmap.steps.map((step) => ({
          ...step,
          status: normalizeStatus(step.status)
        }))
      : []
  }
}

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

  updateStudentProfile: (payload: StudentProfilePayload) => {
    const yearOfAdmission = toIsoDateOnly(payload.yearOfAdmission)
    if (!yearOfAdmission) throw new Error("Admission date must use yyyy-MM-dd format.")
    if (!isUuid(payload.careerId)) throw new Error("Career ID must be a valid UUID.")

    return profileApi.updateStudentProfile({
      ...payload,
      yearOfAdmission
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
    if (!isUuid(careerId)) throw new Error("Career ID must be a valid UUID.")

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
    const response = await dashboardApi.getSkillGaps()
    return unwrapResponse(response.data)
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

  getRoadmapGraphData: async (): Promise<{ nodes: any[], edges: any[] }> => {
    try {
      const response = await roadmapApi.getStudentRoadmap();
      
      // Determine the array of rows from API response format
      let rows: any[] = [];
      if (Array.isArray(response.data)) {
        rows = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        rows = response.data.data;
      } else if (response.data && Array.isArray(response.data.nodes)) {
        rows = response.data.nodes;
      } else if (response.data && Array.isArray(response.data.steps)) {
        rows = response.data.steps;
      } else if (response.data && Array.isArray(response.data.roadmap)) {
        rows = response.data.roadmap;
      }

      // Step 1: Identify all main nodes to build the sequential spine
      const mainNodes = rows
        .map(r => ({ ...r, parsedLevel: parseInt(String(r.Level || r.level)) || 0 }))
        .filter(r => r.parsedLevel > 0)
        .sort((a, b) => a.parsedLevel - b.parsedLevel);

      const nodes: any[] = [];
      const edges: any[] = [];
      
      rows.forEach((row, index) => {
        const nodeName = row.NodeName || row.nodeName;
        let parentId = row.ChildNodeOf || row.childNodeOf ? String(row.ChildNodeOf || row.childNodeOf).trim() : null;
        const level = parseInt(String(row.Level || row.level || 0));
        
        if (!nodeName) return;
        
        const nodeId = String(nodeName).trim();
        
        // Auto-connect main spine nodes based on sorted index
        if (level > 0) {
          const mainNodeIndex = mainNodes.findIndex(n => 
            String(n.NodeName || n.nodeName).trim() === nodeId
          );
          if (mainNodeIndex > 0) {
            const prevMainNode = mainNodes[mainNodeIndex - 1];
            parentId = String(prevMainNode.NodeName || prevMainNode.nodeName).trim();
          }
        }
        
        let resources: any[] = [];
        
        // Extract from normalized array or string
        const rawResources = row.resources ?? parseResourceField(row.resource);
        if (Array.isArray(rawResources) && rawResources.length > 0) {
          resources = rawResources.map((res: any, idx: number) => {
            if (!res) return null;
            if (typeof res === 'string') return { title: `Resource ${idx + 1}`, url: res };
            return { title: res?.title || `Resource ${idx + 1}`, url: res?.url || res?.link || res?.href };
          }).filter((res: any) => Boolean(res?.url));
        }
        
        // Fallback to legacy link1, link2, link3
        if (resources.length === 0) {
          const legacyObj = (row.resource && typeof row.resource === 'object' && !Array.isArray(row.resource)) ? row.resource : row;
          if (legacyObj.link1) resources.push({ title: 'Resource 1', url: legacyObj.link1 });
          if (legacyObj.link2) resources.push({ title: 'Resource 2', url: legacyObj.link2 });
          if (legacyObj.link3) resources.push({ title: 'Resource 3', url: legacyObj.link3 });
        }
        
        nodes.push({
          id: nodeId,
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            id: nodeId,
            label: row.NodeName || row.nodeName || row.title || nodeId,
            description: row.Description || row.description || '',
            links: resources,
            level: level,
            status: normalizeStatus(row.Status || row.status)
          }
        });

        if (parentId) {
          const isMainNode = level > 0;
          const status = normalizeStatus(row.Status || row.status);
          edges.push({
            id: `e-${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            type: 'smoothstep',
            animated: status === 'in_progress' || status === 'current',
            style: { 
              stroke: '#3b82f6', // solid blue
              strokeWidth: isMainNode ? 3 : 2, 
              strokeDasharray: isMainNode ? 'none' : '5 5' // Dotted for side branches
            }
          });
        }
      });

      return { nodes, edges };
    } catch (error) {
      console.error("[Student Roadmap] Failed to fetch roadmap graph data from API:", error);
      return { nodes: [], edges: [] };
    }
  }
}

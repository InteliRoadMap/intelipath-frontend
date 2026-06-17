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
  Description?: string
  content?: string
  desc?: string
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
    description: career.description || career.Description || career.desc || career.content
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

const normalizeNode = (node: any): RoadmapNode | null => {
  const id = node.id || node.nodeId || node.node_id
  if (!id) return null

  const rawResources = node.resources ?? parseResourceField(node.resource)

  return {
    id,
    title: node.title || node.nodeName || node.node_name || "Untitled node",
    status: normalizeStatus(node.status),
    description: node.description,
    level: node.level,
    resources: rawResources
      .map((resource: any, index: number) => normalizeResource(resource, index))
      .filter((resource: any): resource is RoadmapResource => Boolean(resource)),
    children: Array.isArray(node.children)
      ? node.children
          .map(normalizeNode)
          .filter((child: any): child is RoadmapNode => Boolean(child))
      : []
  }
}

const normalizeStudentRoadmap = (responseData: unknown): StudentRoadmap => {
  const data = unwrapResponse<any>(responseData)
  
  let rawNodes: any[] = []
  let targetCareerRole: string | undefined
  let progress: number | undefined

  // Recursive finder to locate the actual node array or root node
  const findRoadmapData = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return null;
    if (Array.isArray(obj)) {
      if (obj.length > 0 && (obj[0].nodeId || obj[0].id || obj[0].title || obj[0].name || obj[0].nodeName || obj[0].NodeName)) {
        return obj; // Found the array of nodes!
      }
      for (const item of obj) {
        const found = findRoadmapData(item);
        if (found) return found;
      }
      return null;
    }
    // Is this object itself a node?
    if (obj.nodeId || obj.id || obj.title || obj.name || obj.nodeName || obj.NodeName) {
      if (obj.children || obj.status || obj.level || obj.Level) return obj;
    }
    // Otherwise, search its keys
    for (const key of Object.keys(obj)) {
      const found = findRoadmapData(obj[key]);
      if (found) return found;
    }
    return null;
  };

  if (data && typeof data === 'object') {
    const extractedData = findRoadmapData(data) || data;
    if (Array.isArray(extractedData)) {
      rawNodes = extractedData;
    } else if (extractedData && typeof extractedData === 'object') {
      rawNodes = [extractedData];
    }
    targetCareerRole = data.targetCareerRole || data.careerName || data.career_name || data.data?.targetCareerRole || data.data?.careerName
    progress = typeof data.progress === "number" ? data.progress : data.data?.progress
  }

  const flattenedNodes: any[] = [];
  const flattenNode = (node: any) => {
    if (!node) return;
    flattenedNodes.push(node);
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(flattenNode);
    }
  };
  rawNodes.forEach(flattenNode);

  return {
    targetCareerRole,
    progress,
    _rawResponse: responseData,
    nodes: flattenedNodes
      .map(normalizeNode)
      .filter((node): node is RoadmapNode => Boolean(node))
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
      
      const rows: any[] = [];
      const nameToId: Record<string, string> = {};
      
      const registerNameId = (node: any) => {
        const name = String(node.title || node.name || node.NodeName || node.nodeName || node.node_name || "").trim();
        const id = String(node.nodeId || node.id || node.node_id || name).trim();
        if (name && id) nameToId[name] = id;
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(registerNameId);
        }
      };

      const flattenNode = (node: any, parentId: string | null = null) => {
        if (!node) return;
        const flattenedNode = { ...node };
        if (parentId && !flattenedNode.childNodeOf && !flattenedNode.ChildNodeOf && !flattenedNode.connectTo && !flattenedNode.ConnectTo) {
          flattenedNode.childNodeOf = parentId;
        }
        rows.push(flattenedNode);
        if (node.children && Array.isArray(node.children)) {
          const currentId = node.nodeId || node.id || node.node_id || node.nodeName || node.NodeName || node.title;
          node.children.forEach((child: any) => flattenNode(child, currentId));
        }
      };

      const findRoadmapData = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return null;
        if (Array.isArray(obj)) {
          if (obj.length > 0 && (obj[0].nodeId || obj[0].id || obj[0].title || obj[0].name || obj[0].nodeName || obj[0].NodeName)) {
            return obj;
          }
          for (const item of obj) {
            const found = findRoadmapData(item);
            if (found) return found;
          }
          return null;
        }
        if (obj.nodeId || obj.id || obj.title || obj.name || obj.nodeName || obj.NodeName) {
          if (obj.children || obj.status || obj.level || obj.Level) return obj;
        }
        for (const key of Object.keys(obj)) {
          const found = findRoadmapData(obj[key]);
          if (found) return found;
        }
        return null;
      };

      const extractedData = findRoadmapData(response.data) || response.data;
      
      if (Array.isArray(extractedData)) {
        extractedData.forEach(registerNameId);
        extractedData.forEach(item => flattenNode(item));
      } else if (extractedData && typeof extractedData === 'object') {
        registerNameId(extractedData);
        flattenNode(extractedData);
      }

      // Identify main nodes: strictly those with explicit level > 0 from the database
      const actualMainNodes = rows.filter(r => {
        const explicitLevel = parseInt(String(r.Level || r.level || 0));
        return explicitLevel > 0;
      }).sort((a, b) => {
        const levelA = parseInt(String(a.Level || a.level || 0));
        const levelB = parseInt(String(b.Level || b.level || 0));
        return levelA - levelB;
      });

      const nodes: any[] = [];
      const edges: any[] = [];
      
      const adjacencyList: Record<string, string[]> = {};
      const inDegree: Record<string, number> = {};

      rows.forEach((row, index) => {
        const nodeName = row.title || row.name || row.NodeName || row.nodeName || row.node_name || row.id || row.nodeId || `Node_${index}`;
        const isMainNode = actualMainNodes.some(m => m === row);
        const level = isMainNode ? parseInt(String(row.Level || row.level || 1)) : 0; // Maintain explicit level for UI
        
        const nodeId = String(row.nodeId || row.id || row.node_id || nodeName).trim();

        adjacencyList[nodeId] = adjacencyList[nodeId] || [];
        inDegree[nodeId] = inDegree[nodeId] || 0;

        let resources: any[] = [];
        const rawResourceData = row.resources || row.Resources || row.resource || row.Resource;
        
        if (rawResourceData) {
            const parseResourceField = (res: any) => {
                let parsed = res;
                if (typeof res === 'string') {
                    try { parsed = JSON.parse(res); } catch (e) { parsed = []; }
                }
                if (Array.isArray(parsed)) return parsed.map((r: any, i: number) => ({ title: r.title || `Resource ${i+1}`, url: r.url || r.link || "" }));
                if (typeof parsed === 'object' && parsed !== null) return [{ title: parsed.title || "Resource", url: parsed.url || parsed.link || "" }];
                return [];
            };
            resources = parseResourceField(rawResourceData);
        } else {
          if (row.Link1 || row.link1) resources.push({ title: row.Title1 || 'Resource 1', url: row.Link1 || row.link1 });
          if (row.Link2 || row.link2) resources.push({ title: row.Title2 || 'Resource 2', url: row.Link2 || row.link2 });
          if (row.Link3 || row.link3) resources.push({ title: row.Title3 || 'Resource 3', url: row.Link3 || row.link3 });
        }
        
        nodes.push({
          id: nodeId,
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            id: nodeId,
            label: nodeName,
            description: row.Description || row.description || row.NodeDescription || row.nodeDescription || row.content || row.desc || '',
            links: resources,
            level: level,
            status: normalizeStatus(row.Status || row.status)
          }
        });
      });

      rows.forEach(row => {
        const nodeName = row.title || row.name || row.NodeName || row.nodeName || row.node_name || row.id || row.nodeId;
        const nodeId = String(row.nodeId || row.id || row.node_id || nodeName).trim();
        const isMainNode = actualMainNodes.some(m => m === row);
        
        let parentId = null;
        const rawParent = row.childNodeOf || row.ChildNodeOf || row.child_node_of || row.connectTo || row.ConnectTo || row.connect_to || row.parentId || row.parent_id;
        
        if (rawParent) {
          if (typeof rawParent === 'object') {
            parentId = rawParent.nodeId || rawParent.id || rawParent.node_id || rawParent.title || rawParent.name || rawParent.nodeName || rawParent.node_name || rawParent.NodeName;
          } else {
            parentId = String(rawParent).trim();
            if (nameToId[parentId]) {
              parentId = nameToId[parentId];
            }
          }
        }
        
        // Auto-connect main spine nodes sequentially based on actualMainNodes array order
        if (isMainNode && !parentId) {
          const mainNodeIndex = actualMainNodes.findIndex(m => m === row);
          if (mainNodeIndex > 0) {
            const prevMainNode = actualMainNodes[mainNodeIndex - 1];
            parentId = String(prevMainNode.nodeId || prevMainNode.id || prevMainNode.node_id || prevMainNode.title || prevMainNode.name || prevMainNode.NodeName || prevMainNode.nodeName || prevMainNode.node_name).trim();
          }
        }
        
        if (parentId) {
          const status = normalizeStatus(row.Status || row.status);
          edges.push({
            id: `e-${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            type: 'smoothstep',
            animated: status === 'in_progress' || status === 'current',
            style: { 
              strokeWidth: isMainNode ? 3 : 2, 
              strokeDasharray: isMainNode ? 'none' : '5 5'
            }
          });
          adjacencyList[parentId] = adjacencyList[parentId] || [];
          adjacencyList[parentId].push(nodeId);
          inDegree[nodeId] = (inDegree[nodeId] || 0) + 1;
        }
      });

      return { nodes, edges };
    } catch (error) {
      console.error("[Student Roadmap] Failed to fetch roadmap graph data from API:", error);
      return { nodes: [], edges: [] };
    }
  }
}

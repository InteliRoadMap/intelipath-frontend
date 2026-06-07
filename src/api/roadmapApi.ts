import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"
import type {
  RoadmapNode,
  RoadmapNodeStatus,
  RoadmapResource,
  StudentRoadmap
} from "@/features/student-dashboard/types"

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
  data?: RawStudentRoadmap
  targetCareerRole?: string
  careerName?: string
  progress?: number
  nodes?: RawRoadmapNode[]
  roadmap?: RawRoadmapNode[]
  steps?: RawRoadmapNode[]
}

const unwrapResponse = <T>(responseData: unknown): T => {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    return (responseData as { data: T }).data
  }

  return responseData as T
}

const normalizeStatus = (status?: string): RoadmapNodeStatus => {
  const value = String(status || "locked").toLowerCase()
  if (value === "completed" || value === "current" || value === "locked") return value
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

const normalizeNode = (node: RawRoadmapNode): RoadmapNode => {
  const rawResources = node.resources ?? parseResourceField(node.resource)

  return {
    id: node.id || node.nodeId || crypto.randomUUID(),
    title: node.title || node.nodeName || "Untitled node",
    status: normalizeStatus(node.status),
    description: node.description,
    level: node.level,
    resources: rawResources
      .map((resource, index) => normalizeResource(resource, index))
      .filter((resource): resource is RoadmapResource => Boolean(resource)),
    children: Array.isArray(node.children) ? node.children.map(normalizeNode) : []
  }
}

const normalizeStudentRoadmap = (responseData: unknown): StudentRoadmap => {
  const data = unwrapResponse<RawStudentRoadmap>(responseData)
  const nodes = data.nodes ?? data.roadmap ?? data.steps ?? []

  return {
    targetCareerRole: data.targetCareerRole || data.careerName,
    progress: typeof data.progress === "number" ? data.progress : undefined,
    nodes: Array.isArray(nodes) ? nodes.map(normalizeNode) : []
  }
}

const roadmapApi = {
  getStudentRoadmap: async (): Promise<StudentRoadmap> => {
    const response = await mainClient.get(ENDPOINTS.ROADMAP.STUDENT_ROADMAP)
    return normalizeStudentRoadmap(response.data)
  }
}

export default roadmapApi

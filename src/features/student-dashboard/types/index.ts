export * from "./studentDashboard.types"

export interface StudentRoadmap {
  targetCareerRole?: string
  progress?: number
  nodes: RoadmapNode[]
  _rawResponse?: any
}

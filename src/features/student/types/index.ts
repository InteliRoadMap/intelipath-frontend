export * from "./studentDashboard.types"
import { RoadmapNode } from "./studentDashboard.types" // Added import

export interface StudentRoadmap {
  targetCareerRole?: string
  progress?: number
  nodes: RoadmapNode[]
  _rawResponse?: any
}

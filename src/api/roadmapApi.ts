import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const roadmapApi = {
  getStudentRoadmap: () => mainClient.get(ENDPOINTS.ROADMAP.STUDENT_ROADMAP),
  updateNodeProgress: (nodeId: string, status: string) => 
    mainClient.put(ENDPOINTS.ROADMAP.UPDATE_NODE_PROGRESS, { nodeId, status }),
  getNodeDetail: (nodeId: string) => mainClient.get(ENDPOINTS.ROADMAP.NODE_DETAIL(nodeId))
}

export default roadmapApi

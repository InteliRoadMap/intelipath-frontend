import { ENDPOINTS, mainClient } from "@/shared/api"

const roadmapApi = {
  getStudentRoadmap: () => mainClient.get(ENDPOINTS.ROADMAP.STUDENT_ROADMAP),
  updateNodeProgress: (nodeId: string, status: string) =>
    mainClient.put(ENDPOINTS.ROADMAP.UPDATE_NODE_PROGRESS, { nodeId, status }),
  getNodeDetail: (nodeId: string) => mainClient.get(ENDPOINTS.ROADMAP.NODE_DETAIL(nodeId)),

  // ─── Choose-one selections ─────────────────────────────────────
  getSelections: () => mainClient.get(ENDPOINTS.ROADMAP.SELECTIONS),
  selectAlternative: (groupNodeId: string, chosenNodeId: string) =>
    mainClient.put(ENDPOINTS.ROADMAP.SELECTIONS, { groupNodeId, chosenNodeId }),
  clearSelection: (groupNodeId: string) =>
    mainClient.delete(ENDPOINTS.ROADMAP.CLEAR_SELECTION(groupNodeId)),

  // ─── Roadmap Personalization (AI recommendations) ──────────────
  getPendingRecommendations: () =>
    mainClient.get(ENDPOINTS.ROADMAP_RECOMMENDATIONS.PENDING),
  generateRecommendations: () =>
    mainClient.post(ENDPOINTS.ROADMAP_RECOMMENDATIONS.GENERATE),
  acceptRecommendation: (recommendationId: string) =>
    mainClient.post(ENDPOINTS.ROADMAP_RECOMMENDATIONS.ACCEPT(recommendationId)),
  rejectRecommendation: (recommendationId: string) =>
    mainClient.post(ENDPOINTS.ROADMAP_RECOMMENDATIONS.REJECT(recommendationId))
}

export default roadmapApi

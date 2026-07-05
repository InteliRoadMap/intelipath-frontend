import { ENDPOINTS, mainClient } from "@/shared/api"

const roadmapApi = {
  getStudentRoadmap: () => mainClient.get(ENDPOINTS.ROADMAP.STUDENT_ROADMAP),
  updateNodeProgress: (nodeId: string, status: string) =>
    mainClient.put(ENDPOINTS.ROADMAP.UPDATE_NODE_PROGRESS, { nodeId, status }),
  getNodeDetail: (nodeId: string) => mainClient.get(ENDPOINTS.ROADMAP.NODE_DETAIL(nodeId)),

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

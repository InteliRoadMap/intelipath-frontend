import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const dashboardApi = {
  getOverview: () =>
    mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.OVERVIEW),
    
  getRoadmapProgress: () =>
    mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.ROADMAP_PROGRESS),
  

  getMentorFeedback: () =>
    mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MENTOR_FEEDBACK),

  getRecommendations: () =>
    mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.RECOMMENDATIONS),

  getMarketDemand: () =>
    mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.MARKET_DEMAND),
  
  getAiHistory: () =>
    mainClient.get(ENDPOINTS.STUDENT_DASHBOARD.AI_HISTORY)
}

export default dashboardApi

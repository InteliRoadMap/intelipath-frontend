import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const marketPulseApi = {
  getTopHiringCompanies: (limit: number = 10) =>
    mainClient.get(`${ENDPOINTS.MARKET_TRENDS.TOP_HIRING}?limit=${limit}`),

  getTrendingSkills: () =>
    mainClient.get(ENDPOINTS.MARKET_TRENDS.TRENDING_SKILLS),

  getSalaryOverview: () =>
    mainClient.get(ENDPOINTS.MARKET_TRENDS.SALARY_OVERVIEW),

  getRecruitmentPosts: () =>
    mainClient.get(ENDPOINTS.RECRUITMENT_POSTS.ALL),
}

export default marketPulseApi

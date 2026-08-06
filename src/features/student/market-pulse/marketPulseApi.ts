import { ENDPOINTS, mainClient } from "@/shared/api"

/**
 * `days` narrows every figure to postings from the last N days. Omitting it keeps
 * the server's original all-time behaviour, so nothing that has not opted in
 * changes meaning.
 */
const marketPulseApi = {
  getTopHiringCompanies: (limit: number = 10, days?: number) =>
    mainClient.get(ENDPOINTS.MARKET_TRENDS.TOP_HIRING, {
      params: { limit, ...(days ? { days } : {}) },
    }),

  getTrendingSkills: (days?: number) =>
    mainClient.get(ENDPOINTS.MARKET_TRENDS.TRENDING_SKILLS, {
      params: days ? { days } : {},
    }),

  getSalaryOverview: (days?: number) =>
    mainClient.get(ENDPOINTS.MARKET_TRENDS.SALARY_OVERVIEW, {
      params: days ? { days } : {},
    }),

  /** How current the data behind the charts is — window, new jobs, latest posting. */
  getFreshness: (days: number = 30) =>
    mainClient.get(`${ENDPOINTS.MARKET_TRENDS.BASE}/freshness`, { params: { days } }),

  /**
   * `seniority` narrows the list to roles at that level. Postings whose level
   * could not be read are still returned — a job we could not label is still a
   * job the student may qualify for.
   */
  getRecruitmentPosts: (seniority?: string | null) =>
    mainClient.get(ENDPOINTS.RECRUITMENT_POSTS.ALL, {
      params: seniority ? { seniority } : {},
    }),
}

export default marketPulseApi

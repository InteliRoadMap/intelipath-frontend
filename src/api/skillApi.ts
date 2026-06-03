import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

export interface SelectSkillsPayload {
  // studentId không cần gửi — backend tự đọc từ JWT Token
  skillList: Array<{
    // Required: Danh sách skill đã chọn
    skillId: string
    skillName: string
    category: string
  }>
}

const skillApi = {
  /**
   * [GET] Lấy danh sách skill của sinh viên hiện tại
   * → GET /student/skills
   * Không cần truyền student_id — backend tự đọc từ JWT Token
   */
  getSkills: async () => {
    try {
      return await mainClient.get(ENDPOINTS.STUDENT.SKILLS)
    } catch (error) {
      console.error("[skillApi.getSkills] Lỗi:", error)
      throw error
    }
  },

  /**
   * [GET] Lấy danh sách skill lọc theo category
   * → GET /student/skills/{category}
   * Không cần student_id — backend tự đọc từ JWT Token
   */
  filterSkills: async (category: string) => {
    try {
      return await mainClient.get(
        `${ENDPOINTS.STUDENT.FILTER_SKILLS}/${category}`
      )
    } catch (error) {
      console.error("[skillApi.filterSkills] Lỗi:", error)
      throw error
    }
  },

  /**
   * [POST] Sinh viên xác nhận và lưu danh sách kỹ năng đã chọn
   * → POST /student/skills/select
   * Body: { skillList: [{ skillId, name, category }] }
   * Không cần studentId — backend tự đọc từ JWT Token
   */
  selectSkills: async (data: SelectSkillsPayload) => {
    try {
      return await mainClient.post(ENDPOINTS.STUDENT.SELECT_SKILLS, data)
    } catch (error) {
      console.error("[skillApi.selectSkills] Lỗi:", error)
      throw error
    }
  }
}

export default skillApi

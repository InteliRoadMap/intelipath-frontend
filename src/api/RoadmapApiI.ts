// import { mainClient } from "./apiClients"
// import { ENDPOINTS } from "./endpoints"

// const roadmapApi = {
//   // ─── Student Profile ────────────────────────────────────────
//   /**
//    * [GET] Lấy thông tin student profile để kiểm tra career_id đã lưu
//    * → GET /student/profile
//    */
//   getStudentProfile: async () => {
//     try {
//       console.log("[roadmapApi.getStudentProfile] Đang lấy student profile")
//       return await mainClient.get(ENDPOINTS.STUDENT.PROFILE)
//     } catch (error) {
//       console.error("[roadmapApi.getStudentProfile] Lỗi:", error)
//       throw error
//     }
//   },

//   /**
//    * [PATCH] Submit careerId & and save careerId into profile sinh viên
//    * → PATCH /student/profile  { careerId }
//    */
//   selectCareer: async (career_id: string) => {
//     try {
//       console.log("[roadmapApi.selectCareer] Đang chọn Career:", career_id)
//       return await mainClient.patch(ENDPOINTS.STUDENT.PROFILE, {
//         careerId: career_id
//       })
//     } catch (error) {
//       console.error("[roadmapApi.selectCareer] Lỗi:", error)
//       throw error
//     }
//   },

//   // ─── Careers ────────────────────────────────────────────────
//   /**
//    * [GET] Lấy danh sách tất cả nghề nghiệp
//    * → GET /careers
//    */
//   getCareers: async () => {
//     try {
//       console.log("[roadmapApi.getCareers] Đang lấy danh sách Career")
//       return await mainClient.get(ENDPOINTS.CAREER.LIST)
//     } catch (error) {
//       console.error("[roadmapApi.getCareers] Lỗi:", error)
//       throw error
//     }
//   },

//   /**
//    * [GET] Lấy danh sách kỹ năng yêu cầu của một nghề
//    * → GET /careers/{career_id}/requirements
//    */
//   getCareerRequirements: async (career_id: string) => {
//     try {
//       console.log(
//         "[roadmapApi.getCareerRequirements] Lấy requirements:",
//         career_id
//       )
//       return await mainClient.get(
//         `${ENDPOINTS.CAREER.REQUIREMENTS}/${career_id}/requirements`
//       )
//     } catch (error) {
//       console.error("[roadmapApi.getCareerRequirements] Lỗi:", error)
//       throw error
//     }
//   },

//   // ─── Roadmap ────────────────────────────────────────────────
//   /**
//    * [GET] Lấy toàn bộ roadmap của một nghề
//    * → GET /roadmap/{career_id}
//    */
//   getRoadmap: async (career_id: string) => {
//     try {
//       console.log("[roadmapApi.getRoadmap] Đang lấy roadmap:", career_id)
//       return await mainClient.get(
//         `${ENDPOINTS.ROADMAP.GET_ROAD_MAP}/${career_id}`
//       )
//     } catch (error) {
//       console.error("[roadmapApi.getRoadmap] Lỗi:", error)
//       throw error
//     }
//   },

//   /**
//    * [GET] Lấy tổng tiến độ học tập của sinh viên cho một nghề
//    * → GET /roadmap/{career_id}/progress
//    */
//   getTotalProgress: async (career_id: string) => {
//     try {
//       console.log("[roadmapApi.getTotalProgress] Lấy progress:", career_id)
//       return await mainClient.get(
//         `${ENDPOINTS.ROADMAP.TOTAL_PROGRESS}/${career_id}/progress`
//       )
//     } catch (error) {
//       console.error("[roadmapApi.getTotalProgress] Lỗi:", error)
//       throw error
//     }
//   },

//   /**
//    * [GET] Lấy chi tiết một node (tài liệu, mô tả, trạng thái)
//    * → GET /roadmap/node/{node_id}
//    */
//   getNode: async (node_id: string) => {
//     try {
//       console.log("[roadmapApi.getNode] Lấy node:", node_id)
//       return await mainClient.get(`${ENDPOINTS.ROADMAP.GET_NODE}/${node_id}`)
//     } catch (error) {
//       console.error("[roadmapApi.getNode] Lỗi:", error)
//       throw error
//     }
//   },

//   /**
//    * [PATCH] Cập nhật tiến độ học của một node
//    * → PATCH /roadmap/node/progress
//    * Body: { studentId, nodeId, status: "COMPLETED" }
//    *
//    * status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED"
//    */
//   updateProgress: async (
//     node_id: string,
//     status: "completed" | "in_progress" | "not_started"
//   ) => {
//     try {
//       console.log("[roadmapApi.updateProgress] Update:", node_id, "→", status)
//       return await mainClient.patch(ENDPOINTS.ROADMAP.UPDATE_PROGRESS, {
//         nodeId: node_id,
//         status: status.toUpperCase() // Backend nhận "COMPLETED" (chữ hoa)
//       })
//     } catch (error) {
//       console.error("[roadmapApi.updateProgress] Lỗi:", error)
//       throw error
//     }
//   },

//   /**
//    * [POST] So sánh kỹ năng hiện tại của sinh viên với yêu cầu của nghề
//    * → POST /roadmap/skills/compare
//    * Body: { studentId, careerId }
//    */
//   compareSkills: async (student_id: string, career_id: string) => {
//     try {
//       console.log("[roadmapApi.compareSkills] Comparing skills:", {
//         student_id,
//         career_id
//       })
//       return await mainClient.post(ENDPOINTS.ROADMAP.SKILLS_COMPARE, {
//         studentId: student_id,
//         careerId: career_id
//       })
//     } catch (error) {
//       console.error("[roadmapApi.compareSkills] Lỗi:", error)
//       throw error
//     }
//   }
// }

// export default roadmapApi

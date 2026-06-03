import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const updateApi = {
  /**
   * [GET] Get all user information của user
   * → PATCH /user/profile
   * Body: {  "studentId",
  "fullName",
  "email"
  "yob"
  "bio"
  "university"
  "major"
  "year_of_admission"
  "role"
  "career_id"
  "github"
}
   */
  getUserInfo: async () => {
    try {
      return await mainClient.get(ENDPOINTS.EDIT.USERPROFILE)
    } catch (error) {
      console.error("[updateApi.getUserInfo] Error of get user info:", error)
      throw error
    }
  },

  getStudentProfile: async () => {
    try {
      return await mainClient.get(ENDPOINTS.STUDENT.PROFILE)
    } catch (error) {
      console.error("[updateApi.getStudentProfile] Error:", error)
      throw error
    }
  },

  /**
   * [PATCH] Cập nhật thông tin cá nhân cơ bản của user
   * → PATCH /user/profile
   * Body: { fullName, yob, bio }
   */
  fillFormUser: async (data: {
    fullName: string
    yob: string
    bio: string
  }) => {
    try {
      return await mainClient.patch(ENDPOINTS.EDIT.USERPROFILE, data)
    } catch (error) {
      console.error(
        "[updateApi.fillFormUser] Error of update user info:",
        error
      )
      throw error
    }
  },

  /**
   * [PATCH] Cập nhật thông tin học vấn của sinh viên
   * → PATCH /student/profile
   * Body: { university, yearOfAdmission, major }
   */
  fillFormUserAcademic: async (data: {
    university: string
    yearOfAdmission: string
    major: string
  }) => {
    try {
      return await mainClient.patch(ENDPOINTS.STUDENT.PROFILE, data)
    } catch (error) {
      console.error(
        "[updateApi.fillFormUserAcademic] Error of update academic info:",
        error
      )
      throw error
    }
  }
}

export default updateApi

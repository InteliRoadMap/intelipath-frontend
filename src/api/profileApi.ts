import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

export interface UpdateUserProfilePayload {
  fullName: string
  yob: string
  bio: string
}

export interface UpdateStudentProfilePayload {
  university: string
  yearOfAdmission: string
  major: string
  careerId: string
}

export interface UpdateMentorProfilePayload {
  company: string
  industryFocus: string
}

export interface UpdateCounselorProfilePayload {
  department: string
  university: string
}

const profileApi = {
  getStudentProfile: () => mainClient.get(ENDPOINTS.STUDENT.PROFILE),
  getMentorProfile: () => mainClient.get(ENDPOINTS.MENTOR.PROFILE),
  getCounselorProfile: () => mainClient.get(ENDPOINTS.COUNSELOR.PROFILE),

  updateUserProfile: (data: UpdateUserProfilePayload) =>
    mainClient.patch(ENDPOINTS.USERS.PROFILE, data),

  updateStudentProfile: (data: UpdateStudentProfilePayload) =>
    mainClient.patch(ENDPOINTS.STUDENT.PROFILE, data),

  updateMentorProfile: (data: UpdateMentorProfilePayload) =>
    mainClient.patch(ENDPOINTS.MENTOR.PROFILE, data),

  updateCounselorProfile: (data: UpdateCounselorProfilePayload) =>
    mainClient.patch(ENDPOINTS.COUNSELOR.PROFILE, data),

  updateAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    // Remove Content-Type so Axios/Browser can automatically generate it with the required boundary string
    return mainClient.patch('/users/profile/avatar', formData, {
      transformRequest: [(data, headers) => {
        delete headers['Content-Type'];
        return data;
      }],
    })
  },
}

export default profileApi

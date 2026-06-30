import { ENDPOINTS, mainClient } from "@/shared/api"

export interface UpdateUserProfilePayload {
  fullName: string
  yob: string
  bio: string
}

export interface UpdateStudentProfilePayload {
  universityId: string
  yearOfAdmission: string
  major: string
  // Original: careerId: string
  // Made optional to prevent Profile Settings from patching and wiping out data, but Onboarding still uses it.
  careerId?: string
}

export interface UpdateMentorProfilePayload {
  company: string
  industryFocus: string
}

export interface UpdateCounselorProfilePayload {
  department: string
  universityId: string
}

const profileApi = {
  getStudentProfile: () => mainClient.get(ENDPOINTS.STUDENT.PROFILE),
  getMentorProfile: () => mainClient.get(ENDPOINTS.MENTOR.PROFILE),
  getCounselorProfile: () => mainClient.get(ENDPOINTS.COUNSELOR_DASHBOARD.GET_COUNSELOR_PROFILE),
  getUniversities: () => mainClient.get(ENDPOINTS.UNIVERSITIES.LIST),

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

  uploadTranscript: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return mainClient.post(ENDPOINTS.STUDENT.UPLOAD_TRANSCRIPT, formData, {
      transformRequest: [(data, headers) => {
        delete headers['Content-Type'];
        return data;
      }],
    })
  },
}

export default profileApi

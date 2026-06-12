import { mainClient } from './apiClients'
import { ENDPOINTS } from './endpoints'

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

const profileApi = {
  getStudentProfile: () => mainClient.get(ENDPOINTS.STUDENT.PROFILE),

  updateUserProfile: (data: UpdateUserProfilePayload) =>
    mainClient.patch(ENDPOINTS.USERS.PROFILE, data),

  updateStudentProfile: (data: UpdateStudentProfilePayload) =>
    mainClient.patch(ENDPOINTS.STUDENT.PROFILE, data),
}

export default profileApi

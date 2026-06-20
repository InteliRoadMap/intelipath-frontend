import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const careerApi = {
  getCareerRoles: () => mainClient.get(ENDPOINTS.CAREER_ROLES.LIST),

  // REFACTOR: Use PATCH /student/profile instead of the deprecated PUT /student/target-career
  updateTargetCareer: (careerId: string) =>
    mainClient.patch(ENDPOINTS.STUDENT.PROFILE, { careerId })
}

export default careerApi

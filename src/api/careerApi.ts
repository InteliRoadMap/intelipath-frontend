import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"

const careerApi = {
  getCareerRoles: () => mainClient.get(ENDPOINTS.CAREER_ROLES.LIST),

  updateTargetCareer: (careerId: string) =>
    mainClient.put(ENDPOINTS.STUDENT.TARGET_CAREER, { careerId })
}

export default careerApi

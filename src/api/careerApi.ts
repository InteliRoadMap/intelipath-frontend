import { mainClient } from "./apiClients"
import { ENDPOINTS } from "./endpoints"
import type { CareerRole } from "@/features/student-dashboard/types"

type RawCareerRole = {
  careerId?: string
  career_id?: string
  id?: string
  careerName?: string
  career_name?: string
  name?: string
  prerequisite?: string
  description?: string
}

const unwrapResponse = <T>(responseData: unknown): T => {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    return (responseData as { data: T }).data
  }

  return responseData as T
}

const normalizeCareerRole = (career: RawCareerRole): CareerRole | null => {
  const careerId = career.careerId || career.career_id || career.id
  const careerName = career.careerName || career.career_name || career.name

  if (!careerId || !careerName) return null

  return {
    careerId,
    careerName,
    prerequisite: career.prerequisite,
    description: career.description
  }
}

const careerApi = {
  getCareerRoles: async (): Promise<CareerRole[]> => {
    const response = await mainClient.get(ENDPOINTS.CAREER_ROLES.LIST)
    const careers = unwrapResponse<RawCareerRole[]>(response.data)

    return Array.isArray(careers)
      ? careers
          .map(normalizeCareerRole)
          .filter((career): career is CareerRole => Boolean(career))
      : []
  },

  updateTargetCareer: async (careerId: string) => {
    const response = await mainClient.put(ENDPOINTS.STUDENT.TARGET_CAREER, { careerId })
    return unwrapResponse(response.data)
  }
}

export default careerApi

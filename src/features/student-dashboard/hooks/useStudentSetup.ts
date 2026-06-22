import { useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { isUuid } from "@/lib/utils"
import { studentDashboardService } from "../services/studentDashboardService"
import type { StudentSetupStep } from "../types"

// Add missing interface
interface SetupProfile {
  university?: string;
  yearOfAdmission?: string | number;
  year_of_admission?: string | number;
  major?: string;
  careerPath?: { id?: string };
  career?: {
    careerId?: string
    career_id?: string
    id?: string
  }
  careerId?: string
  career_id?: string
}

const getProfileCareerId = (profile: SetupProfile | null | undefined) =>
  profile?.careerId ||
  profile?.career_id ||
  profile?.career?.careerId ||
  profile?.career?.career_id ||
  profile?.career?.id ||
  ""

export function useStudentSetup(userId?: string) {
  const [activeSetupStep, setActiveSetupStep] = useState<StudentSetupStep>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    if (!userId) return

    let active = true

    const loadSetupStatus = async () => {
      try {
        const [profileResult, skillsResult] = await Promise.allSettled([
          studentDashboardService.getStudentProfile(),
          studentDashboardService.getSelectedSkills()
        ])

        if (!active) return

        const profileError = profileResult.status === "rejected" ? profileResult.reason : null
        const skillsError = skillsResult.status === "rejected" ? skillsResult.reason : null

        if (profileError && (!isAxiosError(profileError) || profileError.response?.status !== 404)) {
          throw profileError
        }
        if (skillsError && (!isAxiosError(skillsError) || skillsError.response?.status !== 404)) {
          throw skillsError
        }

        // Original: const profile = profileResult.status === "fulfilled" ? profileResult.value : null
        const profile = profileResult.status === "fulfilled" ? (profileResult.value as SetupProfile) : null
        const skills = skillsResult.status === "fulfilled" ? skillsResult.value : []
        const profileCareerId = getProfileCareerId(profile)
        const isProfileMissing =
          !profile?.university ||
          !(profile?.yearOfAdmission || profile?.year_of_admission) ||
          !profile?.major ||
          !isUuid(profileCareerId)

        if (isProfileMissing) {
          setActiveSetupStep("profile")
        } else if (!Array.isArray(skills) || skills.length === 0) {
          setActiveSetupStep("skills")
        } else {
          setActiveSetupStep(null)
        }
      } catch (error) {
        console.error("[Student Setup] Failed to check profile and skills:", error)
      } finally {
        if (active) setIsInitializing(false)
      }
    }

    void loadSetupStatus()

    return () => {
      active = false
    }
  }, [userId])

  return {
    activeSetupStep,
    isInitializing,
    openSkillSelection: () => setActiveSetupStep("skills"),
    completeSetup: () => setActiveSetupStep(null)
  }
}

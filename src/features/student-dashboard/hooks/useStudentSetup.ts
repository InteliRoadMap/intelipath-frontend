import { useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { skillApi, updateApi } from "@/api"
import type { StudentSetupStep } from "../types"

export function useStudentSetup(userId?: string) {
  const [activeSetupStep, setActiveSetupStep] = useState<StudentSetupStep>(null)

  useEffect(() => {
    if (!userId) return

    let active = true

    const loadSetupStatus = async () => {
      try {
        const [profileResult, skillsResult] = await Promise.allSettled([
          updateApi.getStudentProfile(),
          skillApi.getSelectedSkills()
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

        const profileResponse = profileResult.status === "fulfilled" ? profileResult.value.data : null
        const profile = profileResponse?.data ?? profileResponse
        const skills = skillsResult.status === "fulfilled" ? skillsResult.value : []
        const isProfileMissing =
          !profile?.university ||
          !(profile?.yearOfAdmission || profile?.year_of_admission) ||
          !profile?.major

        if (isProfileMissing) {
          setActiveSetupStep("profile")
        } else if (!Array.isArray(skills) || skills.length === 0) {
          setActiveSetupStep("skills")
        } else {
          setActiveSetupStep(null)
        }
      } catch (error) {
        console.error("[Student Setup] Failed to check profile and skills:", error)
      }
    }

    void loadSetupStatus()

    return () => {
      active = false
    }
  }, [userId])

  return {
    activeSetupStep,
    openSkillSelection: () => setActiveSetupStep("skills"),
    completeSetup: () => setActiveSetupStep(null)
  }
}

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
        // 1. Fetch profile first
        let profile: SetupProfile | null = null
        let profileError = false
        try {
          profile = await studentDashboardService.getStudentProfile() as SetupProfile
        } catch (err) {
          console.warn("[Student Setup] Profile fetch failed, assuming onboarding needed:", err)
          profileError = true
        }

        if (!active) return

        const profileCareerId = getProfileCareerId(profile)
        const isProfileMissing =
          profileError ||
          !profile ||
          !profile.university ||
          !(profile.yearOfAdmission || profile.year_of_admission) ||
          !profile.major ||
          !isUuid(profileCareerId)

        // If profile is missing, force profile onboarding immediately and DO NOT call getSelectedSkills()
        if (isProfileMissing) {
          setActiveSetupStep("profile")
          return
        }

        // 2. Only fetch Selected Skills if profile is already complete
        let skills: any = []
        let skillsError = false
        try {
          skills = await studentDashboardService.getSelectedSkills()
        } catch (err) {
          console.warn("[Student Setup] Skills fetch failed:", err)
          skillsError = true
        }

        if (!active) return

        const isSkillsMissing =
          skillsError ||
          !Array.isArray(skills) ||
          skills.length === 0

        if (isSkillsMissing) {
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
    goBackToProfile: () => setActiveSetupStep("profile"),
    completeSetup: () => setActiveSetupStep(null)
  }
}

import { useEffect, useState } from "react"
import profileApi from "../api/profileApi"
import { useAuth } from "../context/AuthContext"

export interface ProfileData {
  full_name: string
  yob: string
  bio: string
  email: string
  role: string
  // Student & Counselor
  university: string
  // Student
  major: string
  year_of_admission: string
  // Mentor
  company: string
  industry_focus: string
  // Counselor
  department: string
  // Common
  github_profile?: string
}

const EMPTY_PROFILE: ProfileData = {
  full_name: "",
  yob: "",
  bio: "",
  email: "",
  role: "Student",
  university: "",
  major: "",
  year_of_admission: "",
  company: "",
  industry_focus: "",
  department: "",
  githubProfile: ""
}

export function useProfileSettings() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData>(EMPTY_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      let data: any = {}
      if (user?.role?.toUpperCase() === "STUDENT") {
        const res = await updateApi.getStudentProfile()
        data = res.data
      } else if (user?.role?.toUpperCase() === "MENTOR") {
        const res = await updateApi.getMentorProfile()
        data = res.data
      } else if (user?.role?.toUpperCase() === "COUNSELOR") {
        const res = await updateApi.getCounselorProfile()
        data = res.data
      }

      setProfileData({
        ...EMPTY_PROFILE,
        ...user,
        ...data,
        email: data?.email || user?.email || "",
        role: data?.role || user?.role || "Student",
        major: data?.major || EMPTY_PROFILE.major,
        year_of_admission: data?.year_of_admission || ""
      })
    } catch (err) {
      console.error("[ProfileSettingsPage] Error fetching profile data:", err)
      setError("Cannot load profile information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProfile()
  }, [])

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const tasks: Promise<any>[] = [
        updateApi.updateUserProfile({
          full_name: profileData.full_name,
          yob: profileData.yob,
          bio: profileData.bio
        })
      ]

      if (user?.role?.toUpperCase() === "STUDENT") {
        tasks.push(
          updateApi.updateStudentProfile({
            university: profileData.university,
            yearOfAdmission: profileData.year_of_admission,
            major: profileData.major
          })
        )
      } else if (user?.role?.toUpperCase() === "MENTOR") {
        tasks.push(
          updateApi.updateMentorProfile({
            company: profileData.company,
            industryFocus: profileData.industry_focus
          })
        )
      } else if (user?.role?.toUpperCase() === "COUNSELOR") {
        tasks.push(
          updateApi.updateCounselorProfile({
            department: profileData.department,
            university: profileData.university
          })
        )
      }

      await Promise.all(tasks)

      alert("Saved successfully!")
    } catch (err) {
      console.error("[ProfileSettingsPage] Error saving profile:", err)
      setError("Save failed. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const displayInitial = profileData.full_name?.[0]?.toUpperCase() ?? "U"
  const role = profileData.role || user?.role || "Student"
  const githubName =
    profileData.githubProfile?.split("/").filter(Boolean).pop() ||
    profileData.full_name.split(" ").join("").toLowerCase() ||
    "user"

  return {
    profileData,
    loading,
    saving,
    error,
    handleChange,
    handleSave,
    loadProfile,
    displayInitial,
    role,
    githubName
  }
}

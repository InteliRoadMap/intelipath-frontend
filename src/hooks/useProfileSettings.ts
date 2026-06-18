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
  const [success, setSuccess] = useState<string | null>(null)

  const loadProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      let data: any = {}
      if (user?.role?.toUpperCase() === "STUDENT") {
        const res = await profileApi.getStudentProfile()
        data = res.data
      } else if (user?.role?.toUpperCase() === "MENTOR") {
        const res = await profileApi.getMentorProfile()
        data = res.data
      } else if (user?.role?.toUpperCase() === "COUNSELOR") {
        const res = await profileApi.getCounselorProfile()
        data = res.data
      }

      setProfileData({
        ...EMPTY_PROFILE,
        ...user,
        ...data,
        full_name: data?.fullName || user?.fullName || data?.full_name || "",
        email: data?.email || user?.email || "",
        role: data?.role || user?.role || "Student",
        major: data?.major || EMPTY_PROFILE.major,
        year_of_admission: data?.yearOfAdmission || data?.year_of_admission || ""
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
    setSuccess(null)

    try {
      const tasks: Promise<any>[] = [
        profileApi.updateUserProfile({
          fullName: profileData.full_name,
          yob: profileData.yob,
          bio: profileData.bio
        } as any)
      ]

      if (user?.role?.toUpperCase() === "STUDENT") {
        tasks.push(
          profileApi.updateStudentProfile({
            university: profileData.university,
            yearOfAdmission: profileData.year_of_admission,
            major: profileData.major
          })
        )
      } else if (user?.role?.toUpperCase() === "MENTOR") {
        tasks.push(
          profileApi.updateMentorProfile({
            company: profileData.company,
            industryFocus: profileData.industry_focus
          })
        )
      } else if (user?.role?.toUpperCase() === "COUNSELOR") {
        tasks.push(
          profileApi.updateCounselorProfile({
            department: profileData.department,
            university: profileData.university
          })
        )
      }

      await Promise.all(tasks)

      setSuccess("Profile saved successfully!")
      setTimeout(() => setSuccess(null), 4000)
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
    success,
    handleChange,
    handleSave,
    loadProfile,
    displayInitial,
    role,
    githubName
  }
}

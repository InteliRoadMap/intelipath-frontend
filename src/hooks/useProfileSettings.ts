import { useEffect, useState } from "react"
import updateApi from "../api/updateApi"
import { useAuth } from "../context/AuthContext"

export interface ProfileData {
  fullName: string
  yob: string
  bio: string
  email: string
  role: string
  university: string
  major: string
  year_of_admission: string
  githubProfile?: string
}

const EMPTY_PROFILE: ProfileData = {
  fullName: "",
  yob: "",
  bio: "",
  email: "",
  role: "Student",
  university: "",
  major: "Software Engineering",
  year_of_admission: "",
  githubProfile: ""
}

export function useProfileSettings() {
  const { user, updateUser } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData>(EMPTY_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      const studentRes = await updateApi.getUserInfo()
      const data = studentRes.data

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
      await Promise.all([
        updateApi.fillFormUser({
          fullName: profileData.fullName,
          yob: profileData.yob,
          bio: profileData.bio
        }),
        updateApi.fillFormUserAcademic({
          university: profileData.university,
          yearOfAdmission: profileData.year_of_admission,
          major: profileData.major
        })
      ])

      updateUser(profileData)
      alert("Saved successfully!")
    } catch (err) {
      console.error("[ProfileSettingsPage] Error saving profile:", err)
      setError("Save failed. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const displayInitial = profileData.fullName?.[0]?.toUpperCase() ?? "U"
  const role = profileData.role || user?.role || "Student"
  const githubName =
    profileData.githubProfile?.split("/").filter(Boolean).pop() ||
    profileData.fullName.split(" ").join("").toLowerCase() ||
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

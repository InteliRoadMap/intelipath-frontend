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
  universityId?: string
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
  universityId: "",
  major: "",
  year_of_admission: "",
  company: "",
  industry_focus: "",
  department: "",
  github_profile: ""
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

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    )

    try {
      let data: any = {}
      if (user?.role?.toUpperCase() === "STUDENT") {
        const res = await Promise.race([profileApi.getStudentProfile(), timeout])
        data = (res as any).data
      } else if (user?.role?.toUpperCase() === "MENTOR") {
        const res = await Promise.race([profileApi.getMentorProfile(), timeout])
        data = (res as any).data
      } else if (user?.role?.toUpperCase() === "COUNSELOR") {
        const res = await Promise.race([profileApi.getCounselorProfile(), timeout])
        data = (res as any).data
      }

      setProfileData({
        ...EMPTY_PROFILE,
        ...user,
        ...data,
        full_name: data?.fullName || data?.userInfo?.fullName || user?.fullName || data?.full_name || "",
        email: data?.email || data?.userInfo?.email || user?.email || "",
        role: data?.role || user?.role || "Student",
        major: data?.major || EMPTY_PROFILE.major,
        year_of_admission: data?.yearOfAdmission || data?.year_of_admission || "",
        universityId: data?.universityId || data?.userInfo?.universityId || "",
        industry_focus: data?.industryFocus || data?.industry_focus || "",
        bio: data?.bio || data?.userInfo?.bio || (user as any)?.bio || "",
        yob: (data?.yob || data?.userInfo?.yob || (user as any)?.yob || "")?.toString().split("T")[0] || ""
      })
    } catch (err) {
      console.warn("[ProfileSettingsPage] Cannot load profile (API may be offline):", err)
      // Fallback to user data from auth context so form still shows something
      setProfileData({
        ...EMPTY_PROFILE,
        full_name: user?.fullName || "",
        email: user?.email || "",
        role: user?.role || "Student"
      })
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

    if (profileData.yob) {
      const birthDate = new Date(profileData.yob)
      const today = new Date()
      if (birthDate >= today) {
        setError('Date of birth cannot be in the future.')
        setSaving(false)
        return
      } else if (today.getFullYear() - birthDate.getFullYear() < 10) {
        setError('You must be at least 10 years old.')
        setSaving(false)
        return
      }
    }

    if (user?.role?.toUpperCase() === "STUDENT" && profileData.year_of_admission && profileData.yob) {
      const birthDate = new Date(profileData.yob)
      const admissionDate = new Date(profileData.year_of_admission)
      if (admissionDate <= birthDate) {
        setError('Admission date must be after your date of birth.')
        setSaving(false)
        return
      } else if (admissionDate.getFullYear() - birthDate.getFullYear() < 10) {
        setError('Admission date seems too early based on your age.')
        setSaving(false)
        return
      }
    }

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
            universityId: profileData.universityId || profileData.university,
            yearOfAdmission: profileData.year_of_admission,
            major: profileData.major,
            // Original: careerId: "" 
            // Removed to prevent wiping out data
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
            universityId: profileData.universityId || profileData.university
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
    profileData.github_profile?.split("/").filter(Boolean).pop() ||
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

import { useEffect, useState } from "react"
import profileApi from "@/api/profileApi"
import { useAuth } from "@/context/AuthContext"

export interface ProfileData {
  full_name: string
  yob: string
  bio: string
  email: string
  role: string
  // Student (free text, display only)
  university: string
  /** Read-only, set by the backend: FPT accounts get the FPT curriculum and its material. */
  accountType?: "FPT" | "OTHER"
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
  avatar_url?: string
}

const EMPTY_PROFILE: ProfileData = {
  full_name: "",
  yob: "",
  bio: "",
  email: "",
  role: "Student",
  university: "",
  accountType: "OTHER",
  major: "",
  year_of_admission: "",
  company: "",
  industry_focus: "",
  department: "",
  github_profile: "",
  avatar_url: ""
}

/**
 * The form holds the admission year as text; the API stores it as an int. Returns null
 * for anything that isn't a plain year, so a half-typed field never reaches the wire.
 */
function parseAdmissionYear(raw: string): number | null {
  const trimmed = String(raw).trim()
  if (!/^\d{4}$/.test(trimmed)) return null
  return Number(trimmed)
}

export function useProfileSettings() {
  const { user, updateUser } = useAuth()
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
        const res = await Promise.race([
          profileApi.getStudentProfile(),
          timeout
        ])
        data = (res as any).data
      } else if (user?.role?.toUpperCase() === "MENTOR") {
        const res = await Promise.race([profileApi.getMentorProfile(), timeout])
        data = (res as any).data
      } else if (user?.role?.toUpperCase() === "COUNSELOR") {
        const res = await Promise.race([
          profileApi.getCounselorProfile(),
          timeout
        ])
        data = (res as any).data
      }

      setProfileData({
        ...EMPTY_PROFILE,
        ...user,
        ...data,
        full_name:
          data?.fullName ||
          data?.user?.fullName ||
          data?.userInfo?.fullName ||
          user?.fullName ||
          data?.full_name ||
          "",
        email:
          data?.email ||
          data?.user?.email ||
          data?.userInfo?.email ||
          user?.email ||
          "",
        role: data?.role || data?.user?.role || user?.role || "Student",
        major: data?.major || data?.student?.major || EMPTY_PROFILE.major,
        // The API sends the admission year as a number; the form is text.
        year_of_admission: String(
          data?.yearOfAdmission ??
            data?.year_of_admission ??
            data?.student?.yearOfAdmission ??
            ""
        ),
        university:
          data?.university ||
          data?.userInfo?.university ||
          data?.student?.university ||
          "",
        accountType: data?.accountType || data?.student?.accountType || "OTHER",
        department:
          data?.department || data?.academicCounselor?.department || "",
        industry_focus:
          data?.industryFocus ||
          data?.industry_focus ||
          data?.industryMentor?.industryFocus ||
          "",
        bio:
          data?.bio ||
          data?.user?.bio ||
          data?.userInfo?.bio ||
          (user as any)?.bio ||
          "",
        avatar_url:
          data?.avatarUrl ||
          data?.user?.avatarUrl ||
          data?.userInfo?.avatarUrl ||
          user?.avatarUrl ||
          "",
        yob:
          (
            data?.yob ||
            data?.user?.yob ||
            data?.userInfo?.yob ||
            (user as any)?.yob ||
            ""
          )
            ?.toString()
            .split("T")[0] || ""
      })
    } catch (err) {
      console.warn(
        "[ProfileSettingsPage] Cannot load profile (API may be offline):",
        err
      )
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
        setError("Date of birth cannot be in the future.")
        setSaving(false)
        return
      } else if (today.getFullYear() - birthDate.getFullYear() < 10) {
        setError("You must be at least 10 years old.")
        setSaving(false)
        return
      }
    }

    // A year, not a date: new Date(2023) reads 2023 as milliseconds since the epoch,
    // so comparing it against a real birth date rejected every valid year.
    const admissionYear = parseAdmissionYear(profileData.year_of_admission)

    if (user?.role?.toUpperCase() === "STUDENT" && profileData.year_of_admission) {
      const currentYear = new Date().getFullYear()
      if (
        admissionYear === null ||
        admissionYear < 1970 ||
        admissionYear > currentYear
      ) {
        setError(`Enter an admission year between 1970 and ${currentYear}.`)
        setSaving(false)
        return
      }
      if (profileData.yob) {
        const birthYear = new Date(profileData.yob).getFullYear()
        if (admissionYear <= birthYear) {
          setError("Year of admission must be after your year of birth.")
          setSaving(false)
          return
        } else if (admissionYear - birthYear < 10) {
          setError("Year of admission seems too early based on your age.")
          setSaving(false)
          return
        }
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
            universityName: profileData.university,
            yearOfAdmission: admissionYear,
            major: profileData.major
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
            department: profileData.department
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

  const handleAvatarUpload = async (file: File) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await profileApi.updateAvatar(file)
      // the backend returns the updated UserResponse, which has avatarUrl
      const updatedUser = res.data?.data || res.data
      const newUrl = updatedUser?.avatarUrl || ""

      setProfileData((prev) => ({ ...prev, avatar_url: newUrl }))
      updateUser({ avatarUrl: newUrl })
      setSuccess("Avatar updated successfully!")
      setTimeout(() => setSuccess(null), 4000)
    } catch (err) {
      console.error("[ProfileSettingsPage] Error uploading avatar:", err)
      setError("Failed to upload avatar. Please try again.")
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
    handleAvatarUpload,
    loadProfile,
    displayInitial,
    role,
    githubName
  }
}

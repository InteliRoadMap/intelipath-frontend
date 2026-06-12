import { useState } from "react"
import { isAxiosError } from "axios"
import profileApi from "../api/profileApi"
import { getErrorMessage } from "../lib/utils"
import { useAuth } from "../context/AuthContext"

export interface OnboardingErrors {
  fullName?: string
  yob?: string
  bio?: string
  university?: string
  yearOfAdmission?: string
  general?: string
}

export function useStudentOnboarding(isOpen: boolean, onClose?: () => void) {
  const { user } = useAuth()

  const [fullName, setFullName] = useState(user?.fullName || "")
  const [yob, setyob] = useState("")
  const [bio, setBio] = useState("")
  const [university, setUniversity] = useState("")
  const [yearOfAdmission, setYearOfAdmission] = useState("")
  const [major, setMajor] = useState("Software Engineering")
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<OnboardingErrors>({})
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (!fullName.trim()) {
      setErrors({ fullName: "Full Name is required" })
      return
    }
    setErrors({})
    setStep(2)
  }

  const handleClose = () => {
    setFullName("")
    setyob("")
    setBio("")
    setUniversity("")
    setYearOfAdmission("")
    setMajor("Software Engineering")
    setErrors({})
    setStep(1)
    setIsSaving(false)
    onClose?.()
  }

  const handleSave = async () => {
    setErrors({})
    setIsSaving(true)

    const currentErrors: typeof errors = {}

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors)
      setIsSaving(false)
      return
    }

    try {
      await profileApi.updateUserProfile({
        fullName,
        yob,
        bio
      })

      await profileApi.updateStudentProfile({
        university,
        yearOfAdmission: yearOfAdmission,
        major 
      })

      setStep(1)
      handleClose()
    } catch (err) {
      if (!isAxiosError(err) || !err.response) {
        setErrors({
          general: "Network error."
        })
      } else if (err.response.status === 400) {
        setErrors({
          general: err.response.data?.message || "Invalid input."
        })
      } else {
        setErrors({
          general: getErrorMessage(err)
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  return {
    user,
    fullName,
    setFullName,
    yob,
    setyob,
    bio,
    setBio,
    university,
    setUniversity,
    yearOfAdmission,
    setYearOfAdmission,
    major,
    setMajor,
    isSaving,
    errors,
    step,
    setStep,
    handleNext,
    handleSave,
    handleClose
  }
}

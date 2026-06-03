import { useState } from "react"
import { isAxiosError } from "axios"
import BaseModal from "../components/modals/BaseModal"
import {
  User,
  Mail,
  Calendar,
  Book,
  Building2,
  GraduationCap,
  ArrowRight,
  ChevronDown
} from "lucide-react"
import updateApi from "../api/updateApi"
import { getErrorMessage } from "../lib/utils"
import { useAuth } from "../context/AuthContext"

// 1. Types & Interfaces

interface StudentOnboardingModalProps {
  isOpen: boolean
  onClose?: () => void
}

interface OnboardingErrors {
  fullName?: string
  yob?: string
  bio?: string
  university?: string
  yearOfAdmission?: string
  general?: string
}

// 2. Main Component: StudentOnboardingModal

export default function StudentOnboardingModal({
  isOpen,
  onClose
}: StudentOnboardingModalProps) {
  // --- Hooks & State ---
  const { user } = useAuth() // Get the user data include:{name, email, role, fullName, yob, bio, university, yearOfAdmission, major}

  const [fullName, setFullName] = useState(user?.fullName || "")
  const [yob, setyob] = useState("")
  const [bio, setBio] = useState("")
  const [university, setUniversity] = useState("")
  const [yearOfAdmission, setYearOfAdmission] = useState("")
  const [major, setMajor] = useState("Software Engineering")
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<OnboardingErrors>({})
  const [step, setStep] = useState(1)

  // --- API Calls & Handlers ---

  // Move To Academic Step
  const handleNext = () => {
    if (!fullName.trim()) {
      setErrors({ fullName: "Full Name is required" })
      return
    }
    setErrors({})
    setStep(2)
  }

  // Save Onboarding Data
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
      // PATCH /api/v1/user/profile — JSON body: {fullName, yob, bio}
      await updateApi.fillFormUser({
        fullName,
        yob,
        bio
      })

      // PATCH /student/profile — JSON body: { university, yearOfAdmission, major }
      await updateApi.fillFormUserAcademic({
        university,
        yearOfAdmission: yearOfAdmission,
        major // hardcoded "Software Engineering" — vẫn cần gửi để Backend lưu
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

  // Reset Modal State
  const handleClose = () => {
    setFullName("")
    setyob("")
    setBio("")
    setUniversity("")
    setYearOfAdmission("")
    setMajor("")
    setErrors({})
    setStep(1)
    setIsSaving(false)
    onClose?.()
  }

  // --- Render logic ---

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} hideCloseButton={true}>
      <div className="p-8 sm:p-10 text-slate-900 w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="mb-2 flex items-center select-none">
            <span className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Inteli
              <span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">
                Path
              </span>
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              {step === 1
                ? "Complete Personal Information"
                : "Academic Details"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {step === 1
                ? "Lock-in credentials to personalize your cockpit"
                : "Help us tailor your learning experience"}
            </p>
          </div>
        </div>
        {/* General API error banner */}
        {errors.general && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {errors.general}
          </div>
        )}

        {/* Content Step 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <User className="w-3.5 h-3.5 text-brand-blue" />
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all placeholder-slate-400 shadow-sm"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <span className="text-rose-400 text-xs font-medium pl-1 leading-none">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-brand-blue" />
                  Auth Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed opacity-80"
                />
              </div>
            </div>

            {/* Year of Birth */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                Year of Birth
              </label>
              <input
                type="date"
                value={yob}
                onChange={(e) => setyob(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all shadow-sm"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Book className="w-3.5 h-3.5 text-brand-blue" />
                Bio / About Yourself
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all placeholder-slate-400 resize-none shadow-sm"
                placeholder="Tell us a little bit about yourself..."
              />
            </div>
          </div>
        )}

        {/* Content Step 2 */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* University */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-brand-blue" />
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all placeholder-slate-400 shadow-sm"
                placeholder="Enter your university name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Year of Admission */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                  Year of Admission
                </label>
                <input
                  type="date"
                  value={yearOfAdmission}
                  onChange={(e) => setYearOfAdmission(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all shadow-sm"
                />
              </div>

              {/* Major */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-blue" />
                  Major <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={major}
                    disabled
                    className="w-full bg-slate-50 cursor-not-allowed border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 appearance-none focus:outline-none transition-all shadow-sm"
                  >
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center gap-4">
          <div className="flex gap-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? "w-8 bg-brand-cyan" : "w-2 bg-slate-200"}`}
            ></div>
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? "w-8 bg-brand-cyan" : "w-2 bg-slate-200"}`}
            ></div>
          </div>

          <div className="flex gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}

            {step === 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-electric to-brand-cyan hover:brightness-110 shadow-lg shadow-brand-cyan/20 transition-all flex items-center gap-2 group"
              >
                Next Step
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-electric to-brand-cyan hover:brightness-110 shadow-lg shadow-brand-cyan/20 transition-all flex items-center gap-2 group"
              >
                {isSaving ? "Saving..." : "Saving Information"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, Search, UserRound } from 'lucide-react'
import { BaseModal } from '@/components/modals'
import { useAuth } from '@/context'
import { getErrorMessage, isUuid, toIsoDateOnly } from '@/lib/utils'
import { studentDashboardService } from '../services'
import type { CareerRole } from '../types'

interface StudentProfileSetupModalProps {
  isOpen: boolean
  onComplete: () => void
}

interface FormErrors {
  fullName?: string
  university?: string
  yearOfAdmission?: string
  major?: string
  careerId?: string
  general?: string
}

export default function StudentProfileSetupModal({
  isOpen,
  onComplete,
}: StudentProfileSetupModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [yob, setYob] = useState('')
  const [bio, setBio] = useState('')
  const [university, setUniversity] = useState('')
  const [yearOfAdmission, setYearOfAdmission] = useState('')
  const [major, setMajor] = useState('Software Engineering')
  const [careers, setCareers] = useState<CareerRole[]>([])
  const [careerId, setCareerId] = useState('')
  const [careerSearch, setCareerSearch] = useState('')
  const [careerCategory, setCareerCategory] = useState('All')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoadingCareers, setIsLoadingCareers] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const careerGroups = useMemo(() => {
    const groups = new Map<string, CareerRole[]>()
    careers.forEach((career) => {
      const category = getCareerCategory(career)
      groups.set(category, [...(groups.get(category) ?? []), career])
    })

    return [...groups.entries()]
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([category, items]) => ({ category, items }))
  }, [careers])

  const careerCategories = useMemo(
    () => ['All', ...careerGroups.map((group) => group.category)],
    [careerGroups],
  )

  const filteredCareerGroups = useMemo(() => {
    const query = careerSearch.trim().toLowerCase()

    return careerGroups
      .filter((group) => careerCategory === 'All' || group.category === careerCategory)
      .map((group) => ({
        ...group,
        items: group.items.filter((career) => {
          const searchable = [
            career.careerName,
            career.prerequisite,
            career.description,
            group.category,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return !query || searchable.includes(query)
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [careerCategory, careerGroups, careerSearch])

  useEffect(() => {
    if (!isOpen) return

    let active = true
    setIsLoadingCareers(true)
    studentDashboardService.getCareerRoles()
      .then((nextCareers) => {
        if (!active) return
        setCareers(nextCareers)
        setErrors((current) => ({ ...current, general: undefined }))
      })
      .catch((requestError) => {
        if (!active) return
        setCareers([])
        setErrors((current) => ({
          ...current,
          general: getErrorMessage(requestError)
        }))
      })
      .finally(() => {
        if (active) setIsLoadingCareers(false)
      })

    return () => {
      active = false
    }
  }, [isOpen])

  const goToAcademicStep = () => {
    const nextErrors: FormErrors = {}
    
    if (!fullName.trim()) {
      nextErrors.fullName = 'Enter your full name to continue.'
    }
    
    if (!yob) {
      nextErrors.yob = 'Select your date of birth.'
    } else {
      const birthDate = new Date(yob)
      const today = new Date()
      if (birthDate >= today) {
        nextErrors.yob = 'Date of birth cannot be in the future.'
      } else if (today.getFullYear() - birthDate.getFullYear() < 10) {
        nextErrors.yob = 'You must be at least 10 years old.'
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setStep(2)
  }

  const goToProfileStep = () => {
    setErrors({})
    setStep(1)
  }

  const handleSave = async () => {
    const nextErrors: FormErrors = {}
    const normalizedAdmissionDate = toIsoDateOnly(yearOfAdmission)
    if (!university.trim()) nextErrors.university = 'Enter your university.'
    
    if (!normalizedAdmissionDate) {
      nextErrors.yearOfAdmission = 'Select a valid admission date.'
    } else if (yob) {
      const birthDate = new Date(yob)
      const admissionDate = new Date(yearOfAdmission)
      if (admissionDate <= birthDate) {
        nextErrors.yearOfAdmission = 'Admission date must be after your date of birth.'
      } else if (admissionDate.getFullYear() - birthDate.getFullYear() < 10) {
        nextErrors.yearOfAdmission = 'Admission date seems too early based on your age.'
      }
    }
    
    if (!major.trim()) nextErrors.major = 'Enter your major.'
    if (!isUuid(careerId)) nextErrors.careerId = 'Select a valid target career from the list.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setIsSaving(true)
    try {
      await Promise.all([
        studentDashboardService.updateUserProfile({
          fullName: fullName.trim(),
          yob,
          bio: bio.trim(),
        }),
        studentDashboardService.updateStudentProfile({
          university: university.trim(),
          yearOfAdmission: normalizedAdmissionDate,
          major: major.trim(),
          careerId,
        })
      ])
      onComplete()
    } catch (requestError) {
      setErrors({ general: getErrorMessage(requestError) })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
      <div className="w-full max-w-3xl mx-auto bg-white rounded-[2rem] p-1.5 ring-1 ring-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] relative z-50 flex flex-col max-h-[85vh]">
        <div className="bg-[#FCFCFC] rounded-[calc(2rem-0.375rem)] flex flex-col overflow-hidden border border-black/[0.04] flex-1 min-h-0">
          <div className="px-6 py-5 md:px-8 md:py-6 border-b border-black/[0.04] text-center w-full shrink-0 bg-white">
            <h1 className="text-[24px] md:text-[28px] font-bold tracking-tight text-slate-900">
              {step === 1 ? 'Tell us about yourself' : 'Add your academic details'}
            </h1>
            <p className="mt-2 text-[15px] font-medium text-slate-500">
              We use this information to personalize your roadmap.
            </p>
            <div className="mt-6 flex justify-center gap-2" aria-label={`Step ${step} of 2`}>
              <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-black' : 'bg-slate-200'}`} />
              <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-black' : 'bg-slate-200'}`} />
            </div>
          </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 md:p-8 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          {errors.general && (
            <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50/50 px-5 py-4 text-[14px] font-medium text-rose-600 text-center">
              {errors.general}
            </div>
          )}

          {step === 1 ? (
            <section>
              <SectionTitle
                icon={<UserRound size={18} />}
                title="Personal information"
                description="Your email is connected to your login account and cannot be changed here."
              />

              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full name" required error={errors.fullName}>
                    <input
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value)
                        setErrors((current) => ({ ...current, fullName: undefined }))
                      }}
                      placeholder="Enter your full name"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Email">
                  <input
                    value={user?.email || ''}
                    disabled
                    className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`}
                  />
                </Field>

                <Field label="Date of birth" required error={errors.yob}>
                  <input
                    type="date"
                    value={yob}
                    onChange={(event) => {
                      setYob(event.target.value)
                      setErrors((current) => ({ ...current, yob: undefined }))
                    }}
                    className={inputClass}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Bio" hint={`${bio.length}/300 · Optional`}>
                    <textarea
                      value={bio}
                      onChange={(event) => setBio(event.target.value.slice(0, 300))}
                      rows={4}
                      placeholder="Share your interests, goals, or learning experience."
                      className={`${inputClass} h-auto min-h-28 resize-none py-4 leading-6 rounded-[24px]`}
                    />
                  </Field>
                </div>
              </div>
            </section>
          ) : (
            <section>
              <SectionTitle
                icon={<GraduationCap size={19} />}
                title="Academic information"
                description="This helps us recommend relevant skills and learning milestones."
              />

              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="University" required error={errors.university}>
                    <input
                      value={university}
                      onChange={(event) => {
                        setUniversity(event.target.value)
                        setErrors((current) => ({ ...current, university: undefined }))
                      }}
                      placeholder="Enter your university name"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Admission date" required error={errors.yearOfAdmission}>
                  <input
                    type="date"
                    value={yearOfAdmission}
                    onChange={(event) => {
                      setYearOfAdmission(event.target.value)
                      setErrors((current) => ({ ...current, yearOfAdmission: undefined }))
                    }}
                    className={inputClass}
                  />
                </Field>

                <Field label="Major" required error={errors.major}>
                  <input
                    value={major}
                    onChange={(event) => {
                      setMajor(event.target.value)
                      setErrors((current) => ({ ...current, major: undefined }))
                    }}
                    placeholder="Enter your major"
                    className={inputClass}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Target career" required error={errors.careerId}>
                    <div className="mt-2">
                      <div className="relative mb-6">
                        <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          value={careerSearch}
                          disabled={isLoadingCareers}
                          onChange={(event) => setCareerSearch(event.target.value)}
                          placeholder={isLoadingCareers ? 'Loading careers...' : 'Search by role, prerequisite, or description'}
                          className="w-full h-14 pl-14 pr-6 bg-white rounded-full border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-[15px] font-medium text-slate-900 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>

                      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
                        {careerCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setCareerCategory(category)}
                            className={`shrink-0 cursor-pointer rounded-full px-5 py-2 text-[13px] font-bold transition-colors ${
                              careerCategory === category
                                ? 'bg-black text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100 ring-1 ring-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-6 pb-2">
                        {filteredCareerGroups.length > 0 ? (
                          filteredCareerGroups.map((group) => (
                            <div key={group.category}>
                              <p className="mb-3 pl-1 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                                {group.category}
                              </p>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {group.items.map((career) => {
                                  const isSelected = careerId === career.careerId

                                  return (
                                    <button
                                      key={career.careerId}
                                      type="button"
                                      onClick={() => {
                                        setCareerId(career.careerId)
                                        setErrors((current) => ({ ...current, careerId: undefined }))
                                      }}
                                      className={`text-left p-5 rounded-2xl transition-all duration-300 ${
                                        isSelected
                                          ? 'bg-black shadow-[0_8px_20px_rgba(0,0,0,0.12)] scale-[1.01] ring-1 ring-black'
                                          : 'bg-white hover:bg-black/5 ring-1 ring-black/5'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className={`block text-[16px] font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                          {career.careerName}
                                        </span>
                                        {isSelected && (
                                          <span className="px-2 py-0.5 rounded border border-white/20 bg-white/10 text-[10px] font-bold text-white tracking-widest uppercase">
                                            Selected
                                          </span>
                                        )}
                                      </div>
                                      <span className={`line-clamp-2 block text-[13px] leading-relaxed ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                                        {career.prerequisite || career.description || 'Career roadmap from backend data.'}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-transparent px-4 py-12 text-center text-[15px] font-medium text-slate-500">
                            {isLoadingCareers ? 'Loading careers...' : 'No careers match your filters.'}
                          </div>
                        )}
                      </div>
                    </div>
                  </Field>
                </div>

                <div className="sm:col-span-2 mt-2 flex gap-3 rounded-md border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-slate-600">
                  <BookOpen className="mt-0.5 shrink-0 text-[#00767b]" size={17} />
                  You can update these details later from your profile settings.
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="px-6 py-5 md:px-8 border-t border-black/[0.04] bg-white w-full shrink-0 flex items-center justify-between">
          <button
            type="button"
            onClick={goToProfileStep}
            className={`text-[15px] font-bold text-slate-500 hover:text-slate-900 transition-colors ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            Back
          </button>

          <button
            type="button"
            onClick={step === 1 ? goToAcademicStep : handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-[15px] font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
          >
            {isSaving ? 'Saving...' : step === 1 ? 'Continue' : 'Save and continue'}
            {!isSaving && <ArrowRight size={18} />}
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full h-14 px-5 bg-white rounded-2xl border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-[15px] font-medium text-slate-900 placeholder:text-slate-400'

function getCareerCategory(career: CareerRole) {
  const text = `${career.careerName} ${career.prerequisite ?? ''} ${career.description ?? ''}`.toLowerCase()

  if (/(ai|machine learning|data|analyst|analytics|scientist)/.test(text)) return 'Data & AI'
  if (/(security|cyber|devops|cloud|network|system)/.test(text)) return 'Infrastructure'
  if (/(ui|ux|design|product|business|manager|marketing)/.test(text)) return 'Product & Design'
  if (/(mobile|android|ios|flutter|react native)/.test(text)) return 'Mobile'
  if (/(backend|java|spring|node|api|database)/.test(text)) return 'Backend'
  if (/(frontend|front-end|react|css|html|javascript|typescript|web)/.test(text)) return 'Frontend'

  return 'General'
}

function SectionTitle({
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <div>
        <h3 className="text-[18px] font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-[14px] text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2.5 flex items-center justify-between gap-3 text-[14px] font-bold text-slate-900">
        <span>
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
        {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  )
}

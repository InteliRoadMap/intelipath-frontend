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
    if (!fullName.trim()) {
      setErrors({ fullName: 'Enter your full name to continue.' })
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
    if (!normalizedAdmissionDate) nextErrors.yearOfAdmission = 'Select a valid admission date.'
    if (!major.trim()) nextErrors.major = 'Enter your major.'
    if (!isUuid(careerId)) nextErrors.careerId = 'Select a valid target career from the list.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setIsSaving(true)
    try {
      await studentDashboardService.updateUserProfile({
        fullName: fullName.trim(),
        yob,
        bio: bio.trim(),
      })
      await studentDashboardService.updateStudentProfile({
        university: university.trim(),
        yearOfAdmission: normalizedAdmissionDate,
        major: major.trim(),
        careerId,
      })
      onComplete()
    } catch (requestError) {
      setErrors({ general: getErrorMessage(requestError) })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <BaseModal isOpen={isOpen} hideCloseButton>
      <div className="flex min-h-[610px] flex-col">
        <header className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase text-[#00767b]">Student setup</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                {step === 1 ? 'Tell us about yourself' : 'Add your academic details'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                We use this information to personalize your roadmap.
              </p>
            </div>
            <span className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
              {step} of 2
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2" aria-label={`Step ${step} of 2`}>
            <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-[#00767b]' : 'bg-slate-200'}`} />
            <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-[#00767b]' : 'bg-slate-200'}`} />
          </div>
        </header>

        <div className="flex-1 px-6 py-6 sm:px-8">
          {errors.general && (
            <div className="mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
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

                <Field label="Date of birth">
                  <input
                    type="date"
                    value={yob}
                    onChange={(event) => setYob(event.target.value)}
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
                      className={`${inputClass} h-auto min-h-28 resize-none py-3 leading-6`}
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
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          value={careerSearch}
                          disabled={isLoadingCareers}
                          onChange={(event) => setCareerSearch(event.target.value)}
                          placeholder={isLoadingCareers ? 'Loading careers...' : 'Search by role, prerequisite, or description'}
                          className={`${inputClass} pl-9 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`}
                        />
                      </div>

                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {careerCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setCareerCategory(category)}
                            className={`shrink-0 cursor-pointer rounded-md border px-3 py-1.5 text-xs font-bold transition-colors ${
                              careerCategory === category
                                ? 'border-[#00767b] bg-cyan-50 text-[#006064]'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:text-slate-700'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 max-h-56 space-y-4 overflow-y-auto pr-1">
                        {filteredCareerGroups.length > 0 ? (
                          filteredCareerGroups.map((group) => (
                            <div key={group.category}>
                              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                {group.category}
                              </p>
                              <div className="grid gap-2 sm:grid-cols-2">
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
                                      className={`min-h-20 cursor-pointer rounded-md border p-3 text-left transition-all ${
                                        isSelected
                                          ? 'border-[#00767b] bg-cyan-50 ring-2 ring-[#00767b]/15'
                                          : 'border-slate-200 bg-slate-50 hover:border-cyan-200 hover:bg-white'
                                      }`}
                                    >
                                      <span className="block text-sm font-bold text-slate-900">
                                        {career.careerName}
                                      </span>
                                      <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">
                                        {career.prerequisite || career.description || 'Career roadmap from backend data.'}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
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

        <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={goToProfileStep}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={step === 1 ? goToAcademicStep : handleSave}
            disabled={isSaving}
            className="flex min-w-40 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#006064] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#007c82] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : step === 1 ? 'Continue' : 'Save and continue'}
            {!isSaving && <ArrowRight size={16} />}
          </button>
        </footer>
      </div>
    </BaseModal>
  )
}

const inputClass =
  'block h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#00767b] focus:ring-2 focus:ring-[#00767b]/15'

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
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-50 text-[#00767b]">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
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
      <span className="mb-1.5 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
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

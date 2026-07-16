import { useEffect, useMemo, useState } from 'react'
import { Check, LoaderCircle, Search } from 'lucide-react'
import { isUuid } from '@/lib/utils'
import { getSkillErrorMessage, studentDashboardService } from '../services'
import type { SkillItem } from '../types'
import OnboardingShell from './OnboardingShell'

interface StudentSkillSelectionModalProps {
  isOpen: boolean
  onComplete: () => void
  onBack?: () => void
}

const STEP_LABELS = ['Personal', 'Academic', 'Skills']

export default function StudentSkillSelectionModal({
  isOpen,
  onComplete,
  onBack,
}: StudentSkillSelectionModalProps) {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [searchResults, setSearchResults] = useState<SkillItem[]>([])
  const [hasSkillCatalog, setHasSkillCatalog] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    studentDashboardService.getSkills()
      .then(({ selectedSkills, skills: availableSkills }) => {
        setError('')
        setQuery('')
        setSelectedIds(selectedSkills.map((skill) => skill.skillId))
        setSkills(availableSkills)
        setHasSkillCatalog(availableSkills.length > 0)
      })
      .catch((requestError) => {
        setSkills([])
        setError(getSkillErrorMessage(requestError))
      })
      .finally(() => setIsLoading(false))
  }, [isOpen])

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (!isOpen || hasSkillCatalog || !normalizedQuery) return

    let active = true
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await studentDashboardService.searchSkills(normalizedQuery)
        if (!active) return
        setSearchResults(results)
        setError('')
      } catch (requestError) {
        if (!active) return
        setSearchResults([])
        setError(getSkillErrorMessage(requestError))
      } finally {
        if (active) setIsSearching(false)
      }
    }, 300)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [hasSkillCatalog, isOpen, query])

  const visibleSkills = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return skills

    const sourceSkills = hasSkillCatalog ? skills : searchResults
    return sourceSkills.filter((skill) =>
      skill.skillName.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [hasSkillCatalog, query, searchResults, skills])

  const toggleSkill = (skill: SkillItem) => {
    const isSelected = selectedIds.includes(skill.skillId)
    setSelectedIds((current) =>
      isSelected
        ? current.filter((id) => id !== skill.skillId)
        : [...current, skill.skillId],
    )
  }

  const handleSave = async () => {
    const uniqueSkillIds = [...new Set(selectedIds)]
    if (uniqueSkillIds.length === 0) {
      setError('Select at least one skill.')
      return
    }
    if (uniqueSkillIds.some((skillId) => !isUuid(skillId))) {
      setError('One or more selected skills have an invalid ID.')
      return
    }

    setError('')
    setIsSaving(true)
    try {
      const selectedSkills = await studentDashboardService.selectSkills(uniqueSkillIds)
      setSelectedIds(selectedSkills.map((skill) => skill.skillId))
      onComplete()
    } catch (requestError) {
      setError(getSkillErrorMessage(requestError))
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  const selectedCount = new Set(selectedIds).size

  return (
    <OnboardingShell
      step={3}
      totalSteps={3}
      stepLabels={STEP_LABELS}
      title="Select your current skills"
      subtitle="Your choices help build a roadmap at the right level."
      error={error}
      onBack={onBack}
      onNext={handleSave}
      nextLabel={isSaving ? 'Saving…' : selectedCount > 0 ? `Save ${selectedCount} skill${selectedCount > 1 ? 's' : ''}` : 'Save'}
      nextLoading={isSaving}
      nextDisabled={isLoading}
    >
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
        <input
          id="skill-search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value
            setQuery(nextQuery)
            if (!nextQuery.trim()) setIsSearching(false)
          }}
          placeholder="Search skills by name…"
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[15px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      <div className="mb-2 flex items-center justify-between px-0.5">
        <p className="text-[12.5px] font-medium text-slate-500">
          Tap every skill you already have — it tailors your roadmap level.
        </p>
        {selectedCount > 0 && (
          <span className="text-[12px] font-semibold text-indigo-600">{selectedCount} selected</span>
        )}
      </div>

      <div className="min-h-52 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent">
        {isLoading || isSearching ? (
          <div className="flex min-h-44 flex-col items-center justify-center gap-2 text-[13px] text-slate-400">
            <LoaderCircle className="h-6 w-6 animate-spin text-indigo-400" />
            <span>Loading skills…</span>
          </div>
        ) : visibleSkills.length === 0 ? (
          <div className="flex min-h-44 items-center justify-center px-4 text-center text-[14px] font-medium text-slate-400">
            {query.trim() ? `No skills found for "${query.trim()}".` : 'No skills available.'}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill) => {
              const selected = selectedIds.includes(skill.skillId)
              return (
                <button
                  key={skill.skillId}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ring-1 ${
                    selected
                      ? 'bg-indigo-600 text-white ring-indigo-600 shadow-[0_4px_12px_-4px_rgba(79,70,229,0.6)]'
                      : 'bg-white text-slate-600 ring-slate-200 hover:ring-slate-300 hover:text-slate-900'
                  }`}
                >
                  {selected && <Check size={13} />}
                  {skill.skillName}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </OnboardingShell>
  )
}

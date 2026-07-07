import { useEffect, useMemo, useState } from 'react'
import { Check, LoaderCircle, Search, ArrowRight } from 'lucide-react'
import { isUuid } from '@/lib/utils'
import { getSkillErrorMessage, studentDashboardService } from '../services'
import type { SkillItem } from '../types'

interface StudentSkillSelectionModalProps {
  isOpen: boolean
  onComplete: () => void
  onBack?: () => void
}

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
      <div className="w-full max-w-3xl mx-auto bg-white rounded-[2rem] p-1.5 ring-1 ring-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] relative z-50 flex flex-col max-h-[85vh]">
        <div className="bg-[#FCFCFC] rounded-[calc(2rem-0.375rem)] flex flex-col overflow-hidden border border-black/[0.04] flex-1 min-h-0">
          
          {/* Header matching Profile Setup */}
          <div className="px-6 py-5 md:px-8 md:py-6 border-b border-black/[0.04] text-center w-full shrink-0 bg-white">
            <h1 className="text-[24px] md:text-[28px] font-bold tracking-tight text-slate-900">
              Select your current skills
            </h1>
            <p className="mt-2 text-[15px] font-medium text-slate-500">
              Your choices help build a roadmap at the right level.
            </p>
            <div className="mt-6 flex justify-center gap-2" aria-label="Step 3 of 3">
              <div className="h-1.5 w-12 rounded-full bg-black" />
              <div className="h-1.5 w-12 rounded-full bg-black" />
              <div className="h-1.5 w-12 rounded-full bg-black" />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 md:p-8 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
            {error && (
              <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50/50 px-5 py-4 text-[14px] font-medium text-rose-600 text-center">
                {error}
              </div>
            )}

            {/* Search input styled exactly like target career search */}
            <div className="relative mb-6">
              <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                id="skill-search"
                value={query}
                onChange={(event) => {
                  const nextQuery = event.target.value
                  setQuery(nextQuery)
                  if (!nextQuery.trim()) setIsSearching(false)
                }}
                placeholder="Search skills by name..."
                className="w-full h-14 pl-14 pr-6 bg-white rounded-full border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-[15px] font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
            
            <p className="mb-4 text-[13px] text-slate-500 font-bold pl-1">
              Select every skill you already possess. This will tailor your roadmap level.
            </p>

            {/* Skills container matching career item grids container */}
            <div className="min-h-52 max-h-72 overflow-y-auto rounded-2xl border border-black/[0.06] bg-slate-50/50 p-6 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
              {isLoading || isSearching ? (
                <div className="flex min-h-44 flex-col items-center justify-center gap-2 text-sm text-slate-500">
                  <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
                  <span className="mt-2">Loading skills...</span>
                </div>
              ) : visibleSkills.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-transparent px-4 py-12 text-center text-[15px] font-medium text-slate-500">
                  {query.trim() ? `No skills found for "${query.trim()}".` : 'No skills available.'}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {visibleSkills.map((skill) => {
                    const selected = selectedIds.includes(skill.skillId)
                    return (
                      <button
                        key={skill.skillId}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-bold transition-colors ring-1 ${
                          selected
                            ? 'bg-black text-white ring-black shadow-[0_4px_12px_rgba(0,0,0,0.12)]'
                            : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 ring-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]'
                        }`}
                      >
                        {selected && <Check size={14} />}
                        {skill.skillName}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer matching Profile Setup */}
          <div className="px-6 py-5 md:px-8 border-t border-black/[0.04] bg-white w-full shrink-0 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className={`text-[15px] font-bold text-slate-500 hover:text-slate-900 transition-colors ${
                !onBack ? 'invisible' : ''
              }`}
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-[15px] font-bold text-white transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
            >
              {isSaving ? 'Saving...' : `Save ${selectedIds.length} selected skills`}
              {!isSaving && <ArrowRight size={18} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

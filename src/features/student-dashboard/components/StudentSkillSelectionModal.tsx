import { useEffect, useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import skillApi, { getSkillErrorMessage, type SkillItem } from '@/api/skillApi'
import { BaseModal } from '@/components/modals'

interface StudentSkillSelectionModalProps {
  isOpen: boolean
  onComplete: () => void
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default function StudentSkillSelectionModal({
  isOpen,
  onComplete,
}: StudentSkillSelectionModalProps) {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    skillApi.getSkills()
      .then(({ selectedSkills, skills: availableSkills }) => {
        setError('')
        setQuery('')
        setSelectedIds(selectedSkills.map((skill) => skill.skillId))
        setSkills(availableSkills)
      })
      .catch((requestError) => {
        setSkills([])
        setError(getSkillErrorMessage(requestError))
      })
      .finally(() => setIsLoading(false))
  }, [isOpen])

  const visibleSkills = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return skills

    return skills.filter((skill) =>
      skill.skillName.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [query, skills])

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
    if (uniqueSkillIds.some((skillId) => !UUID_PATTERN.test(skillId))) {
      setError('One or more selected skills have an invalid ID.')
      return
    }

    setError('')
    setIsSaving(true)
    try {
      const selectedSkills = await skillApi.selectSkills(uniqueSkillIds)
      setSelectedIds(selectedSkills.map((skill) => skill.skillId))
      onComplete()
    } catch (requestError) {
      setError(getSkillErrorMessage(requestError))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <BaseModal isOpen={isOpen} hideCloseButton>
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Select your current skills</h2>
        <p className="mt-1 text-sm text-slate-500">Your choices help build a roadmap at the right level.</p>

        {error && (
          <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="relative mt-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills by name..."
            className="w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/15"
          />
        </div>

        <div className="mt-4 min-h-52 max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-4">
          {isLoading ? (
            <p className="py-16 text-center text-sm text-slate-500">Loading skills...</p>
          ) : visibleSkills.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-500">
              {query.trim() ? `No skills found for "${query.trim()}".` : 'No skills available.'}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {visibleSkills.map((skill) => {
                const selected = selectedIds.includes(skill.skillId)
                return (
                  <button
                    key={skill.skillId}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold ${
                      selected
                        ? 'border-[#006064] bg-[#006064] text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#00838f]'
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

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="rounded-md bg-[#006064] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00838f] disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : `Save ${selectedIds.length} selected skills`}
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

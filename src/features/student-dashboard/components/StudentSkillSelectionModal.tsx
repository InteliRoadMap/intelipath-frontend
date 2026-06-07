import { useEffect, useMemo, useState } from 'react'
import { Check, LoaderCircle, Search } from 'lucide-react'
import skillApi, { getSkillErrorMessage, type SkillItem } from '@/api/skillApi'
import { BaseModal } from '@/components/modals'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input
} from '@/components'

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

    skillApi.getSkills()
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
        const results = await skillApi.searchSkills(normalizedQuery)
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
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">Select your current skills</CardTitle>
          <CardDescription>
            Your choices help build a roadmap at the right level.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="skill-search">Search skills</FieldLabel>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <Input
                  id="skill-search"
                  value={query}
                  onChange={(event) => {
                    const nextQuery = event.target.value
                    setQuery(nextQuery)
                    if (!nextQuery.trim()) setIsSearching(false)
                  }}
                  placeholder="Search skills by name..."
                  className="pl-9"
                />
              </div>
              <FieldDescription>
                Search only matches skill names. Select every skill you already have.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Available skills</FieldLabel>
              <div className="min-h-52 max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-4">
                {isLoading || isSearching ? (
                  <div className="flex min-h-44 items-center justify-center gap-2 text-sm text-slate-500">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Loading skills...
                  </div>
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
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                            selected
                              ? 'border-cyan-700 bg-cyan-700 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-600 hover:text-cyan-700'
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
            </Field>

            <Field>
              <Button
                type="button"
                variant="brand"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="ml-auto h-11 px-6"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  `Save ${selectedIds.length} selected skills`
                )}
              </Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </BaseModal>
  )
}

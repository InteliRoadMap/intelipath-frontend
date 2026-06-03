import { useEffect, useState } from "react"
import { Check, Search, Sparkles, X } from "lucide-react"

import skillApi from "../api/skillApi"
import BaseModal from "../components/modals/BaseModal"
import { useAuth } from "../context/AuthContext"

// 1. Types & Interfaces

interface SkillsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Skill {
  skillId: string
  skillName: string
  category?: string
}

// 2. Helper Functions

/**
 * Normalize API response skill data to Skill type array
 */
const normalizeSkills = (data: unknown): Skill[] => {
  if (Array.isArray(data)) return data as Skill[]
  if (
    data &&
    typeof data === "object" &&
    "skills" in data &&
    Array.isArray((data as { skills: unknown }).skills)
  ) {
    return (data as { skills: Skill[] }).skills
  }
  return []
}

// 3. Main Component: SkillAssessmentModal

export default function SkillsModal({ isOpen, onClose }: SkillsModalProps) {
  // --- Hooks & State ---
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // --- API Calls & Handlers ---

  // Load Student Skills
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true

    const fetchSkills = async () => {
      setIsLoading(true)
      try {
        const res = await skillApi.getSkills()
        if (isMounted) {
          setSkills(normalizeSkills(res.data))
        }
      } catch (error) {
        console.error("Error to get list of skills:", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSkills()

    return () => {
      isMounted = false
    }
  }, [isOpen])

  // Filter Skills By Search Query
  useEffect(() => {
    if (!isOpen) return

    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) return

    let isMounted = true
    const filterSkills = async () => {
      setIsLoading(true)
      try {
        const res = await skillApi.filterSkills(trimmedQuery)
        if (isMounted) {
          setSkills(normalizeSkills(res.data))
        }
      } catch (error) {
        console.error("Error to filter skill:", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    filterSkills()

    return () => {
      isMounted = false
    }
  }, [isOpen, searchQuery])

  // Toggle Selected Skill
  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    )
  }

  // Save Selected Skills
  const handleSave = async () => {
    if (selectedSkillIds.length === 0) {
      onClose()
      return
    }

    setIsSaving(true)
    try {
      const skillList = skills
        .filter((skill) => selectedSkillIds.includes(skill.skillId))
        .map((skill) => ({
          skillId: skill.skillId,
          skillName: skill.skillName,
          category: skill.category || ""
        }))

      await skillApi.selectSkills({ skillList })
      onClose()
    } catch (error) {
      console.error("Error to save skills:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // --- Render logic ---

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} hideCloseButton={false}>
      <div className="p-6 sm:p-8 text-slate-900 w-full max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-full animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center text-center gap-5 p-2 sm:p-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-3xl bg-gradient-to-br from-brand-electric to-brand-cyan flex items-center justify-center shadow-xl shadow-brand-cyan/30">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="w-full max-w-lg pt-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-3">
                Select Your Skills
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                Hey,{" "}
                <span className="font-semibold text-brand-blue">
                  {user?.fullName?.split(" ")[0] || "Student"}
                </span>
                , tell us what you already know! This helps us tailor your
                learning roadmap perfectly to your current level.
              </p>

              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills (e.g. Java, SQL)..."
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 mb-8 h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm">Loading skills...</p>
                  </div>
                ) : skills.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm">
                      No skills found matching "{searchQuery}"
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {skills.map((skill) => {
                      const isSelected = selectedSkillIds.includes(
                        skill.skillId
                      )
                      return (
                        <button
                          type="button"
                          key={skill.skillId}
                          onClick={() => toggleSkill(skill.skillId)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                            isSelected
                              ? "bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/20"
                              : "bg-white border-slate-200 text-slate-600 hover:border-brand-cyan hover:shadow-sm"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          {skill.skillName}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-electric to-brand-cyan hover:brightness-110 shadow-lg shadow-brand-cyan/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isSaving
                    ? "Saving..."
                    : `Update Skills (${selectedSkillIds.length} selected)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

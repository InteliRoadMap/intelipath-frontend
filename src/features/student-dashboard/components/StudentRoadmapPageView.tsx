import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  ArrowsClockwise,
  CheckCircle,
  Clock,
  LinkSimple,
  LockKey,
  MapTrifold,
  MagnifyingGlass,
  PencilSimple,
  Target,
  TreeStructure
} from "@phosphor-icons/react"
import { careerApi, roadmapApi, updateApi } from "@/api"
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Skeleton } from "@/components/ui"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import robotHead from "@/assets/robot/head.png"
import { useStudentSetup } from "../hooks"
import type { CareerRole, RoadmapNode, RoadmapNodeStatus, StudentRoadmap } from "../types"
import { AiMentorHistoryWidget } from "./StudentDashboardWidgets"
import StudentProfileSetupModal from "./StudentProfileSetupModal"
import StudentSkillSelectionModal from "./StudentSkillSelectionModal"
import StudentTopNav from "./StudentTopNav"

type RoadmapNodeWithDepth = RoadmapNode & {
  depth: number
}

type StudentProfileResponse = {
  careerId?: string
  career_id?: string
  careerName?: string
  career_name?: string
  career?: {
    careerId?: string
    career_id?: string
    id?: string
    careerName?: string
    career_name?: string
    name?: string
  }
}

const statusConfig: Record<
  RoadmapNodeStatus,
  {
    label: string
    badge: "success" | "info" | "default"
    icon: ReactNode
    cardClass: string
  }
> = {
  completed: {
    label: "Completed",
    badge: "success",
    icon: <CheckCircle size={18} weight="duotone" />,
    cardClass: "border-emerald-200 bg-emerald-50/40"
  },
  current: {
    label: "Current",
    badge: "info",
    icon: <Clock size={18} weight="duotone" />,
    cardClass: "border-cyan-300 bg-cyan-50/60 shadow-cyan-100"
  },
  locked: {
    label: "Locked",
    badge: "default",
    icon: <LockKey size={18} weight="duotone" />,
    cardClass: "border-slate-200 bg-white"
  }
}

const flattenNodes = (nodes: RoadmapNode[], depth = 0): RoadmapNodeWithDepth[] =>
  nodes.flatMap((node) => [
    { ...node, depth },
    ...flattenNodes(node.children, depth + 1)
  ])

const groupByDepth = (nodes: RoadmapNodeWithDepth[]) =>
  nodes.reduce<Record<number, RoadmapNodeWithDepth[]>>((groups, node) => {
    const key = node.level ?? node.depth
    groups[key] = [...(groups[key] ?? []), node]
    return groups
  }, {})

const getNodeLevelLabel = (node: RoadmapNodeWithDepth) => node.level ?? node.depth + 1

const getGroupLevelLabel = (
  level: number,
  groups: Record<number, RoadmapNodeWithDepth[]>
) => groups[level]?.some((node) => node.level !== undefined) ? level : level + 1

const unwrapProfile = (responseData: unknown): StudentProfileResponse | null => {
  if (!responseData || typeof responseData !== "object") return null
  if ("data" in responseData) return unwrapProfile((responseData as { data: unknown }).data)
  return responseData as StudentProfileResponse
}

const getProfileCareerId = (profile: StudentProfileResponse | null) =>
  profile?.careerId ||
  profile?.career_id ||
  profile?.career?.careerId ||
  profile?.career?.career_id ||
  profile?.career?.id ||
  null

const getProfileCareerName = (profile: StudentProfileResponse | null) =>
  profile?.careerName ||
  profile?.career_name ||
  profile?.career?.careerName ||
  profile?.career?.career_name ||
  profile?.career?.name

const RoadmapSkeleton = () => (
  <div className="grid gap-4 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="h-[190px]">
        <CardHeader className="gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
)

const RoadmapNodeCard = ({ node }: { node: RoadmapNodeWithDepth }) => {
  const config = statusConfig[node.status]

  return (
    <Card className={`relative min-h-[190px] transition-shadow hover:shadow-md ${config.cardClass}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-slate-500">
            {config.icon}
            <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
              Level {getNodeLevelLabel(node)}
            </span>
          </div>
          <Badge variant={config.badge}>{config.label}</Badge>
        </div>
        <CardTitle className="text-[18px] leading-6">{node.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-4">
        {node.description ? (
          <p className="line-clamp-2 text-[13px] leading-5 text-slate-600">{node.description}</p>
        ) : (
          <p className="text-[13px] leading-5 text-slate-400">Description will appear when backend sends it.</p>
        )}

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <LinkSimple size={15} weight="bold" />
            Resources
          </div>
          {node.resources.length ? (
            <div className="flex flex-wrap gap-2">
              {node.resources.slice(0, 3).map((resource) => (
                <a
                  key={`${node.id}-${resource.url}`}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 transition-colors hover:border-cyan-300 hover:text-cyan-700"
                >
                  {resource.title}
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-200 bg-white/70 px-3 py-2 text-[12px] font-medium text-slate-400">
              Resources will appear here.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const CareerSelector = ({
  careers,
  selectedCareerId,
  currentCareerId,
  searchValue,
  isSaving,
  errorMessage,
  onSearchChange,
  onSelectCareer,
  onSave,
  onCancel
}: {
  careers: CareerRole[]
  selectedCareerId: string
  currentCareerId: string | null
  searchValue: string
  isSaving: boolean
  errorMessage?: string
  onSearchChange: (value: string) => void
  onSelectCareer: (careerId: string) => void
  onSave: () => void
  onCancel?: () => void
}) => {
  const filteredCareers = careers.filter((career) =>
    career.careerName.toLowerCase().includes(searchValue.trim().toLowerCase())
  )

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white p-6 md:p-8">
        <p className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#00838f]">
          <Target size={17} weight="duotone" />
          Target Career Role
        </p>
        <h1 className="text-[30px] font-bold leading-tight text-slate-950 md:text-[42px]">
          Choose your roadmap path
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] font-medium leading-7 text-slate-500">
          Select one career role first. The roadmap will be generated from backend data for that career.
        </p>
      </div>

      <CardContent className="p-6 md:p-8">
        <div className="relative mb-5">
          <MagnifyingGlass
            size={18}
            weight="bold"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search career roles"
            className="h-11 pl-10"
          />
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="grid max-h-[430px] grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredCareers.map((career) => {
            const isSelected = selectedCareerId === career.careerId
            const isCurrent = currentCareerId === career.careerId

            return (
              <button
                key={career.careerId}
                type="button"
                onClick={() => onSelectCareer(career.careerId)}
                className={`min-h-[138px] rounded-lg border bg-white p-4 text-left transition-all hover:border-cyan-300 hover:shadow-sm ${
                  isSelected ? "border-[#00838f] ring-2 ring-[#00838f]/15" : "border-slate-200"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-[16px] font-bold leading-5 text-slate-950">{career.careerName}</h3>
                  {isCurrent && <Badge variant="info">Current</Badge>}
                </div>
                <p className="line-clamp-3 text-[13px] leading-5 text-slate-500">
                  {career.description || career.prerequisite || "Backend will provide description for this career role."}
                </p>
              </button>
            )
          })}
        </div>

        {!filteredCareers.length && (
          <div className="grid min-h-[180px] place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center">
            <p className="text-sm font-medium text-slate-500">No career roles found.</p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="button"
            variant="brand"
            disabled={!selectedCareerId || isSaving}
            onClick={onSave}
          >
            {isSaving ? "Generating..." : "Generate roadmap"}
            {!isSaving && <ArrowRight size={16} weight="bold" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StudentRoadmapPageView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false)
  const [careers, setCareers] = useState<CareerRole[]>([])
  const [careerSearch, setCareerSearch] = useState("")
  const [selectedCareerId, setSelectedCareerId] = useState("")
  const [currentCareerId, setCurrentCareerId] = useState<string | null>(null)
  const [currentCareerName, setCurrentCareerName] = useState<string | undefined>()
  const [isChangingCareer, setIsChangingCareer] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false)
  const [isSavingCareer, setIsSavingCareer] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [roadmapData, setRoadmapData] = useState<StudentRoadmap | null>(null)
  const { activeSetupStep, openSkillSelection, completeSetup } = useStudentSetup(user?.id)

  const levelGroups = useMemo(() => {
    const flattened = flattenNodes(roadmapData?.nodes ?? [])
    return groupByDepth(flattened)
  }, [roadmapData?.nodes])

  const levels = Object.keys(levelGroups)
    .map(Number)
    .sort((a, b) => a - b)

  const completedCount = useMemo(
    () => flattenNodes(roadmapData?.nodes ?? []).filter((node) => node.status === "completed").length,
    [roadmapData?.nodes]
  )

  const totalCount = useMemo(() => flattenNodes(roadmapData?.nodes ?? []).length, [roadmapData?.nodes])
  const progress = roadmapData?.progress ?? (totalCount ? Math.round((completedCount / totalCount) * 100) : 0)

  const loadRoadmap = async () => {
    setIsRoadmapLoading(true)
    setErrorMessage(undefined)
    try {
      const nextRoadmap = await roadmapApi.getStudentRoadmap()
      setRoadmapData(nextRoadmap)
    } catch (error) {
      console.error("[Student Roadmap] Failed to load roadmap:", error)
      setRoadmapData(null)
      setErrorMessage("Roadmap data is not available yet.")
    } finally {
      setIsRoadmapLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const loadInitialData = async () => {
      setIsInitialLoading(true)
      setErrorMessage(undefined)

      try {
        const [profileResult, careersResult] = await Promise.allSettled([
          updateApi.getStudentProfile(),
          careerApi.getCareerRoles()
        ])

        if (!active) return

        const nextCareers = careersResult.status === "fulfilled" ? careersResult.value : []
        setCareers(nextCareers)

        const profile = profileResult.status === "fulfilled"
          ? unwrapProfile(profileResult.value.data)
          : null
        const profileCareerId = getProfileCareerId(profile)
        const profileCareerName = getProfileCareerName(profile)

        if (profileCareerId) {
          setCurrentCareerId(profileCareerId)
          setSelectedCareerId(profileCareerId)
          setCurrentCareerName(
            profileCareerName ||
            nextCareers.find((career) => career.careerId === profileCareerId)?.careerName
          )
          await loadRoadmap()
        } else {
          setCurrentCareerId(null)
          setSelectedCareerId("")
          setRoadmapData(null)
        }
      } catch (error) {
        if (!active) return
        console.error("[Student Roadmap] Failed to load initial data:", error)
        setErrorMessage("Cannot load career roles right now.")
      } finally {
        if (active) setIsInitialLoading(false)
      }
    }

    loadInitialData()

    return () => {
      active = false
    }
  }, [])

  const handleSaveCareer = async () => {
    const career = careers.find((item) => item.careerId === selectedCareerId)
    if (!career) {
      setErrorMessage("Select a target career role first.")
      return
    }

    setIsSavingCareer(true)
    setErrorMessage(undefined)
    try {
      await careerApi.updateTargetCareer(career.careerId)
      setCurrentCareerId(career.careerId)
      setCurrentCareerName(career.careerName)
      setIsChangingCareer(false)
      await loadRoadmap()
    } catch (error) {
      console.error("[Student Roadmap] Failed to update target career:", error)
      setErrorMessage("Cannot update target career right now.")
    } finally {
      setIsSavingCareer(false)
    }
  }

  const showCareerSelector = !currentCareerId || isChangingCareer

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="relative min-h-screen bg-[#f8fafc] pb-20 font-sans text-slate-900">
      <StudentTopNav
        user={user}
        onLogout={handleLogout}
        onOpenAiMentor={() => setIsAiMentorOpen(true)}
      />

      <main className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-8 px-4 py-8 md:px-8 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-hidden">
            <p className="mb-4 text-[13px] font-medium text-slate-400">Roadmap</p>
            <nav className="space-y-1.5">
              {showCareerSelector ? (
                <a href="#choose-career" className="block rounded-md bg-slate-100 px-3 py-2 text-[14px] font-semibold text-slate-950">
                  Target Career
                </a>
              ) : (
                <>
                  <a href="#overview" className="block rounded-md bg-slate-100 px-3 py-2 text-[14px] font-semibold text-slate-950">
                    Overview
                  </a>
                  {levels.map((level) => (
                    <a
                      key={level}
                      href={`#level-${level}`}
                      className="block rounded-md px-3 py-2 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    >
                      Level {getGroupLevelLabel(level, levelGroups)}
                    </a>
                  ))}
                </>
              )}
            </nav>
          </div>
        </aside>

        <section className="min-w-0">
          {isInitialLoading ? (
            <RoadmapSkeleton />
          ) : showCareerSelector ? (
            <div id="choose-career" className="scroll-mt-28">
              <CareerSelector
                careers={careers}
                selectedCareerId={selectedCareerId}
                currentCareerId={currentCareerId}
                searchValue={careerSearch}
                isSaving={isSavingCareer}
                errorMessage={errorMessage}
                onSearchChange={setCareerSearch}
                onSelectCareer={setSelectedCareerId}
                onSave={handleSaveCareer}
                onCancel={currentCareerId ? () => {
                  setSelectedCareerId(currentCareerId)
                  setIsChangingCareer(false)
                  setErrorMessage(undefined)
                } : undefined}
              />
            </div>
          ) : (
            <>
          <div id="overview" className="mb-6 scroll-mt-28 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#00838f]">
                  <MapTrifold size={17} weight="duotone" />
                  Dynamic Roadmap
                </p>
                <h1 className="text-[30px] font-bold leading-tight text-slate-950 md:text-[42px]">
                  {roadmapData?.targetCareerRole || currentCareerName || "Your target career roadmap"}
                </h1>
                <p className="mt-3 text-[15px] font-medium leading-7 text-slate-500">
                  Follow the prioritized learning path, open curated resources, and track completion as backend progress data arrives.
                </p>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[320px]">
                <Card className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-slate-500">
                      <Target size={17} weight="duotone" />
                      Progress
                    </span>
                    <span className="text-[24px] font-bold text-slate-950">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#00838f]" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-3 text-[12px] font-medium text-slate-500">
                    {completedCount} of {totalCount} nodes completed
                  </p>
                </Card>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCareerId(currentCareerId || "")
                    setCareerSearch("")
                    setIsChangingCareer(true)
                  }}
                >
                  <PencilSimple size={16} weight="bold" />
                  Change career
                </Button>
              </div>
            </div>
          </div>

          {isRoadmapLoading ? (
            <RoadmapSkeleton />
          ) : errorMessage || !levels.length ? (
            <Card className="grid min-h-[360px] place-items-center p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
                  <TreeStructure size={24} weight="duotone" />
                </div>
                <h2 className="text-[22px] font-bold text-slate-950">Roadmap data is not available yet.</h2>
                <p className="mt-3 text-[14px] leading-6 text-slate-500">
                  Backend should return nodes for <span className="font-semibold text-slate-700">GET /student/roadmap</span> after target career is selected.
                </p>
                <Button type="button" variant="outline" className="mt-5" onClick={loadRoadmap}>
                  <ArrowsClockwise size={16} weight="bold" />
                  Retry
                </Button>
              </div>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid min-w-[960px] auto-cols-[minmax(280px,1fr)] grid-flow-col gap-5">
                {levels.map((level, index) => (
                  <section key={level} id={`level-${level}`} className="scroll-mt-28">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Phase {index + 1}
                        </p>
                        <h2 className="text-[18px] font-bold text-slate-950">
                          Level {getGroupLevelLabel(level, levelGroups)}
                        </h2>
                      </div>
                      {index < levels.length - 1 && (
                        <ArrowRight size={20} weight="bold" className="text-slate-300" />
                      )}
                    </div>

                    <div className="space-y-4">
                      {levelGroups[level].map((node) => (
                        <RoadmapNodeCard key={node.id} node={node} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </section>
      </main>

      <button
        type="button"
        onClick={() => setIsAiMentorOpen(true)}
        className="ai-mentor-float fixed bottom-5 right-4 z-50 flex h-20 w-20 items-center justify-center bg-transparent p-0 transition-all hover:-translate-y-1 sm:bottom-6 sm:right-6 sm:h-24 sm:w-24 xl:h-28 xl:w-28"
        title="Ask AI Mentor"
      >
        <img src={robotHead} alt="Ask AI Mentor" className="h-full w-full object-contain drop-shadow-xl" />
      </button>

      {isAiMentorOpen && (
        <>
          <button
            type="button"
            aria-label="Close AI Mentor"
            onClick={() => setIsAiMentorOpen(false)}
            className="fixed inset-0 z-[60] bg-slate-950/25 backdrop-blur-[1px]"
          />
          <aside className="fixed inset-x-3 bottom-3 top-20 z-[70] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[min(680px,calc(100vh-3rem))] sm:w-[420px]">
            <AiMentorHistoryWidget onClose={() => setIsAiMentorOpen(false)} />
          </aside>
        </>
      )}

      <StudentProfileSetupModal isOpen={activeSetupStep === "profile"} onComplete={openSkillSelection} />
      {activeSetupStep === "skills" && (
        <StudentSkillSelectionModal isOpen onComplete={completeSetup} />
      )}
    </div>
  )
}

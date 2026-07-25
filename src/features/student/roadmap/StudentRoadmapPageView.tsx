import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ReactFlowProvider } from '@xyflow/react'
import {
  ArrowRight,
  ArrowUpRight,
  ArrowsClockwise,
  BookOpen,
  Check,
  CheckCircle,
  Clock,
  CaretDown,
  GitFork,
  GraduationCap,
  LinkSimple,
  LockKey,
  MapTrifold,
  MagnifyingGlass,
  Palette,
  PencilSimple,
  Target,
  TreeStructure,
  X,
  YoutubeLogo
} from "@phosphor-icons/react"
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, SharedAppBackground, Input, RouteProgressBar } from "@/components/ui"
import { useAuth } from "@/context"
import { isUuid, formatPrerequisite } from "@/lib/utils"
import { ROUTES } from "@/shared"
import { useStudentSetup } from "../hooks"
import { studentDashboardService } from "../services"
import type { CareerRole, NodeSelection, StudentRoadmap } from "../types"
import ConfirmModal from "@/components/modals/ConfirmModal"
import StudentProfileSetupModal from "@/features/student/onboarding/StudentProfileSetupModal"
import StudentSkillSelectionModal from "@/features/student/onboarding/StudentSkillSelectionModal"
import StudentHeader from "@/features/student/common/StudentHeader"
import { RoadmapVectorGraph } from "./RoadmapVectorGraph"
import RoadmapRecommendationsPanel from "./RoadmapRecommendationsPanel"
import FptCurriculumPanel from "@/features/student/courses/FptCurriculumPanel"
import StageLegend from "./StageLegend"
import ResourceViewerModal, { getYouTubeId, type ViewerResource } from "./ResourceViewerModal"
import { getStageStyle } from "../lib/stageColors"

gsap.registerPlugin(useGSAP)

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

const unwrapProfile = (responseData: unknown): StudentProfileResponse | null => {
  if (!responseData || typeof responseData !== "object") return null
  if ("data" in responseData) return unwrapProfile((responseData as { data: unknown }).data)
  return responseData as StudentProfileResponse
}

const getProfileCareerId = (profile: StudentProfileResponse | null) =>
  [
    profile?.careerId,
    profile?.career_id,
    profile?.career?.careerId,
    profile?.career?.career_id,
    profile?.career?.id
  ].find((careerId): careerId is string => Boolean(careerId && isUuid(careerId))) || null

const getProfileCareerName = (profile: StudentProfileResponse | null) =>
  profile?.careerName ||
  profile?.career_name ||
  profile?.career?.careerName ||
  profile?.career?.career_name ||
  profile?.career?.name

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
    <div className="roadmap-gsap-panel w-full max-w-3xl mx-auto bg-white rounded-[2rem] p-1.5 ring-1 ring-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] relative z-50 flex flex-col max-h-[75vh]">
      <div className="bg-[#FCFCFC] rounded-[calc(2rem-0.375rem)] flex flex-col overflow-hidden border border-black/[0.04] flex-1 min-h-0">
        
        {/* Header section */}
        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-black/[0.04] text-center w-full shrink-0 bg-white">
           <h1 className="text-[24px] md:text-[28px] font-bold tracking-tight text-slate-900">
             Change Career Path
           </h1>
        </div>

        <div className="p-6 md:p-8 flex-1 min-h-0 flex flex-col">
          {/* Search bar */}
          <div className="relative mb-6 shrink-0">
            <MagnifyingGlass size={20} weight="light" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search available career roles..."
              className="w-full h-14 pl-14 pr-6 bg-white rounded-full border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-[15px] font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {errorMessage && (
            <div className="mb-6 max-w-xl mx-auto rounded-xl border border-rose-100 bg-rose-50/50 px-5 py-4 text-[14px] font-medium text-rose-600 text-center">
              {errorMessage}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-2 pb-2">
            {filteredCareers.map(career => {
               const isSelected = selectedCareerId === career.careerId;
               const isCurrent = currentCareerId === career.careerId;
               return (
                 <button
                   key={career.careerId}
                   type="button"
                   onClick={() => onSelectCareer(career.careerId)}
                   className={`text-left p-1 rounded-2xl transition-all duration-300
                     ${isSelected ? 'bg-black shadow-[0_8px_20px_rgba(0,0,0,0.12)] scale-[1.01] ring-1 ring-black' : 'bg-transparent hover:bg-black/5'}
                   `}
                 >
                   <div className={`w-full h-full min-h-[100px] rounded-[calc(1rem-0.25rem)] p-4 flex flex-col transition-colors duration-300
                     ${isSelected ? 'bg-[#111]' : 'bg-white shadow-sm ring-1 ring-black/[0.04]'}
                   `}>
                      <div className="flex items-center justify-between gap-3 mb-2">
                         <h3 className={`text-[14px] font-bold tracking-tight transition-colors
                           ${isSelected ? 'text-white' : 'text-slate-900'}
                         `}>{career.careerName}</h3>
                         {isCurrent && (
                           <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded flex-shrink-0
                             ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}
                           `}>Current</span>
                         )}
                      </div>
                      <p className={`text-[12px] leading-relaxed line-clamp-2 mt-auto transition-colors
                        ${isSelected ? 'text-white/60' : 'text-slate-500'}
                      `}>
                        {career.description || formatPrerequisite(career.prerequisite) || 'Select to view roadmap.'}
                      </p>
                   </div>
                 </button>
               )
            })}
            
            {!filteredCareers.length && (
              <div className="col-span-full min-h-[160px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                <p className="text-[14px] font-medium text-slate-500">No career roles found.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-black/[0.04]">
             {onCancel && (
               <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">Cancel</button>
             )}
             <button
               type="button"
               disabled={!selectedCareerId || isSaving}
               onClick={onSave}
               className={`group flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl transition-all active:scale-[0.98] ${!selectedCareerId ? 'opacity-40 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
             >
               <span className="text-[13px] font-semibold">
                 {isSaving ? "Saving..." : "Confirm"}
               </span>
               {!isSaving && <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Friendly source names for common resource domains; falls back to the hostname.
const KNOWN_SOURCES: Record<string, string> = {
  "roadmap.sh": "roadmap.sh",
  "developer.mozilla.org": "MDN Web Docs",
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "github.com": "GitHub",
  "freecodecamp.org": "freeCodeCamp",
  "cloudflare.com": "Cloudflare",
  "w3schools.com": "W3Schools",
  "aws.amazon.com": "AWS Docs",
  "learn.microsoft.com": "Microsoft Learn",
  "postgresql.org": "PostgreSQL Docs",
  "redis.io": "Redis Docs",
  "docs.docker.com": "Docker Docs",
  "kubernetes.io": "Kubernetes Docs",
}

// Derive a readable label + short path from a raw resource URL.
const getLinkMeta = (raw: string): { label: string; path: string } => {
  try {
    const u = new URL(raw)
    const host = u.hostname.replace(/^www\./, "")
    return { label: KNOWN_SOURCES[host] || host, path: (host + u.pathname).replace(/\/$/, "") }
  } catch {
    return { label: raw, path: raw }
  }
}

export default function StudentRoadmapPageView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement>(null)
  // Phone only: the tools stack starts folded so the canvas is what you land on.
  // Above `sm` the CSS shows the stack regardless and this never comes into play.
  const [controlsOpen, setControlsOpen] = useState(false)
  const [careers, setCareers] = useState<CareerRole[]>([])
  const [careerSearch, setCareerSearch] = useState("")
  const [selectedCareerId, setSelectedCareerId] = useState("")
  const [currentCareerId, setCurrentCareerId] = useState<string | null>(null)
  const [currentCareerName, setCurrentCareerName] = useState<string | undefined>()
  const [isChangingCareer, setIsChangingCareer] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false)
  const [isSavingCareer, setIsSavingCareer] = useState(false)
  const [themeColor, setThemeColor] = useState('cyan')
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [roadmapData, setRoadmapData] = useState<StudentRoadmap | null>(null)
  // Bumped after an FPT-subject save so the recommendations panel reloads.
  const [recsRefresh, setRecsRefresh] = useState(0)
  // Right-docked FPT curriculum panel (blends into background like node detail).
  const [showFptPanel, setShowFptPanel] = useState(false)
  // Only FPT accounts are offered the FPT curriculum and its material. The backend
  // enforces this too (null fptCoverage, 403 on the curriculum endpoints); this flag
  // just keeps the UI from advertising what it would refuse.
  const [isFptAccount, setIsFptAccount] = useState(false)
  
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null)
  // Resource currently open in the smart viewer modal.
  const [activeResource, setActiveResource] = useState<ViewerResource | null>(null)
  const [isUpdatingNode, setIsUpdatingNode] = useState(false);
  const [optimisticStatusMap, setOptimisticStatusMap] = useState<Record<string, string>>({});

  // Choose-one selections (which alternative is picked in each CHOOSE_ONE group).
  const [selections, setSelections] = useState<NodeSelection[]>([]);
  const [pendingChoice, setPendingChoice] = useState<any | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  // Node awaiting a "mark as completed" confirmation.
  const [pendingComplete, setPendingComplete] = useState<any | null>(null);
  const chosenNodeIds = useMemo(
    () => new Set(selections.map(s => s.chosenNodeId)),
    [selections]
  );
  const roadmapProgress = Math.max(0, Math.min(100, Math.round(roadmapData?.progress ?? 0)));

  const { activeSetupStep, openSkillSelection, goBackToProfile, completeSetup } = useStudentSetup(user?.id)

  const loadSelections = async () => {
    try {
      setSelections(await studentDashboardService.getRoadmapSelections())
    } catch (error) {
      console.error("[Student Roadmap] Failed to load selections:", error)
      setSelections([])
    }
  }

  const loadRoadmap = async () => {
    setIsRoadmapLoading(true)
    setErrorMessage(undefined)
    try {
      const [nextRoadmap] = await Promise.all([
        studentDashboardService.getStudentRoadmap(),
        loadSelections(),
      ])
      setRoadmapData(nextRoadmap)
    } catch (error) {
      console.error("[Student Roadmap] Failed to load roadmap:", error)
      setRoadmapData(null)
      setErrorMessage("Roadmap data is not available yet.")
    } finally {
      setIsRoadmapLoading(false)
    }
  }

  // Commit a choice: pick this alternative within its CHOOSE_ONE group, then
  // refetch (statuses, progress and greyed alternatives all move server-side).
  const confirmChoice = async () => {
    if (!pendingChoice || isSelecting) return;
    const groupNodeId = pendingChoice.parentNodeId;
    if (!groupNodeId) { setPendingChoice(null); return; }
    setIsSelecting(true);
    try {
      await studentDashboardService.selectAlternative(groupNodeId, pendingChoice.id);
      await loadRoadmap();
      setOptimisticStatusMap({});
      // Reflect the pick immediately in the open detail panel.
      setSelectedNodeData((prev: any) => prev ? { ...prev, isChosen: true } : prev);
      setPendingChoice(null);
    } catch (error) {
      console.error("[Student Roadmap] Failed to select alternative:", error);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleUpdateNodeStatus = async (newStatus: string) => {
    if (!selectedNodeData || isUpdatingNode) return;
    const prevStatus = selectedNodeData.status; // Added to prevent ReferenceError
    setIsUpdatingNode(true);
    try {
      // 1. Gửi request lên Backend (nếu lỗi sẽ văng xuống catch)
      await studentDashboardService.updateNodeProgress(selectedNodeData.id, newStatus);
      
      // 2. Cập nhật lạc quan (Optimistic Update)
      setSelectedNodeData({ ...selectedNodeData, status: newStatus });
      if (roadmapData && roadmapData.nodes) {
        const updatedNodes = roadmapData.nodes.map(node => 
          node.id === selectedNodeData.id ? { ...node, status: newStatus as any } : node
        );
        setRoadmapData({ ...roadmapData, nodes: updatedNodes });
      }
      setOptimisticStatusMap(prev => ({ ...prev, [selectedNodeData.id]: newStatus }));
      
      console.log(
        newStatus === 'completed' 
          ? 'Node marked as completed!' 
          : 'Node marked as in progress'
      );

      // 3. Gọi ngầm Backend để lấy cây Roadmap mới nhất (đã được tính toán Auto-Unlock)
      studentDashboardService.getStudentRoadmap().then(freshData => {
        if (freshData) {
          setRoadmapData(freshData);
          // Xóa map lạc quan vì data thật đã về
          setOptimisticStatusMap({});
        }
      }).catch(err => console.error("Background sync failed", err));

    } catch (error) {
      console.error("Failed to update node status", error);
      setSelectedNodeData(prev => prev ? { ...prev, status: prevStatus } : null);
      setOptimisticStatusMap(prev => {
        const newMap = { ...prev };
        delete newMap[selectedNodeData.id];
        return newMap;
      });
    } finally {
      setIsUpdatingNode(false);
    }
  };

  useEffect(() => {
    let active = true

    const loadInitialData = async () => {
      setIsInitialLoading(true)
      setErrorMessage(undefined)

      try {
        const [profileResult, careersResult] = await Promise.allSettled([
          studentDashboardService.getStudentProfile(),
          studentDashboardService.getCareerRoles()
        ])

        if (!active) return

        const nextCareers = careersResult.status === "fulfilled" ? careersResult.value : []
        setCareers(nextCareers)

        const profile = profileResult.status === "fulfilled"
          ? unwrapProfile(profileResult.value)
          : null
        const profileCareerId = getProfileCareerId(profile)
        const profileCareerName = getProfileCareerName(profile)
        setIsFptAccount((profile as any)?.accountType === "FPT")

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
    if (!isUuid(career.careerId)) {
      setErrorMessage("Selected career has an invalid backend ID.")
      return
    }

    setIsSavingCareer(true)
    setErrorMessage(undefined)
    try {
      await studentDashboardService.updateTargetCareer(career.careerId)
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

  const closePopover = () => {
    setSelectedNodeData(null)
  }

  const handleNodeClick = async (nodeData: any) => {
    setShowFptPanel(false)
    setSelectedNodeData(nodeData)
    if (nodeData && (!nodeData.links || nodeData.links.length === 0)) {
      try {
        const detail = await studentDashboardService.getNodeDetail(nodeData.id)
        if (detail) {
          let resources: {title: string, url: string}[] = [];

          // resource comes from a JSONB column: usually a JSON array of URL strings
          // (or objects), but tolerate a JSON string too.
          let rawResources: any = detail.resource;
          if (typeof rawResources === 'string') {
            try { rawResources = JSON.parse(rawResources); } catch { rawResources = []; }
          }
          if (Array.isArray(rawResources)) {
            resources = rawResources
              .map((item: any, idx: number) => {
                const url = typeof item === 'string' ? item : (item?.url || item?.link || '');
                const title = (item && typeof item === 'object' && item.title) ? item.title : `Learning Resource ${idx + 1}`;
                return url ? { title, url } : null;
              })
              .filter(Boolean) as {title: string, url: string}[];
          }

          if (resources.length === 0) {
            if (detail.links && Array.isArray(detail.links)) {
              resources.push(...detail.links);
            } else {
              if (detail.Link1 || detail.link1) resources.push({ title: detail.Title1 || 'Resource 1', url: detail.Link1 || detail.link1 });
              if (detail.Link2 || detail.link2) resources.push({ title: detail.Title2 || 'Resource 2', url: detail.Link2 || detail.link2 });
              if (detail.Link3 || detail.link3) resources.push({ title: detail.Title3 || 'Resource 3', url: detail.Link3 || detail.link3 });
            }
          }

          if (resources.length > 0) {
            setSelectedNodeData(prev => prev ? { ...prev, links: resources } : prev)
          }
        }
      } catch (error) {
        console.error("[Student Roadmap] Failed to fetch node resources:", error)
      }
    }
  }

  const showCareerSelector = !currentCareerId || isChangingCareer

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  useGSAP(() => {
    gsap.from(".roadmap-gsap-panel", {
      y: 20,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out"
    })
  }, { scope: pageRef, dependencies: [showCareerSelector], revertOnUpdate: true })

  // dvh, not vh: on mobile Safari and Chrome the URL bar makes 100vh taller than what is
  // actually on screen, which pushed the canvas and its zoom controls off the bottom.
  return (
    <div ref={pageRef} className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-transparent font-sans text-slate-900">
      <SharedAppBackground />

      <StudentHeader
        user={user}
        onLogout={handleLogout}
        onOpenAiMentor={() => navigate(ROUTES.AI_MENTOR)}
      />

      {/* Main Canvas Area */}
      <main className="relative z-10 mt-[72px] flex w-full flex-1 overflow-hidden p-2 sm:p-4">

        {/* Vector Graph Area — now full width; details live in a slide-in drawer. */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-transparent rounded-2xl">
            <div className="absolute inset-0 z-10 bg-transparent">
              {/* React Flow Provider must wrap the Canvas */}
              <ReactFlowProvider>
                <RoadmapVectorGraph
                  onNodeClick={handleNodeClick}
                  themeColor={themeColor}
                  roadmapData={roadmapData}
                  optimisticStatusMap={optimisticStatusMap}
                  chosenNodeIds={chosenNodeIds}
                />
              </ReactFlowProvider>
            </div>

            {/* Top-left floating stack: target career, AI suggestions, legend */}
            {roadmapData && roadmapData.nodes && roadmapData.nodes.length > 0 && (
              <div className="absolute top-2 left-2 z-20 flex max-h-[calc(100%-1rem)] flex-col items-start gap-2.5 overflow-y-auto sm:top-4 sm:left-4 sm:max-h-[calc(100%-2rem)]">
                {/* Target Career control (moved here from the old right column). */}
                <div className="w-[260px] max-w-[calc(100vw-1rem)] rounded-xl bg-white/70 px-3.5 py-3 shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-md sm:max-w-[calc(100vw-2rem)]">
                  <p className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    <Target size={12} weight="bold" />
                    Target Career
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-[15px] font-bold tracking-tight text-slate-900 truncate flex-1">
                      {roadmapData?.targetCareerRole || currentCareerName || "Target Career"}
                    </h1>
                    <button
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100/70 hover:bg-slate-100 text-[10px] font-semibold text-slate-600 transition-all active:scale-[0.98] group shrink-0"
                      onClick={() => {
                        setSelectedCareerId(currentCareerId || "")
                        setCareerSearch("")
                        setIsChangingCareer(true)
                      }}
                    >
                      <PencilSimple size={10} weight="bold" className="group-hover:text-slate-900 transition-colors" /> Change
                    </button>
                  </div>

                  {/* Overall learning progress. */}
                  <div className="mt-3 pt-3 border-t border-black/[0.06]">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Progress</span>
                      <span className="text-[12px] font-black tabular-nums text-slate-900">{roadmapProgress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-500 ease-out"
                        style={{ width: `${roadmapProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
                {/* On a phone this stack and the canvas want the same space, and the stack
                    wins by default — 260px of controls over a 375px viewport leaves nothing
                    to read. Everything below the career card folds away behind one toggle,
                    closed to begin with, so the roadmap is what you land on. */}
                <button
                  type="button"
                  onClick={() => setControlsOpen((open) => !open)}
                  aria-expanded={controlsOpen}
                  className="flex w-[260px] max-w-[calc(100vw-1rem)] items-center justify-between gap-2 rounded-xl bg-white/70 px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-md transition-colors hover:text-slate-900 sm:hidden"
                >
                  {controlsOpen ? 'Hide tools' : 'Tools & legend'}
                  <CaretDown
                    size={12}
                    weight="bold"
                    className={`transition-transform ${controlsOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`${controlsOpen ? 'flex' : 'hidden'} w-[260px] max-w-[calc(100vw-1rem)] flex-col items-start gap-2.5 sm:flex sm:max-w-[calc(100vw-2rem)]`}
                >
                  <RoadmapRecommendationsPanel
                    hasCareer={Boolean(currentCareerId)}
                    onApplied={loadRoadmap}
                    refreshSignal={recsRefresh}
                  />
                  {currentCareerId && isFptAccount && (
                    <button
                      type="button"
                      onClick={() => { setSelectedNodeData(null); setShowFptPanel(true) }}
                      className="group flex w-full items-center gap-2.5 rounded-xl bg-white/70 px-3.5 py-2.5 text-left shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-md transition-all hover:-translate-y-px hover:bg-white active:scale-[0.99]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
                        <GraduationCap size={17} weight="fill" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-bold text-slate-800">FPT courses taken</span>
                        <span className="block text-[10px] text-slate-500">Personalize your roadmap</span>
                      </span>
                    </button>
                  )}
                  <StageLegend />
                </div>
              </div>
            )}
        </div>

        {/* FPT curriculum — right-docked panel that fades into the background. */}
        <FptCurriculumPanel
          open={showFptPanel && isFptAccount}
          onClose={() => setShowFptPanel(false)}
          onApplied={() => { loadRoadmap(); setRecsRefresh(n => n + 1) }}
        />

        {/* Node detail — a right-docked panel that fades into the background
            (no card / shadow / widget chrome), not a floating popup.
            Full width on a phone: at 375px the old 380px panel was the whole screen anyway,
            but faded to transparent on its left edge, so it read as a broken overlay rather
            than a sheet. Below `sm` it becomes opaque and owns the viewport. */}
        {selectedNodeData && !showFptPanel && (
        <div className="roadmap-node-panel pointer-events-none absolute inset-y-0 right-0 z-30 flex w-full flex-col justify-start bg-slate-50 px-4 pt-4 sm:w-[380px] sm:max-w-[calc(100%-1rem)] sm:bg-gradient-to-l sm:from-slate-50 sm:via-slate-50/85 sm:to-transparent sm:pl-10 sm:pr-5 sm:pt-6">
          <style>{`@keyframes rmPanelIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}.roadmap-node-panel{animation:rmPanelIn .2s ease-out}`}</style>
          <div className="pointer-events-auto flex max-h-full flex-col">
          {/* Compact header: stage dot + node name + close. */}
          <div className="flex items-start gap-2 px-4 pt-3.5 pb-2 shrink-0">
            {getStageStyle(selectedNodeData.stage) && (
              <span
                className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-[3px] ring-1 ring-black/20"
                style={{ backgroundColor: getStageStyle(selectedNodeData.stage)!.color }}
              />
            )}
            <h2 className="flex-1 text-[15px] font-bold leading-snug tracking-tight text-slate-950">
              {selectedNodeData.label}
            </h2>
            <button
              aria-label="Close detail"
              onClick={closePopover}
              className="-mr-1 -mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={14} weight="bold" />
            </button>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">
            {/* One tight status line: state + completion date. */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
              <span className={`rounded-full px-2 py-0.5 ${
                selectedNodeData.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                selectedNodeData.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                selectedNodeData.status === 'current' ? 'bg-indigo-50 text-indigo-600' :
                selectedNodeData.status === 'alternative' ? 'bg-amber-50 text-amber-600' :
                'bg-slate-100 text-slate-500'
              }`}>
                {selectedNodeData.status === 'completed' ? 'Completed' : selectedNodeData.status === 'in_progress' ? 'In progress' : selectedNodeData.status === 'current' ? 'Available' : selectedNodeData.status === 'alternative' ? 'Alternative' : 'Locked'}
              </span>
              {selectedNodeData.status === 'completed' && selectedNodeData.completedAt && (
                <span className="text-slate-400">
                  · {new Date(selectedNodeData.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Short description — clamped, no scroll box. */}
            {selectedNodeData.description && (
              <p className="text-[12.5px] leading-relaxed text-slate-600 line-clamp-4">
                {selectedNodeData.description}
              </p>
            )}

            {/* FLM overlay — which FPT subjects teach this skill, and their lesson resources.
                The backend already omits this for non-FPT accounts; the flag is a belt-and-braces guard. */}
            {isFptAccount && selectedNodeData.fptCoverage?.covered && (
              <div className="flex flex-col gap-1.5 rounded-xl border border-orange-200/70 bg-orange-50/60 p-2.5">
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={13} weight="fill" className="text-orange-600" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-orange-700">Learn at FPT</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(selectedNodeData.fptCoverage.subjects || []).map((s: any) => (
                    <span
                      key={s.code}
                      title={(s.name || '').split('_')[0].trim() || s.name}
                      className="inline-flex items-center gap-1 rounded-md border border-orange-300/70 bg-white px-1.5 py-0.5 text-[10.5px] font-bold text-orange-800"
                    >
                      {s.code}
                      {typeof s.semester === 'number' && (
                        <span className="text-[9px] font-semibold text-orange-500">· term {s.semester}</span>
                      )}
                    </span>
                  ))}
                </div>
                {(selectedNodeData.fptResources || []).length > 0 && (
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    {(selectedNodeData.fptResources || []).map((r: any, idx: number) => {
                      const href = (r?.url || '').trim();
                      const label = r?.title || r?.topic || `${r?.subjectCode} resource`;
                      const isYt = !!href && !!getYouTubeId(href);
                      const clickable = !!href;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!clickable}
                          onClick={() => {
                            if (!clickable) return;
                            if (isYt) setActiveResource({ title: label, url: href })
                            else window.open(href, '_blank', 'noopener,noreferrer')
                          }}
                          className={`group flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left transition-all ${clickable ? 'hover:bg-white' : 'cursor-default opacity-80'}`}
                        >
                          <span className={`grid h-4 w-4 shrink-0 place-items-center rounded ${r?.kind === 'SESSION' ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-700'}`}>
                            {r?.kind === 'SESSION' ? <BookOpen size={9} weight="fill" /> : <LinkSimple size={9} weight="bold" />}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-slate-700">{label}</span>
                          {clickable && <ArrowUpRight size={11} weight="bold" className="shrink-0 text-orange-300 group-hover:text-orange-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {isFptAccount && selectedNodeData.fptCoverage?.selfStudy && !selectedNodeData.fptCoverage?.covered && (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-2.5 py-1.5">
                <BookOpen size={12} weight="bold" className="text-slate-500" />
                <span className="text-[11px] font-semibold text-slate-500">Self-study — not taught in the FPT curriculum</span>
              </div>
            )}

            {/* Resources as compact one-line chips. */}
            {selectedNodeData.links && selectedNodeData.links.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Resources</p>
                {selectedNodeData.links.map((link: any, idx: number) => {
                  const rawUrl = typeof link === 'string' ? link : (link && typeof link.url === 'string' ? link.url : '');
                  const href = rawUrl.trim();
                  if (!href) return null;
                  const meta = getLinkMeta(href);
                  const title = typeof link === 'object' && link?.title ? link.title : meta.label;
                  const isYt = !!getYouTubeId(href);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (isYt) setActiveResource({ title, url: href })
                        else window.open(href, '_blank', 'noopener,noreferrer')
                      }}
                      className="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all duration-200 hover:-translate-y-px hover:bg-slate-50"
                    >
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${isYt ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'} group-hover:scale-105 transition-transform`}>
                        {isYt ? <YoutubeLogo size={11} weight="fill" /> : <LinkSimple size={11} weight="bold" />}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-slate-700 group-hover:text-black">{meta.label}</span>
                      <ArrowUpRight size={13} weight="bold" className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Action — compact. */}
            {selectedNodeData.nodeKind === 'ALTERNATIVE' && !chosenNodeIds.has(selectedNodeData.id) ? (
              <button
                onClick={() => setPendingChoice(selectedNodeData)}
                disabled={isSelecting}
                className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-[12.5px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                <GitFork size={13} weight="bold" /> Choose this option
              </button>
            ) : selectedNodeData.parentTopic ? (
              selectedNodeData.status === 'locked' ? (
                <div className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[11.5px] font-semibold text-slate-400">
                  <LockKey size={13} weight="bold" /> Finish the previous topic first
                </div>
              ) : (() => {
                const total = selectedNodeData.childTotal || 0;
                const done = selectedNodeData.childCompleted || 0;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                const complete = selectedNodeData.status === 'completed';
                return (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>{complete ? 'Topic complete' : 'Auto-completes from sub-skills'}</span>
                      <span className="tabular-nums">{done}/{total}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${complete ? 'bg-emerald-500' : 'bg-slate-900'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })()
            ) : selectedNodeData.completionPolicy === 'NEVER_COMPLETE' ? (
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-[11.5px] font-medium text-slate-500">
                <TreeStructure size={13} weight="bold" /> Completes via its sub-skills
              </div>
            ) : selectedNodeData.status === 'completed' ? (
              <button
                onClick={() => handleUpdateNodeStatus('in_progress')}
                disabled={isUpdatingNode}
                className="mt-0.5 w-full rounded-lg bg-white px-4 py-2 text-[12px] font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {isUpdatingNode ? 'Updating...' : 'Re-learn (mark in progress)'}
              </button>
            ) : selectedNodeData.status === 'locked' ? (
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[11.5px] font-semibold text-slate-400">
                <LockKey size={13} weight="bold" /> Complete prerequisites first
              </div>
            ) : (
              <button
                onClick={() => setPendingComplete(selectedNodeData)}
                disabled={isUpdatingNode}
                className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-[12.5px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                <Check size={14} weight="bold" /> {isUpdatingNode ? 'Marking...' : 'Mark as completed'}
              </button>
            )}
          </div>
          </div>
        </div>
        )}

        {/* Career Selector Overlay */}
        {!isInitialLoading && showCareerSelector && (
          <div className="absolute inset-0 z-50 bg-slate-50/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
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
        )}
      </main>

      <StudentProfileSetupModal isOpen={activeSetupStep === "profile"} onComplete={openSkillSelection} />
      {activeSetupStep === "skills" && (
        <StudentSkillSelectionModal isOpen onComplete={completeSetup} onBack={goBackToProfile} />
      )}

      <ConfirmModal
        isOpen={!!pendingChoice}
        variant="primary"
        title={pendingChoice ? `Choose ${pendingChoice.label}?` : 'Choose this option?'}
        message="This becomes the active option in its pick-one group and counts toward your progress. The other options stay available as alternatives — you can switch anytime."
        confirmLabel="Choose it"
        cancelLabel="Cancel"
        loading={isSelecting}
        onConfirm={confirmChoice}
        onCancel={() => setPendingChoice(null)}
      />

      <ConfirmModal
        isOpen={!!pendingComplete}
        variant="primary"
        title={pendingComplete ? `Mark "${pendingComplete.label}" as completed?` : 'Mark as completed?'}
        message="This marks the skill as done, records today's date, and updates your roadmap progress. You can switch it back to in-progress later if needed."
        confirmLabel="Mark completed"
        cancelLabel="Cancel"
        loading={isUpdatingNode}
        onConfirm={async () => {
          await handleUpdateNodeStatus('completed');
          setPendingComplete(null);
        }}
        onCancel={() => setPendingComplete(null)}
      />

      <ResourceViewerModal resource={activeResource} onClose={() => setActiveResource(null)} />
    </div>
  )
}

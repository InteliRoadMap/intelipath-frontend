import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ReactFlowProvider } from '@xyflow/react'
import {
  ArrowRight,
  ArrowsClockwise,
  CheckCircle,
  Clock,
  LinkSimple,
  LockKey,
  MapTrifold,
  MagnifyingGlass,
  Palette,
  PencilSimple,
  Target,
  TreeStructure,
  X
} from "@phosphor-icons/react"
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, DiagonalGridBackground, Input, RouteProgressBar } from "@/components/ui"
import { useAuth } from "@/context"
import { isUuid } from "@/lib/utils"
import { ROUTES } from "@/shared"
import robotHead from "@/assets/robot/head.png"
import { useStudentSetup } from "../hooks"
import { studentDashboardService } from "../services"
import type { CareerRole, StudentRoadmap } from "../types"
import StudentProfileSetupModal from "./StudentProfileSetupModal"
import StudentSkillSelectionModal from "./StudentSkillSelectionModal"
import StudentTopNav from "./StudentTopNav"
import { RoadmapVectorGraph } from "./RoadmapVectorGraph"

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
    <div className="roadmap-gsap-panel w-full max-w-3xl mx-auto bg-white rounded-[2rem] p-1.5 ring-1 ring-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] relative z-50 flex flex-col max-h-[85vh]">
      <div className="bg-[#FCFCFC] rounded-[calc(2rem-0.375rem)] flex flex-col overflow-hidden border border-black/[0.04] flex-1">
        
        {/* Header section */}
        <div className="px-6 py-6 md:px-8 md:py-8 border-b border-black/[0.04] text-center w-full shrink-0 bg-white">
           <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight text-slate-900">
             Change Career Path
           </h1>
        </div>

        <div className="p-6 md:p-8 flex-1 flex flex-col">
          {/* Search bar */}
          <div className="relative mb-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
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
                        {career.description || career.prerequisite || 'Select to view roadmap.'}
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

export default function StudentRoadmapPageView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement>(null)
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
  
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null)
  const [isUpdatingNode, setIsUpdatingNode] = useState(false)

  const { activeSetupStep, openSkillSelection, completeSetup } = useStudentSetup(user?.id)

  const loadRoadmap = async () => {
    setIsRoadmapLoading(true)
    setErrorMessage(undefined)
    try {
      const nextRoadmap = await studentDashboardService.getStudentRoadmap()
      setRoadmapData(nextRoadmap)
    } catch (error) {
      console.error("[Student Roadmap] Failed to load roadmap:", error)
      setRoadmapData(null)
      setErrorMessage("Roadmap data is not available yet.")
    } finally {
      setIsRoadmapLoading(false)
    }
  }

  const handleUpdateNodeStatus = async (newStatus: string) => {
    if (!selectedNodeData || isUpdatingNode) return;
    setIsUpdatingNode(true);
    try {
      await studentDashboardService.updateNodeProgress(selectedNodeData.id, newStatus);
      await loadRoadmap(); // Reload the map to reflect changes (colors, edges)
      setSelectedNodeData({ ...selectedNodeData, status: newStatus });
    } catch (error) {
      console.error("[Student Roadmap] Failed to update node progress:", error);
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

  const handleNodeClick = (nodeData: any) => {
    setSelectedNodeData(nodeData)
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
    
    gsap.to(".roadmap-gsap-robot", {
      y: -8,
      rotation: 2,
      duration: 1.9,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    })
  }, { scope: pageRef, dependencies: [showCareerSelector], revertOnUpdate: true })

  return (
    <div ref={pageRef} className="relative h-screen w-screen overflow-hidden bg-[#f9fafb] font-sans text-slate-900 flex flex-col">
      <DiagonalGridBackground />

      <StudentTopNav
        user={user}
        onLogout={handleLogout}
        onOpenAiMentor={() => navigate(ROUTES.AI_MENTOR)}
      />

      {(isInitialLoading || isRoadmapLoading) && <RouteProgressBar />}

      {/* Main Canvas Area */}
      <main className="relative z-10 flex-1 w-full flex mt-[72px] overflow-hidden p-4 gap-4">
        
        {/* Left Column (Theme Settings) */}
        <div className="hidden xl:block w-[320px] shrink-0 h-full">
          {!isInitialLoading && !showCareerSelector && !isRoadmapLoading && (
            <div className="bg-[#FAFAFA] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 p-6 h-max">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <Palette size={14} weight="light" />
                Theme Customizer
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'cyan', label: 'Tech Blue', from: 'bg-cyan-500', to: 'bg-blue-600' },
                  { id: 'emerald', label: 'Emerald', from: 'bg-emerald-500', to: 'bg-teal-600' },
                  { id: 'violet', label: 'Violet', from: 'bg-violet-500', to: 'bg-fuchsia-600' },
                  { id: 'amber', label: 'Amber', from: 'bg-amber-400', to: 'bg-orange-500' },
                  { id: 'rose', label: 'Rose', from: 'bg-rose-400', to: 'bg-red-500' },
                  { id: 'monochrome', label: 'Mono', from: 'bg-slate-700', to: 'bg-slate-900' },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setThemeColor(theme.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                      themeColor === theme.id 
                        ? 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-black/10' 
                        : 'bg-transparent hover:bg-slate-100 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${theme.from} ${theme.to} shadow-inner shrink-0`} />
                    <span className={`text-[13px] font-medium ${themeColor === theme.id ? 'text-slate-900' : 'text-slate-500'}`}>
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vector Graph Area */}
        <div className="flex-1 w-full h-full relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          {isInitialLoading || isRoadmapLoading ? null : (
            <div className="absolute inset-0 z-10 bg-slate-50">
              {/* React Flow Provider must wrap the Canvas */}
              <ReactFlowProvider>
                <RoadmapVectorGraph onNodeClick={handleNodeClick} themeColor={themeColor} />
              </ReactFlowProvider>
              
            </div>
          )}
        </div>

        {/* Right Column (Details) - High-End Redesign */}
        <div className="hidden lg:flex w-[340px] shrink-0 flex-col bg-[#FAFAFA] rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden relative">
          
          {/* Target Career Header */}
          <div className="px-5 py-4 border-b border-black/[0.04] bg-white">
             <p className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
               <Target size={12} weight="bold" />
               Target Career
             </p>
             <div className="flex items-center justify-between gap-3">
               <h1 className="text-[14px] font-bold tracking-tight text-slate-900 truncate flex-1">
                 {roadmapData?.targetCareerRole || currentCareerName || "Target Career"}
               </h1>
               <button
                 className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100/50 hover:bg-slate-100 text-[10px] font-semibold text-slate-600 transition-all active:scale-[0.98] group shrink-0"
                 onClick={() => {
                   setSelectedCareerId(currentCareerId || "")
                   setCareerSearch("")
                   setIsChangingCareer(true)
                 }}
               >
                 <PencilSimple size={10} weight="bold" className="group-hover:text-slate-900 transition-colors" /> Change
               </button>
             </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-5 relative">
            {selectedNodeData ? (
              <>
                <div className="flex flex-col shrink-0 gap-2.5 mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-md ${
                      selectedNodeData.status === 'completed' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' : 
                      selectedNodeData.status === 'current' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/20' : 
                      'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                    }`}>
                      {selectedNodeData.status === 'completed' ? 'Completed' : selectedNodeData.status === 'current' ? 'Current Focus' : 'Locked'}
                    </span>
                  </div>
                  <h2 className="text-[20px] font-bold tracking-tight leading-snug text-slate-950">{selectedNodeData.label}</h2>
                </div>

                <div className="flex flex-col shrink-0 max-h-[240px] mb-6 relative">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 shrink-0">Description</h3>
                  
                  {/* Premium Scroll Area */}
                  <div className="overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 transition-colors">
                    <p className="text-[13px] leading-relaxed text-slate-600 font-medium">
                      {selectedNodeData.description || 'No description provided for this skill node yet.'}
                    </p>
                  </div>
                  {/* Fade out mask at bottom of description if it scrolls */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none" />
                </div>

                <div className="flex-1 flex flex-col overflow-hidden min-h-[100px]">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 shrink-0">
                    <LinkSimple size={12} weight="bold" />
                    Learning Resources
                  </h3>
                  <div className="flex-1 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
                    {selectedNodeData.links && selectedNodeData.links.length > 0 ? (
                      <div className="flex flex-col gap-2.5">
                        {selectedNodeData.links.map((link: any, idx: number) => {
                          const href = typeof link === 'string' ? link : (link?.url || '');
                          const title = typeof link === 'string' ? `Resource Link ${idx + 1}` : (link?.title || `Resource Link ${idx + 1}`);
                          return (
                            <a 
                              key={idx} 
                              href={href} 
                              target="_blank" 
                              rel="noreferrer"
                              className="group flex items-center justify-between p-3 bg-white rounded-xl ring-1 ring-black/[0.04] shadow-sm hover:shadow-md hover:ring-black/[0.08] transition-all duration-300 active:scale-[0.98]"
                            >
                              <span className="text-[12px] font-semibold text-slate-700 group-hover:text-black transition-colors truncate mr-3">{title}</span>
                              <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                <ArrowRight size={12} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-xl ring-1 ring-black/[0.04] text-center border border-slate-50">
                        <p className="text-[12px] text-slate-500 font-medium">No learning resources attached.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="shrink-0 pt-4 mt-auto space-y-3">
                  {/* Premium Compact Action Buttons */}
                  {selectedNodeData.status === 'completed' ? (
                    <div className="space-y-3">
                      <button disabled className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-3 rounded-xl ring-1 ring-emerald-500/20 font-semibold text-[13px] shadow-sm">
                        <Check size={16} weight="bold" /> Completed
                      </button>
                      <button 
                        onClick={() => handleUpdateNodeStatus('in_progress')}
                        disabled={isUpdatingNode}
                        className="w-full flex items-center justify-center bg-white text-slate-600 px-5 py-2.5 rounded-xl ring-1 ring-slate-200 hover:bg-slate-50 transition-colors font-medium text-[12px] disabled:opacity-50"
                      >
                        {isUpdatingNode ? 'Updating...' : 'Re-learn (Mark In Progress)'}
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleUpdateNodeStatus('completed')}
                      disabled={isUpdatingNode}
                      className="group relative w-full flex items-center justify-between bg-black text-white px-5 py-3 rounded-xl overflow-hidden transition-transform active:scale-[0.98] duration-300 shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.15)] disabled:opacity-50 disabled:active:scale-100"
                    >
                      <span className="text-[13px] font-semibold tracking-wide relative z-10">
                        {isUpdatingNode ? 'Marking...' : 'Mark as Completed'}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-[1px] group-hover:scale-105">
                        <Check size={12} weight="bold" />
                      </div>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center mb-4">
                  <MapTrifold size={20} weight="light" className="text-slate-400" />
                </div>
                <p className="text-[14px] font-semibold text-slate-900 tracking-tight">Select a topic</p>
                <p className="text-[12px] mt-1.5 max-w-[180px] text-slate-500 leading-relaxed">Click any node to view its detailed learning resources.</p>
              </div>
            )}
          </div>
        </div>

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

      <button
        type="button"
        onClick={() => navigate(ROUTES.AI_MENTOR)}
        className="roadmap-gsap-robot fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
        title="Ask AI Mentor"
      >
        <img src={robotHead} alt="Ask AI Mentor" className="h-full w-full object-contain drop-shadow-xl" />
      </button>

      <StudentProfileSetupModal isOpen={activeSetupStep === "profile"} onComplete={openSkillSelection} />
      {activeSetupStep === "skills" && (
        <StudentSkillSelectionModal isOpen onComplete={completeSetup} />
      )}
    </div>
  )
}

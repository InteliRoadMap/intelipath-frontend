import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { FloppyDisk, Plus, Trash, ArrowClockwise } from "@phosphor-icons/react"
import careerApi from "@/api/careerApi"
import roadmapEditorApi, { type EditorNode, type UpsertNodePayload } from "../api/roadmapEditorApi"
import { MentorHeader } from "./MentorHeader"
import { useAuth } from "@/context"
import { ROUTES } from "@/shared"
import { toast } from "@/utils/toast"

const STAGES = ["FOUNDATION", "CORE", "PRACTICAL", "ADVANCED", "JOB_READY"]
const POLICIES = ["MANUAL_ONLY", "EVIDENCE_ALLOWED", "NEVER_COMPLETE"]

type FormState = {
  nodeName: string
  description: string
  stage: string
  completionPolicy: string
  weight: string
  requiredProficiency: string
  parentNodeId: string
  previousNodeId: string
  resourcesText: string
}

const emptyForm: FormState = {
  nodeName: "",
  description: "",
  stage: "FOUNDATION",
  completionPolicy: "MANUAL_ONLY",
  weight: "",
  requiredProficiency: "",
  parentNodeId: "",
  previousNodeId: "",
  resourcesText: ""
}

const parseResources = (resource: unknown): string[] => {
  let parsed = resource
  if (typeof resource === "string") {
    try { parsed = JSON.parse(resource) } catch { return [] }
  }
  if (!Array.isArray(parsed)) return []
  return parsed
    .map((item: any) => (typeof item === "string" ? item : item?.url || item?.link || ""))
    .filter(Boolean)
}

const nodeVisual = (node: EditorNode): React.CSSProperties => {
  const isSpine = (node.nodeLevel ?? 0) > 0
  const isGroup = node.completionPolicy === "NEVER_COMPLETE"
  return {
    width: 220,
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#0f172a",
    background: isSpine ? "#fde68a" : isGroup ? "#f1f5f9" : "#fff7ed",
    border: isGroup ? "2px dashed #94a3b8" : "2px solid #0f172a"
  }
}

/** Grid fallback for nodes the mentor has not placed yet. */
const fallbackPosition = (index: number) => ({
  x: (index % 4) * 260,
  y: Math.floor(index / 4) * 110
})

const MentorRoadmapEditorView = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [careers, setCareers] = useState<{ careerId: string; careerName: string }[]>([])
  const [careerId, setCareerId] = useState("")
  const [editorNodes, setEditorNodes] = useState<EditorNode[]>([])
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<any>([])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<any>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [dirtyPositions, setDirtyPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const selectedNode = useMemo(
    () => editorNodes.find(n => n.nodeId === selectedId) || null,
    [editorNodes, selectedId]
  )

  const rebuildGraph = useCallback((nodes: EditorNode[]) => {
    const flowNodes: Node[] = nodes.map((node, index) => ({
      id: node.nodeId,
      position: node.positionX != null && node.positionY != null
        ? { x: node.positionX, y: node.positionY }
        : fallbackPosition(index),
      data: { label: node.nodeName },
      style: nodeVisual(node)
    }))

    const flowEdges: Edge[] = []
    nodes.forEach(node => {
      if (node.previousNode) {
        flowEdges.push({
          id: `p-${node.previousNode}-${node.nodeId}`,
          source: node.previousNode,
          target: node.nodeId,
          type: "smoothstep",
          style: { stroke: "#0f172a", strokeWidth: 2.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#0f172a" }
        })
      }
      if (node.parentNode) {
        flowEdges.push({
          id: `h-${node.parentNode}-${node.nodeId}`,
          source: node.parentNode,
          target: node.nodeId,
          type: "bezier",
          style: { stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "5 5" }
        })
      }
    })

    setRfNodes(flowNodes)
    setRfEdges(flowEdges)
  }, [setRfNodes, setRfEdges])

  const loadNodes = useCallback(async (id: string) => {
    if (!id) return
    setIsLoading(true)
    setSelectedId(null)
    setDirtyPositions({})
    try {
      const response = await roadmapEditorApi.getCareerNodes(id)
      setEditorNodes(response.data)
      rebuildGraph(response.data)
    } catch (error) {
      console.error("[Roadmap Editor] Failed to load nodes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [rebuildGraph])

  useEffect(() => {
    careerApi.getCareerRoles()
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : res.data?.careers || []
        setCareers(list)
        if (list.length > 0) {
          setCareerId(list[0].careerId)
        }
      })
      .catch(err => console.error("[Roadmap Editor] Failed to load careers:", err))
  }, [])

  useEffect(() => { loadNodes(careerId) }, [careerId, loadNodes])

  const handleNodeClick = (_: unknown, node: Node) => {
    const data = editorNodes.find(n => n.nodeId === node.id)
    if (!data) return
    setSelectedId(node.id)
    setForm({
      nodeName: data.nodeName || "",
      description: data.description || "",
      stage: data.stage || "FOUNDATION",
      completionPolicy: data.completionPolicy || "MANUAL_ONLY",
      weight: data.weight != null ? String(data.weight) : "",
      requiredProficiency: data.requiredProficiency != null ? String(data.requiredProficiency) : "",
      parentNodeId: data.parentNode || "",
      previousNodeId: data.previousNode || "",
      resourcesText: parseResources(data.resource).join("\n")
    })
  }

  const handleNodeDragStop = (_: unknown, node: Node) => {
    setDirtyPositions(prev => ({ ...prev, [node.id]: { x: node.position.x, y: node.position.y } }))
  }

  const startCreate = () => {
    setSelectedId(null)
    setForm(emptyForm)
  }

  const buildPayload = (): UpsertNodePayload => ({
    nodeName: form.nodeName.trim(),
    description: form.description.trim() || null,
    stage: form.stage || null,
    completionPolicy: form.completionPolicy || null,
    weight: form.weight ? Number(form.weight) : null,
    requiredProficiency: form.requiredProficiency ? Number(form.requiredProficiency) : null,
    parentNodeId: form.parentNodeId || null,
    previousNodeId: form.previousNodeId || null,
    resources: form.resourcesText.split("\n").map(s => s.trim()).filter(Boolean),
    positionX: selectedId
      ? (dirtyPositions[selectedId]?.x ?? selectedNode?.positionX ?? null)
      : null,
    positionY: selectedId
      ? (dirtyPositions[selectedId]?.y ?? selectedNode?.positionY ?? null)
      : null
  })

  const handleSaveNode = async () => {
    if (!form.nodeName.trim()) {
      toast.error("Node name is required.")
      return
    }
    setIsSaving(true)
    try {
      if (selectedId) {
        await roadmapEditorApi.updateNode(selectedId, buildPayload())
        toast.success("Node updated.")
      } else {
        if (!careerId) return
        await roadmapEditorApi.createNode(careerId, buildPayload())
        toast.success("Node created.")
      }
      await loadNodes(careerId)
    } catch (error) {
      console.error("[Roadmap Editor] Failed to save node:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteNode = async () => {
    if (!selectedId) return
    if (!window.confirm("Delete this node? This cannot be undone.")) return
    setIsSaving(true)
    try {
      await roadmapEditorApi.deleteNode(selectedId)
      toast.success("Node deleted.")
      await loadNodes(careerId)
    } catch (error) {
      console.error("[Roadmap Editor] Failed to delete node:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveLayout = async () => {
    const entries = Object.entries(dirtyPositions)
    if (entries.length === 0) return
    setIsSaving(true)
    try {
      await roadmapEditorApi.savePositions(
        entries.map(([nodeId, pos]) => ({ nodeId, positionX: pos.x, positionY: pos.y }))
      )
      toast.success(`Layout saved (${entries.length} node${entries.length > 1 ? "s" : ""}).`)
      setDirtyPositions({})
      await loadNodes(careerId)
    } catch (error) {
      console.error("[Roadmap Editor] Failed to save layout:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTabChange = (tab: string) => {
    if (tab === "dashboard") navigate(ROUTES.DASHBOARD_MENTOR)
    if (tab === "market") navigate(ROUTES.DASHBOARD_MENTOR)
  }

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const dirtyCount = Object.keys(dirtyPositions).length
  const nodeOptions = editorNodes.filter(n => n.nodeId !== selectedId)

  const fieldClass = "w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/15"
  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block"

  return (
    <div className="min-h-screen h-screen bg-slate-50 font-sans text-slate-950 flex flex-col overflow-hidden">
      <MentorHeader user={user} activeTab="roadmap" onTabChange={handleTabChange} onLogout={handleLogout} />

      <main className="flex-1 flex flex-col mt-[92px] px-4 pb-4 gap-3 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 px-4 py-2.5 shadow-sm shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Career</span>
          <select
            value={careerId}
            onChange={e => setCareerId(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-800 outline-none focus:border-cyan-600"
          >
            {careers.map(c => (
              <option key={c.careerId} value={c.careerId}>{c.careerName}</option>
            ))}
          </select>

          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-slate-900 text-white text-[12px] font-semibold hover:bg-slate-800 transition-colors active:scale-[0.98]"
          >
            <Plus size={13} weight="bold" /> New node
          </button>

          <button
            onClick={handleSaveLayout}
            disabled={dirtyCount === 0 || isSaving}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-cyan-700 text-white text-[12px] font-semibold hover:bg-cyan-600 transition-colors active:scale-[0.98] disabled:opacity-40"
          >
            <FloppyDisk size={13} weight="bold" />
            Save layout{dirtyCount > 0 ? ` (${dirtyCount})` : ""}
          </button>

          <button
            onClick={() => loadNodes(careerId)}
            disabled={isLoading}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-white text-slate-600 ring-1 ring-slate-200 text-[12px] font-medium hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <ArrowClockwise size={13} weight="bold" /> Reload
          </button>

          <span className="ml-auto text-[11px] text-slate-400 font-medium">
            {isLoading ? "Loading..." : `${editorNodes.length} nodes — drag to arrange, click to edit`}
          </span>
        </div>

        <div className="flex-1 flex gap-3 min-h-0">
          {/* Canvas */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <ReactFlowProvider>
              <ReactFlow
                nodes={rfNodes}
                edges={rfEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                onNodeDragStop={handleNodeDragStop}
                nodesDraggable
                nodesConnectable={false}
                fitView
                minZoom={0.2}
                proOptions={{ hideAttribution: true }}
              >
                <Background gap={24} color="#e2e8f0" />
                <Controls showInteractive={false} />
              </ReactFlow>
            </ReactFlowProvider>
          </div>

          {/* Edit panel */}
          <div className="w-[330px] shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {selectedId ? "Edit node" : "New node"}
              </p>
              <h3 className="text-[15px] font-bold text-slate-900 truncate">
                {selectedId ? selectedNode?.nodeName : "Create a roadmap node"}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              <div>
                <label className={labelClass}>Node name *</label>
                <input className={fieldClass} value={form.nodeName}
                  onChange={e => setForm({ ...form, nodeName: e.target.value })} />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/15 min-h-[70px]"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>Stage</label>
                  <select className={fieldClass} value={form.stage}
                    onChange={e => setForm({ ...form, stage: e.target.value })}>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Policy</label>
                  <select className={fieldClass} value={form.completionPolicy}
                    onChange={e => setForm({ ...form, completionPolicy: e.target.value })}>
                    {POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>Weight</label>
                  <input type="number" min={0} className={fieldClass} value={form.weight}
                    onChange={e => setForm({ ...form, weight: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Req. proficiency</label>
                  <input type="number" min={0} max={100} className={fieldClass} value={form.requiredProficiency}
                    onChange={e => setForm({ ...form, requiredProficiency: e.target.value })} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Parent node (con của)</label>
                <select className={fieldClass} value={form.parentNodeId}
                  onChange={e => setForm({ ...form, parentNodeId: e.target.value })}>
                  <option value="">— none —</option>
                  {nodeOptions.map(n => <option key={n.nodeId} value={n.nodeId}>{n.nodeName}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Previous node (node trước)</label>
                <select className={fieldClass} value={form.previousNodeId}
                  onChange={e => setForm({ ...form, previousNodeId: e.target.value })}>
                  <option value="">— none —</option>
                  {nodeOptions.map(n => <option key={n.nodeId} value={n.nodeId}>{n.nodeName}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Resource links (mỗi dòng 1 URL)</label>
                <textarea
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/15 min-h-[80px]"
                  placeholder="https://..."
                  value={form.resourcesText}
                  onChange={e => setForm({ ...form, resourcesText: e.target.value })}
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleSaveNode}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white h-10 rounded-xl text-[13px] font-semibold hover:bg-slate-800 transition-colors active:scale-[0.98] disabled:opacity-50"
              >
                <FloppyDisk size={14} weight="bold" />
                {isSaving ? "Saving..." : selectedId ? "Save changes" : "Create node"}
              </button>
              {selectedId && (
                <button
                  onClick={handleDeleteNode}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-1.5 px-3.5 h-10 rounded-xl bg-white text-red-600 ring-1 ring-red-200 text-[12px] font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash size={13} weight="bold" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MentorRoadmapEditorView

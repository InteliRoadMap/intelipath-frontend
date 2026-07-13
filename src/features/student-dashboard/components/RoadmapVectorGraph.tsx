import { useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useViewport,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import { MagnifyingGlassMinus, MagnifyingGlassPlus } from '@phosphor-icons/react';
import '@xyflow/react/dist/style.css';
import CustomRoadmapNode from './CustomRoadmapNode';
import { studentDashboardService } from '../services';
import type { StudentRoadmap } from '../types';

const nodeTypes = {
  custom: CustomRoadmapNode,
};

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 1.5;

/** Volume-bar style zoom control: drag the slider (or tap ±) to zoom the canvas. */
const ZoomSlider = () => {
  const { zoomTo } = useReactFlow();
  const { zoom } = useViewport();
  const step = 0.15;

  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-md">
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => zoomTo(Math.max(MIN_ZOOM, zoom - step), { duration: 150 })}
        className="grid h-6 w-6 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <MagnifyingGlassMinus size={14} weight="bold" />
      </button>
      <input
        type="range"
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.01}
        value={zoom}
        onChange={(e) => zoomTo(Number(e.target.value), { duration: 0 })}
        className="roadmap-zoom-range h-1 w-24 cursor-pointer appearance-none rounded-full bg-slate-200"
        aria-label="Zoom level"
      />
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => zoomTo(Math.min(MAX_ZOOM, zoom + step), { duration: 150 })}
        className="grid h-6 w-6 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <MagnifyingGlassPlus size={14} weight="bold" />
      </button>
      <style>{`
        .roadmap-zoom-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:13px;height:13px;border-radius:9999px;background:#0f172a;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.35);}
        .roadmap-zoom-range::-moz-range-thumb{width:13px;height:13px;border:none;border-radius:9999px;background:#0f172a;cursor:pointer;}
      `}</style>
    </div>
  );
};

interface RoadmapVectorGraphProps {
  onNodeClick: (nodeData: any) => void;
  themeColor?: string;
  roadmapData: StudentRoadmap | null;
  optimisticStatusMap?: Record<string, string>;
}

// --- Dynamic Anti-Overlap Spine Layout Algorithm ---
export const getDynamicLayoutedElements = (rawNodes: any[], rawEdges: any[], themeColor?: string, optimisticStatusMap: Record<string, string> = {}) => {
  if (!rawNodes.length) return { nodes: [], edges: [] };

  const NODE_WIDTH = 280;
  const NODE_HEIGHT = 70;
  const GAP_Y = 24;
  const GAP_X = 32;

  const adjacencyList: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  rawNodes.forEach(n => {
    adjacencyList[n.id] = [];
    inDegree[n.id] = 0;
  });

  rawEdges.forEach(e => {
    if (adjacencyList[e.source]) {
      adjacencyList[e.source].push(e.target);
    }
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
  });

  const isMainNode = (nodeId: string) => {
    const node = rawNodes.find(n => n.id === nodeId);
    return node?.data?.level > 0;
  };

  const getRawEdge = (source: string, target: string) => {
    return rawEdges.find(e => e.source === source && e.target === target);
  };

  const subtreeHeightMemo = new Map<string, number>();
  const computeHeight = (nodeId: string): number => {
    if (subtreeHeightMemo.has(nodeId)) return subtreeHeightMemo.get(nodeId)!;

    const children = adjacencyList[nodeId] || [];
    const branchChildren = children.filter(c => !isMainNode(c));
    
    if (branchChildren.length === 0) {
      subtreeHeightMemo.set(nodeId, NODE_HEIGHT);
      return NODE_HEIGHT;
    }

    let maxHeight = 0;
    branchChildren.forEach(childId => {
      const h = computeHeight(childId);
      maxHeight = Math.max(maxHeight, h);
    });

    const totalHeight = NODE_HEIGHT + GAP_Y + maxHeight;
    subtreeHeightMemo.set(nodeId, totalHeight);
    return totalHeight;
  };

  const positionedNodes: any[] = [];
  const processedEdges = new Map<string, any>();
  const positionedSet = new Set<string>();

  const layoutBranch = (nodeId: string, x: number, startY: number): number => {
    const node = rawNodes.find(n => n.id === nodeId);
    if (!node || positionedSet.has(nodeId)) return startY;

    positionedNodes.push({ ...node, position: { x, y: startY } });
    positionedSet.add(nodeId);

    let currentY = startY + NODE_HEIGHT + GAP_Y;
    const children = adjacencyList[nodeId] || [];
    
    children.forEach(childId => {
      if (isMainNode(childId)) return; 

      const rawEdge = getRawEdge(nodeId, childId);
      processedEdges.set(`${nodeId}-${childId}`, {
        id: `e-${nodeId}-${childId}`,
        source: nodeId,
        target: childId,
        type: 'smoothstep',
        sourceHandle: 's-bottom',
        targetHandle: 't-top',
        style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' },
        animated: rawEdge?.animated || false
      });
      currentY = layoutBranch(childId, x, currentY);
    });

    return currentY;
  };

  const layoutSpine = (nodeId: string, x: number, y: number): number => {
    const node = rawNodes.find(n => n.id === nodeId);
    if (!node || positionedSet.has(nodeId)) return y;

    positionedNodes.push({ ...node, position: { x, y } });
    positionedSet.add(nodeId);

    const children = adjacencyList[nodeId] || [];
    const spineChildren = children.filter(c => isMainNode(c));
    const branchChildren = children.filter(c => !isMainNode(c));

    let branchLeftY = y;
    let branchRightY = y;

    branchChildren.forEach((childId, index) => {
      const isLeft = index % 2 !== 0; 
      const handleSrc = isLeft ? 's-left' : 's-right';
      const handleTgt = isLeft ? 't-right' : 't-left';
      const branchX = isLeft ? x - NODE_WIDTH - GAP_X : x + NODE_WIDTH + GAP_X;

      const rawEdge = getRawEdge(nodeId, childId);
      processedEdges.set(`${nodeId}-${childId}`, {
        id: `e-${nodeId}-${childId}`,
        source: nodeId,
        target: childId,
        type: 'default', // 'default' is React Flow's built-in bezier edge (soft curves); 'bezier' isn't a registered key in @xyflow/react v12
        sourceHandle: handleSrc,
        targetHandle: handleTgt,
        style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' },
        animated: rawEdge?.animated || false
      });

      if (isLeft) {
        const heightUsed = layoutBranch(childId, branchX, branchLeftY);
        branchLeftY = heightUsed + GAP_Y; 
      } else {
        const heightUsed = layoutBranch(childId, branchX, branchRightY);
        branchRightY = heightUsed + GAP_Y; 
      }
    });

    let nextSpineY = Math.max(y + NODE_HEIGHT + GAP_Y, branchLeftY, branchRightY);

    spineChildren.forEach(childId => {
      const rawEdge = getRawEdge(nodeId, childId);
      processedEdges.set(`${nodeId}-${childId}`, {
        id: `e-${nodeId}-${childId}`,
        source: nodeId,
        target: childId,
        type: 'smoothstep',
        sourceHandle: 's-bottom',
        targetHandle: 't-top',
        style: { stroke: '#3b82f6', strokeWidth: 3 }, 
        animated: rawEdge?.animated || false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        },
      });
      nextSpineY = layoutSpine(childId, x, nextSpineY);
    });

    return nextSpineY;
  };

  const roots = rawNodes.filter(n => inDegree[n.id] === 0 && isMainNode(n.id)).map(n => n.id);
  
  if (roots.length === 0) {
    roots.push(...rawNodes.filter(n => inDegree[n.id] === 0).map(n => n.id));
  }

  let currentRootY = 0;
  roots.forEach(rootId => {
    currentRootY = layoutSpine(rootId, 0, currentRootY);
    currentRootY += 100;
  });

  rawNodes.forEach(node => {
    if (!positionedSet.has(node.id)) {
      positionedNodes.push({ ...node, position: { x: -400, y: currentRootY } });
      positionedSet.add(node.id);
      currentRootY += 100;
    }
  });

  // Gắn themeColor và trạng thái isIsolated vào tất cả các node đã được layout.
  // Node nào có toạ độ vẽ tay từ mentor editor thì ưu tiên dùng, bỏ qua auto-layout.
  const finalNodes = positionedNodes.map(node => {
    const currentStatus = optimisticStatusMap[node.id] || node.data.status;
    const hasFixedPosition = node.data.positionX != null && node.data.positionY != null;
    return {
      ...node,
      position: hasFixedPosition
        ? { x: Number(node.data.positionX), y: Number(node.data.positionY) }
        : node.position,
      data: {
        ...node.data,
        themeColor,
        status: currentStatus,
        isIsolated: inDegree[node.id] === 0 && adjacencyList[node.id].length === 0
      }
    };
  });

  return { nodes: finalNodes, edges: Array.from(processedEdges.values()) };
};

export const RoadmapVectorGraph = ({ onNodeClick, themeColor, roadmapData, optimisticStatusMap = {} }: RoadmapVectorGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const rfRef = useRef<any>(null);
  const hasCenteredRef = useRef(false);

  // Re-centre only when the roadmap itself changes (career switch), never on the
  // optimistic re-renders that fire while a student marks nodes complete.
  useEffect(() => {
    hasCenteredRef.current = false;
  }, [roadmapData?.targetCareerRole]);

  // Horizontally centres the laid-out roadmap in the canvas, anchored near the top.
  const centerRoadmap = (layoutedNodes: any[]) => {
    if (!rfRef.current || !layoutedNodes.length) return;
    const flowEl = document.querySelector('.roadmap-flow') as HTMLElement | null;
    const width = flowEl ? flowEl.clientWidth : 800;
    const zoom = 0.6;
    const minX = Math.min(...layoutedNodes.map(n => n.position.x));
    const maxX = Math.max(...layoutedNodes.map(n => n.position.x + 280)); // node width
    const contentCenter = (minX + maxX) / 2;
    rfRef.current.setViewport({ x: width / 2 - contentCenter * zoom, y: 40, zoom });
  };

  useEffect(() => {
    if (!roadmapData || !roadmapData.nodes || roadmapData.nodes.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }
    const processData = async () => {
      try {
        const { nodes: rawNodes, edges: rawEdges } = await studentDashboardService.getRoadmapGraphData();
        const { nodes: layoutedNodes, edges: layoutedEdges } = getDynamicLayoutedElements(rawNodes, rawEdges, themeColor, optimisticStatusMap);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        if (!hasCenteredRef.current) {
          hasCenteredRef.current = true;
          // Wait a frame so the flow has its final width before centring.
          requestAnimationFrame(() => centerRoadmap(layoutedNodes));
        }
      } catch (e) {
        console.error("Graph layout error", e);
      }
    };
    processData();
  }, [roadmapData, setNodes, setEdges, themeColor, optimisticStatusMap]);

  const handleNodeClick = (_: React.MouseEvent, node: any) => {
    onNodeClick(node.data);
  };

  if (!roadmapData) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-[14px] font-bold">Drafting your Roadmap...</p>
        </div>
      </div>
    );
  }

  if (roadmapData && (!roadmapData.nodes || roadmapData.nodes.length === 0)) {
    return (
      <div className="flex h-full w-full flex-col p-8 bg-white border border-rose-200 rounded-xl overflow-auto m-4 max-w-[800px] mx-auto shadow-sm z-50">
        <h2 className="text-xl font-bold text-rose-600 mb-4">Roadmap Display Error</h2>
        <p className="text-slate-600 mb-4">The backend returned data, but couldn't find any nodes to display. Could you send me this raw data so I can fix the parsing logic?</p>
        <p className="text-sm font-bold text-slate-800 mb-2">Raw Data Dump:</p>
        <pre className="text-[11px] bg-slate-100 p-4 rounded-lg overflow-auto border border-slate-200">
          {JSON.stringify(roadmapData, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-transparent">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        onInit={(instance) => {
          rfRef.current = instance;
          // Nodes may already be laid out (e.g. tab revisit); centre if so.
          if (!hasCenteredRef.current && nodes.length) {
            hasCenteredRef.current = true;
            requestAnimationFrame(() => centerRoadmap(nodes));
          }
        }}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        panOnScroll
        zoomOnScroll={false}
        panOnDrag={false}
        nodesDraggable={false}
        proOptions={{ hideAttribution: true }}
        className="roadmap-flow"
      >
        <ZoomSlider />
      </ReactFlow>
    </div>
  );
};

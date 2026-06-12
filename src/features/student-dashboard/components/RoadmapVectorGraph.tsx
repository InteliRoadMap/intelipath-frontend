import { useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomRoadmapNode from './CustomRoadmapNode';
import { studentDashboardService } from '../services';
import type { StudentRoadmap } from '../types';

const nodeTypes = {
  custom: CustomRoadmapNode,
};

interface RoadmapVectorGraphProps {
  onNodeClick: (nodeData: any) => void;
  themeColor?: string;
}

// --- Dynamic Anti-Overlap Spine Layout Algorithm ---
const getDynamicLayoutedElements = (rawNodes: any[], rawEdges: any[], themeColor?: string) => {
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
        type: 'bezier', // Dùng bezier để đường vuốt cong mềm mại, không bị gập khúc chồng chéo
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

  // Gắn themeColor và trạng thái isIsolated vào tất cả các node đã được layout
  const finalNodes = positionedNodes.map(node => ({
    ...node,
    data: { 
      ...node.data, 
      themeColor,
      isIsolated: inDegree[node.id] === 0 && adjacencyList[node.id].length === 0
    }
  }));

  return { nodes: finalNodes, edges: Array.from(processedEdges.values()) };
};

export const RoadmapVectorGraph = ({ onNodeClick, themeColor }: RoadmapVectorGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<StudentRoadmap | null>(null);

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await studentDashboardService.getStudentRoadmap();
        setRoadmapData(data);
      } catch (error) {
        console.error("Failed to load roadmap data for graph:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGraph();
  }, []);

  useEffect(() => {
    if (!roadmapData) return;
    const processData = async () => {
      try {
        const { nodes: rawNodes, edges: rawEdges } = await studentDashboardService.getRoadmapGraphData(roadmapData);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getDynamicLayoutedElements(rawNodes, rawEdges, themeColor);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } catch (e) {
        console.error("Graph layout error", e);
      }
    };
    processData();
  }, [roadmapData, setNodes, setEdges, themeColor]);

  const handleNodeClick = (_: React.MouseEvent, node: any) => {
    onNodeClick(node.data);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-[14px] font-bold">Drafting your Roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#f8fafc]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        onInit={(instance) => {
          setTimeout(() => {
            const flowEl = document.querySelector('.roadmap-flow');
            const width = flowEl ? flowEl.clientWidth : 800;
            // Thu nhỏ zoom mặc định xuống 0.6 để nhìn được bao quát hơn
            const initialZoom = 0.6;
            const centerX = (width / 2) - (140 * initialZoom);
            instance.setViewport({ x: centerX, y: 40, zoom: initialZoom });
          }, 50);
        }}
        minZoom={0.1}
        maxZoom={1.5}
        className="roadmap-flow"
      >
        <Background color="#cbd5e1" variant={BackgroundVariant.Dots} gap={24} size={2} />
        <Controls showInteractive={false} className="bg-white border-slate-200 shadow-sm" />
      </ReactFlow>
    </div>
  );
};

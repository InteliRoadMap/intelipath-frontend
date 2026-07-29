// Pure transforms for the student dashboard: shape-normalizers and the roadmap
// graph builder. Split out of studentDashboardService so the (gnarly, defensive)
// parsing lives on its own — no API calls in here, everything is input -> output.

import { isUuid } from "@/lib/utils"
import type {
  CareerRole,
  RoadmapNode,
  RoadmapNodeStatus,
  RoadmapProgress,
  RoadmapResource,
  SkillItem,
  SkillResponse,
  StudentRoadmap
} from "../types"

export type RawCareerRole = {
  careerId?: string
  career_id?: string
  id?: string
  careerName?: string
  career_name?: string
  name?: string
  prerequisite?: string
  description?: string
  Description?: string
  content?: string
  desc?: string
}

type RawRoadmapResource = Partial<RoadmapResource> | string

/** Unwrap a `{ data: T }` envelope, or return the payload unchanged. */
export const unwrapResponse = <T>(responseData: unknown): T => {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    return (responseData as { data: T }).data
  }

  return responseData as T
}

export const normalizeCareerRole = (career: RawCareerRole): CareerRole | null => {
  const careerId = career.careerId || career.career_id || career.id
  const careerName = career.careerName || career.career_name || career.name

  if (!careerId || !careerName) return null

  return {
    careerId,
    careerName,
    prerequisite: career.prerequisite,
    description: career.description || career.Description || career.desc || career.content
  }
}

const emptySkillResponse = (): SkillResponse => ({
  selectedSkills: [],
  skills: [],
  requiredSkills: [],
  missingSkills: []
})

const isValidSkillItem = (skill: unknown): skill is SkillItem => {
  const item = skill as Partial<SkillItem>
  return Boolean(item?.skillId && isUuid(item.skillId) && item.skillName)
}

export const normalizeSkillResponse = (data: unknown): SkillResponse => {
  if (!data || typeof data !== "object") return emptySkillResponse()

  const dto = unwrapResponse<Partial<SkillResponse>>(data)

  return {
    selectedSkills: Array.isArray(dto.selectedSkills) ? dto.selectedSkills.filter(isValidSkillItem) : [],
    skills: Array.isArray(dto.skills) ? dto.skills.filter(isValidSkillItem) : [],
    requiredSkills: Array.isArray(dto.requiredSkills)
      ? dto.requiredSkills.filter(({ skill }) => isValidSkillItem(skill))
      : [],
    missingSkills: Array.isArray(dto.missingSkills) ? dto.missingSkills.filter(isValidSkillItem) : []
  }
}

const normalizeStatus = (status?: string): RoadmapNodeStatus => {
  const value = String(status || "locked").toLowerCase()
  if (value === "completed" || value === "current" || value === "locked" || value === "in_progress" || value === "alternative") return value
  return "locked"
}

const parseResourceField = (resource?: RawRoadmapResource[] | string): RawRoadmapResource[] => {
  if (!resource) return []
  if (Array.isArray(resource)) return resource

  try {
    const parsed = JSON.parse(resource) as RawRoadmapResource[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const normalizeResource = (resource: RawRoadmapResource, index: number): RoadmapResource | null => {
  if (typeof resource === "string") {
    return {
      title: `Resource ${index + 1}`,
      url: resource
    }
  }

  if (!resource?.url) return null

  return {
    title: resource.title || `Resource ${index + 1}`,
    url: resource.url,
    type: resource.type
  }
}

const normalizeNode = (node: any): RoadmapNode | null => {
  const id = node.id || node.nodeId || node.node_id
  if (!id) return null

  const rawResources = node.resources ?? parseResourceField(node.resource)

  return {
    id,
    title: node.title || node.nodeName || node.node_name || "Untitled node",
    status: normalizeStatus(node.status),
    description: node.description,
    level: node.level,
    resources: rawResources
      .map((resource: any, index: number) => normalizeResource(resource, index))
      .filter((resource: any): resource is RoadmapResource => Boolean(resource)),
    children: Array.isArray(node.children)
      ? node.children
          .map(normalizeNode)
          .filter((child: any): child is RoadmapNode => Boolean(child))
      : []
  }
}

// The roadmap endpoint wraps its node array/root at an unpredictable depth
// (envelope, `data`, `roadmap`, `steps`, …). Walk the response and return the
// first array-of-nodes or root node found. Shared by the flat normalizer and
// the graph builder so the "where are the nodes" logic lives in one place.
const findRoadmapData = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return null;
  if (Array.isArray(obj)) {
    if (obj.length > 0 && (obj[0].nodeId || obj[0].id || obj[0].title || obj[0].name || obj[0].nodeName || obj[0].NodeName)) {
      return obj; // Found the array of nodes!
    }
    for (const item of obj) {
      const found = findRoadmapData(item);
      if (found) return found;
    }
    return null;
  }
  // Is this object itself a node?
  if (obj.nodeId || obj.id || obj.title || obj.name || obj.nodeName || obj.NodeName) {
    if (obj.children || obj.status || obj.level || obj.Level) return obj;
  }
  // Otherwise, search its keys
  for (const key of Object.keys(obj)) {
    const found = findRoadmapData(obj[key]);
    if (found) return found;
  }
  return null;
};

export const normalizeStudentRoadmap = (responseData: unknown): StudentRoadmap => {
  const data = unwrapResponse<any>(responseData)

  let rawNodes: any[] = []
  let targetCareerRole: string | undefined
  let progress: number | undefined

  if (data && typeof data === 'object') {
    const extractedData = findRoadmapData(data) || data;
    if (Array.isArray(extractedData)) {
      rawNodes = extractedData;
    } else if (extractedData && typeof extractedData === 'object') {
      rawNodes = [extractedData];
    }
    targetCareerRole = data.targetCareerRole || data.careerName || data.career_name || data.data?.targetCareerRole || data.data?.careerName
    progress = typeof data.progress === "number" ? data.progress : data.data?.progress
  }

  const flattenedNodes: any[] = [];
  const flattenNode = (node: any) => {
    if (!node) return;
    flattenedNodes.push(node);
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(flattenNode);
    }
  };
  rawNodes.forEach(flattenNode);

  return {
    targetCareerRole,
    progress,
    _rawResponse: responseData,
    nodes: flattenedNodes
      .map(normalizeNode)
      .filter((node): node is RoadmapNode => Boolean(node))
  }
}

export const normalizeRoadmapProgress = (data: unknown): RoadmapProgress => {
  const roadmap = unwrapResponse<RoadmapProgress>(data)
  return {
    ...roadmap,
    steps: Array.isArray(roadmap?.steps)
      ? roadmap.steps.map((step) => ({
          ...step,
          status: normalizeStatus(step.status)
        }))
      : []
  }
}

/**
 * Turn the raw roadmap payload into ReactFlow-ready `{ nodes, edges }`.
 * Pure: pass the payload the page already fetched (kept on `_rawResponse`) so the
 * roadmap endpoint isn't hit a second time just to draw the graph.
 */
export const buildRoadmapGraph = (responseData: unknown): { nodes: any[], edges: any[] } => {
  try {
    const rows: any[] = [];
    const nameToId: Record<string, string> = {};

    const registerNameId = (node: any) => {
      const name = String(node.title || node.name || node.NodeName || node.nodeName || node.node_name || "").trim();
      const id = String(node.nodeId || node.id || node.node_id || name).trim();
      if (name && id) nameToId[name] = id;
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(registerNameId);
      }
    };

    const flattenNode = (node: any, parentId: string | null = null) => {
      if (!node) return;
      const flattenedNode = { ...node };
      if (parentId && !flattenedNode.childNodeOf && !flattenedNode.ChildNodeOf && !flattenedNode.connectTo && !flattenedNode.ConnectTo) {
        flattenedNode.childNodeOf = parentId;
      }
      rows.push(flattenedNode);
      if (node.children && Array.isArray(node.children)) {
        const currentId = node.nodeId || node.id || node.node_id || node.nodeName || node.NodeName || node.title;
        node.children.forEach((child: any) => flattenNode(child, currentId));
      }
    };

    const extractedData = findRoadmapData(responseData) || responseData;

    if (Array.isArray(extractedData)) {
      extractedData.forEach(registerNameId);
      extractedData.forEach(item => flattenNode(item));
    } else if (extractedData && typeof extractedData === 'object') {
      registerNameId(extractedData);
      flattenNode(extractedData);
    }

    // The backend exposes the field as `nodeLevel`; keep the other aliases for safety.
    const readLevel = (r: any) => parseInt(String(r.nodeLevel ?? r.node_level ?? r.Level ?? r.level ?? 0)) || 0;

    // Main (spine) nodes are strictly those with an explicit level > 0.
    // Only their children rely on parent/previous; the spine itself is ordered by level.
    const actualMainNodes = rows
      .filter(r => readLevel(r) > 0)
      .sort((a, b) => readLevel(a) - readLevel(b));

    const nodes: any[] = [];
    const edges: any[] = [];

    const adjacencyList: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    rows.forEach((row, index) => {
      const nodeName = row.title || row.name || row.NodeName || row.nodeName || row.node_name || row.id || row.nodeId || `Node_${index}`;
      const isMainNode = actualMainNodes.some(m => m === row);
      const level = isMainNode ? (readLevel(row) || 1) : 0; // Maintain explicit level for UI

      const nodeId = String(row.nodeId || row.id || row.node_id || nodeName).trim();

      adjacencyList[nodeId] = adjacencyList[nodeId] || [];
      inDegree[nodeId] = inDegree[nodeId] || 0;

      let resources: any[] = [];
      const rawResourceData = row.resources || row.Resources || row.resource || row.Resource;

      if (rawResourceData) {
          const parseResourceField = (res: any) => {
              let parsed = res;
              if (typeof res === 'string') {
                  try { parsed = JSON.parse(res); } catch (e) { parsed = []; }
              }
              if (Array.isArray(parsed)) return parsed
                  .map((r: any, i: number) => ({
                      title: (r && typeof r === 'object' && r.title) ? r.title : `Resource ${i + 1}`,
                      url: typeof r === 'string' ? r : (r?.url || r?.link || "")
                  }))
                  .filter((x: { url: string }) => x.url);
              if (typeof parsed === 'object' && parsed !== null) return [{ title: parsed.title || "Resource", url: parsed.url || parsed.link || "" }].filter(x => x.url);
              return [];
          };
          resources = parseResourceField(rawResourceData);
      } else {
        if (row.Link1 || row.link1) resources.push({ title: row.Title1 || 'Resource 1', url: row.Link1 || row.link1 });
        if (row.Link2 || row.link2) resources.push({ title: row.Title2 || 'Resource 2', url: row.Link2 || row.link2 });
        if (row.Link3 || row.link3) resources.push({ title: row.Title3 || 'Resource 3', url: row.Link3 || row.link3 });
      }

      nodes.push({
        id: nodeId,
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          id: nodeId,
          label: nodeName,
          description: row.Description || row.description || row.NodeDescription || row.nodeDescription || row.content || row.desc || '',
          links: resources,
          level: level,
          status: normalizeStatus(row.Status || row.status),
          stage: row.stage || row.Stage || null,
          completedAt: row.completedAt ?? row.completed_at ?? null,
          completionPolicy: row.completionPolicy || row.completion_policy || null,
          // Hand-placed coordinates from the mentor editor; null = auto-layout.
          positionX: row.positionX ?? row.position_x ?? null,
          positionY: row.positionY ?? row.position_y ?? null,
          // FLM overlay: which FPT subjects teach this node + its lesson resources.
          fptCoverage: row.fptCoverage ?? row.fpt_coverage ?? null,
          fptResources: row.fptResources ?? row.fpt_resources ?? []
        }
      });
    });

    // roadmap.sh model:
    // - main/spine nodes (explicit level) chain to each other via previousNode,
    //   falling back to level order only when the data has no previous reference;
    // - child nodes hang off their parentNode (dashed) and may additionally
    //   chain between themselves via previousNode.
    const resolveRef = (raw: any): string | null => {
      if (!raw) return null;
      let refId = typeof raw === 'object'
        ? String(raw.nodeId || raw.id || raw.node_id || raw.title || raw.name || raw.nodeName || raw.node_name || raw.NodeName || '').trim()
        : String(raw).trim();
      if (refId && nameToId[refId]) refId = nameToId[refId];
      return refId || null;
    };

    const pushEdge = (sourceId: string, targetId: string, row: any, isSpineEdge: boolean) => {
      if (!sourceId || sourceId === targetId) return;
      if (edges.some(e => e.source === sourceId && e.target === targetId)) return;
      const status = normalizeStatus(row.Status || row.status);
      edges.push({
        id: `e-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'smoothstep',
        animated: status === 'in_progress' || status === 'current',
        style: {
          strokeWidth: isSpineEdge ? 3 : 2,
          strokeDasharray: isSpineEdge ? 'none' : '5 5'
        }
      });
      adjacencyList[sourceId] = adjacencyList[sourceId] || [];
      adjacencyList[sourceId].push(targetId);
      inDegree[targetId] = (inDegree[targetId] || 0) + 1;
    };

    rows.forEach(row => {
      const nodeName = row.title || row.name || row.NodeName || row.nodeName || row.node_name || row.id || row.nodeId;
      const nodeId = String(row.nodeId || row.id || row.node_id || nodeName).trim();
      const isMainNode = actualMainNodes.some(m => m === row);

      const parentId = resolveRef(row.parentNode || row.parent_node || row.childNodeOf || row.ChildNodeOf || row.child_node_of || row.connectTo || row.ConnectTo || row.connect_to || row.parentId || row.parent_id);
      let previousId = resolveRef(row.previousNode || row.previous_node || row.PreviousNode);

      // Record the parent id on the node so the UI knows which CHOOSE_ONE
      // group an alternative belongs to (needed to POST a selection).
      if (parentId) {
        const self = nodes.find(n => n.id === nodeId);
        if (self) self.data.parentNodeId = parentId;
      }

      if (isMainNode) {
        // Spine: previousNode is the source of truth; level order is only a fallback.
        if (!previousId && !parentId) {
          const mainNodeIndex = actualMainNodes.findIndex(m => m === row);
          if (mainNodeIndex > 0) {
            const prevMainNode = actualMainNodes[mainNodeIndex - 1];
            previousId = resolveRef(prevMainNode.nodeId || prevMainNode.id || prevMainNode.node_id || prevMainNode.title || prevMainNode.name || prevMainNode.NodeName || prevMainNode.nodeName || prevMainNode.node_name);
          }
        }
        if (previousId) pushEdge(previousId, nodeId, row, true);
        if (parentId) pushEdge(parentId, nodeId, row, true);
      } else {
        // Children: dashed hierarchy edge from the parent, plus an optional
        // dashed sequence edge chaining siblings via previousNode.
        if (parentId) pushEdge(parentId, nodeId, row, false);
        if (previousId) pushEdge(previousId, nodeId, row, false);
      }
    });

    return { nodes, edges };
  } catch (error) {
    console.error("[Student Roadmap] Failed to build roadmap graph:", error);
    return { nodes: [], edges: [] };
  }
}

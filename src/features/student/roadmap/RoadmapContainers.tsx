import { memo } from 'react';
import { getStageColor, getStageLabel } from '../lib/stageColors';

/**
 * Background container nodes for the roadmap graph. Both are purely decorative:
 * they render behind the interactive skill nodes (negative zIndex) and let all
 * pointer events fall through so clicks always land on the real nodes on top.
 */

interface ClusterBoxData {
  label?: string;
  stage?: string | null;
  side?: 'left' | 'right';
}

/**
 * Soft, stage-tinted rounded box that visually groups one topic's sub-skills
 * (the "topic cluster"). A small header pill carries the topic name so a
 * student reads the cluster as a labelled section.
 */
export const ClusterBoxNode = memo(({ data }: { data: ClusterBoxData }) => {
  const color = getStageColor(data.stage);
  return (
    <div
      className="relative h-full w-full rounded-[22px] border-2 border-dashed"
      style={{
        borderColor: `${color}`,
        backgroundColor: `${color}14`, // ~8% tint
        boxShadow: `inset 0 0 0 1px ${color}22`,
      }}
    >
      {data.label && (
        <div
          className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-2.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <span
            className="h-2 w-2 rounded-[3px] border border-black/50"
            style={{ backgroundColor: color }}
          />
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-800">
            {data.label}
          </span>
        </div>
      )}
    </div>
  );
});

ClusterBoxNode.displayName = 'ClusterBoxNode';

interface StageBandData {
  stage?: string | null;
}

/**
 * Full-width stage separator. Rather than a box framing the stage, it reads as a
 * horizontal divider line at the stage's top edge plus a faint colour wash over
 * the stage's rows — so stages separate by a clear line + colour, not a frame.
 */
export const StageBandNode = memo(({ data }: { data: StageBandData }) => {
  const color = getStageColor(data.stage);
  const label = getStageLabel(data.stage);
  // Horizontal divider line + its stage label. Once this divider scrolls above
  // the top of the canvas, the sticky header takes over showing the same label.
  return (
    <div className="relative h-full w-full" style={{ borderTop: `2px solid ${color}` }}>
      <div className="absolute -top-[13px] left-6 flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 shadow-sm">
        <span className="h-2.5 w-2.5 rounded-[3px] border border-black/40" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-700">{label}</span>
      </div>
    </div>
  );
});

StageBandNode.displayName = 'StageBandNode';

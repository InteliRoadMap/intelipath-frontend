import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Check, LockKeyhole, GitFork, Flag, GraduationCap } from 'lucide-react';
import { getStageColor } from '../lib/stageColors';

/** Short "dd MMM yyyy" label for a completion timestamp (e.g. 15 Jul 2026). */
const formatDoneDate = (raw?: string | null): string | null => {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

interface CustomRoadmapNodeProps {
  data: {
    label: string;
    status: 'completed' | 'current' | 'in_progress' | 'locked' | 'alternative';
    level?: number;
    stage?: string | null;
    themeColor?: string;
    isIsolated?: boolean;
    // v2 personalization
    selection?: 'ALL' | 'CHOOSE_ONE' | string;
    nodeKind?: 'CORE' | 'ALTERNATIVE' | 'OPTIONAL' | string;
    isOptional?: boolean;
    isCheckpoint?: boolean;
    isChosen?: boolean;
    completedAt?: string | null;
    // FLM overlay: set when ≥1 FPT subject teaches this node's skill.
    fptCoverage?: { covered?: boolean } | null;
  };
  selected?: boolean;
}

const CustomRoadmapNode = ({ data, selected }: CustomRoadmapNodeProps) => {
  const isAlternativeStatus = data.status === 'alternative';
  const isCompleted = data.status === 'completed';
  // "in_progress" = the student is actively learning this node (blue pulse + glow).
  // "current" = merely unlocked / up-next; reachable but not started, so it gets a
  // calm "available" treatment instead of looking like work already underway.
  const isInProgress = data.status === 'in_progress';
  const isAvailable = data.status === 'current';
  const isCurrent = isInProgress; // drives the active-focus visuals (glow, pulse, pressed)
  const isLocked = !isAlternativeStatus && !isCompleted && !isInProgress && !isAvailable;
  const isMain = data.level !== undefined && data.level > 0;
  const isIsolated = !!data.isIsolated;

  // v2 flags
  const isChooseGroup = data.selection === 'CHOOSE_ONE';
  const isAlternative = data.nodeKind === 'ALTERNATIVE';
  const isChosen = !!data.isChosen;
  const isOptional = !!data.isOptional;
  const isCheckpoint = !!data.isCheckpoint;

  // Node fill is its STAGE colour (so stages read as colour bands down the
  // spine); status is layered on top via opacity + badges rather than by
  // swapping the colour, so stage grouping survives every state.
  const stageColor = getStageColor(data.stage);

  // Turbo-style glow: a soft, animated coloured halo behind the card, only for
  // the node the student is on (current) or their chosen alternative.
  const glow = isCurrent
    ? 'from-indigo-400 via-sky-400 to-indigo-400'
    : isChosen
      ? 'from-emerald-400 via-teal-300 to-emerald-400'
      : '';
  const showGlow = (isCurrent || isChosen) && !isAlternativeStatus;

  // "FPT" corner badge — same neo-brutalist pill as the OPTION / Pick-one badges, in
  // orange, flagging that an FPT subject teaches this skill. Sits top-left (OPTION owns
  // top-right). When the node also shows a status dot in that corner, the badge slides
  // right so the two sit side by side instead of overlapping.
  const hasFpt = !!data.fptCoverage?.covered;
  const hasCornerDot = !isMain && (isInProgress || (isAvailable && !isChosen && !isCompleted));
  const FptBadge = hasFpt ? (
    <div className={`absolute -top-2 z-20 flex items-center gap-1 rounded-full border-2 border-black bg-orange-300 px-1.5 py-0.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${hasCornerDot ? 'left-5' : '-left-1'}`}>
      <GraduationCap size={9} strokeWidth={2.5} className="text-black" />
      <span className="text-[8px] font-black uppercase tracking-wider text-black">FPT</span>
    </div>
  ) : null;

  // Completion date — kept quiet (muted, no colour) so it doesn't fight the node.
  const doneDate = isCompleted ? formatDoneDate(data.completedAt) : null;
  const DoneCaption = doneDate ? (
    <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-white/70 px-1.5 py-0.5 ring-1 ring-slate-200/70">
      <Check size={8} strokeWidth={3} className="text-slate-400" />
      <span className="text-[8.5px] font-semibold tracking-wide text-slate-400">{doneDate}</span>
    </div>
  ) : null;

  if (isMain) {
    const shadowClass = selected || isCurrent
      ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[4px] translate-y-[4px]'
      : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-[2px] group-hover:-translate-x-[2px]';

    return (
      <div className="relative group cursor-pointer w-[280px]">
        {showGlow && (
          <div
            className={`pointer-events-none absolute -inset-[3px] rounded-full bg-gradient-to-r ${glow} opacity-60 blur-[10px] animate-pulse`}
          />
        )}
        <div
          style={{ backgroundColor: stageColor }}
          className={`
            relative z-10 flex items-center justify-center min-h-[64px] px-6 py-4
            rounded-full border-[3.5px] border-black
            transition-all duration-200 ease-out
            ${shadowClass}
            ${isLocked ? 'opacity-45 saturate-50' : ''}
            ${isCompleted ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
          `}
        >
          {isCompleted && <Check size={20} strokeWidth={4} className="text-black absolute left-5" />}
          {isLocked && <LockKeyhole size={18} strokeWidth={3} className="text-black/50 absolute left-5" />}
          {isCheckpoint && !isCompleted && !isLocked && <Flag size={17} strokeWidth={3} className="text-black absolute left-5" />}
          <p className="text-[15px] font-black uppercase tracking-[0.08em] text-black text-center w-full px-6">
            {data.label}
          </p>
        </div>

        {/* CHOOSE_ONE group badge — signals "pick exactly one below". */}
        {isChooseGroup && (
          <div className="absolute -top-2.5 -right-2 z-10 flex items-center gap-1 rounded-full border-2 border-black bg-amber-300 px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <GitFork size={11} strokeWidth={3} className="text-black" />
            <span className="text-[9px] font-black uppercase tracking-wider text-black">Pick one</span>
          </div>
        )}

        {FptBadge}
        {DoneCaption}

        {/* Handles */}
        <Handle type="target" position={Position.Top} id="t-top" className="w-1 h-1 opacity-0" />
        <Handle type="source" position={Position.Bottom} id="s-bottom" className="w-1 h-1 opacity-0" />
        <Handle type="target" position={Position.Left} id="t-left" className="w-1 h-1 opacity-0" />
        <Handle type="source" position={Position.Right} id="s-right" className="w-1 h-1 opacity-0" />
        <Handle type="source" position={Position.Left} id="s-left" className="w-1 h-1 opacity-0" />
        <Handle type="target" position={Position.Right} id="t-right" className="w-1 h-1 opacity-0" />
      </div>
    );
  }

  const subShadowClass = selected || isCurrent
    ? 'shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] translate-x-[3px] translate-y-[3px]'
    : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-[1px] group-hover:-translate-x-[1px]';

  // An alternative is a "pill" (fully rounded) rather than a rounded-rect, so
  // choose-one options read differently from ordinary sub-skills.
  const isPill = isAlternative;
  // Dashed border for: unchosen alternatives (greyed), optional nodes, isolated.
  const isDashed = isAlternativeStatus || isOptional || isIsolated;

  return (
    <div className="relative group cursor-pointer w-[240px]">
      {showGlow && (
        <div
          className={`pointer-events-none absolute -inset-[3px] ${isPill ? 'rounded-full' : 'rounded-xl'} bg-gradient-to-r ${glow} opacity-55 blur-[9px] animate-pulse`}
        />
      )}
      <div className={`
        relative z-10 flex items-center justify-between min-h-[56px] pl-6 pr-5 py-3
        border-[3px] border-black bg-white overflow-hidden
        transition-all duration-200 ease-out
        ${isPill ? 'rounded-full' : 'rounded-xl'}
        ${subShadowClass}
        ${isDashed ? 'border-dashed' : ''}
        ${isCurrent ? 'ring-2 ring-black ring-offset-2' : ''}
        ${isChosen ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
        ${isAlternativeStatus ? 'opacity-45 saturate-50' : isLocked ? 'opacity-60' : ''}
      `}>
        {/* Stage accent stripe: keeps the card white/readable while still
            carrying the node's stage identity. */}
        <span
          style={{ backgroundColor: stageColor }}
          className="absolute left-0 top-0 h-full w-[6px]"
        />
        <div className="flex-1">
          <p className={`text-[14px] font-bold tracking-wide leading-tight text-black ${isLocked || isAlternativeStatus ? 'opacity-60' : ''}`}>
            {data.label}
          </p>
        </div>
        <div className="shrink-0 ml-3">
          {isChosen && !isCompleted && (
            <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
              <Check size={14} strokeWidth={4} className="text-white" />
            </div>
          )}
          {isCompleted && (
            <div className="w-6 h-6 rounded-full bg-[#00ffa3] border-2 border-black flex items-center justify-center">
              <Check size={14} strokeWidth={4} className="text-black" />
            </div>
          )}
          {isLocked && !isChosen && (
            <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-black flex items-center justify-center">
              <LockKeyhole size={12} strokeWidth={3} className="text-black/50" />
            </div>
          )}
        </div>
      </div>

      {/* CHOOSE_ONE group that renders as a branch (e.g. "Pick a Database"). */}
      {isChooseGroup && (
        <div className="absolute -top-2.5 -right-2 z-10 flex items-center gap-1 rounded-full border-2 border-black bg-amber-300 px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <GitFork size={10} strokeWidth={3} className="text-black" />
          <span className="text-[8px] font-black uppercase tracking-wider text-black">Pick one</span>
        </div>
      )}

      {/* Alternative badge: "option" when the group is still open for this node,
          nothing extra once chosen (the emerald ring says it). */}
      {isAlternative && !isChosen && !isAlternativeStatus && (
        <div className="absolute -top-2 -right-1 z-10 flex items-center gap-1 rounded-full border-2 border-black bg-white px-1.5 py-0.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <GitFork size={9} strokeWidth={3} className="text-slate-700" />
          <span className="text-[8px] font-black uppercase tracking-wider text-slate-700">Option</span>
        </div>
      )}

      {FptBadge}
      {DoneCaption}

      {/* Handles */}
      <Handle type="target" position={Position.Top} id="t-top" className="w-1 h-1 opacity-0" />
      <Handle type="source" position={Position.Bottom} id="s-bottom" className="w-1 h-1 opacity-0" />
      <Handle type="target" position={Position.Left} id="t-left" className="w-1 h-1 opacity-0" />
      <Handle type="source" position={Position.Right} id="s-right" className="w-1 h-1 opacity-0" />
      <Handle type="source" position={Position.Left} id="s-left" className="w-1 h-1 opacity-0" />
      <Handle type="target" position={Position.Right} id="t-right" className="w-1 h-1 opacity-0" />

      {isInProgress && (
        <div className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_4px_10px_rgba(59,130,246,0.3)] ring-2 ring-white animate-pulse z-10 transition-transform group-hover:scale-110 duration-500">
          <div className="h-2 w-2 rounded-full bg-white"></div>
        </div>
      )}

      {/* "Available / up next": reachable but not started — a quiet static marker,
          no pulse, so it doesn't read as work already in progress. */}
      {isAvailable && !isChosen && !isCompleted && (
        <div className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-indigo-400 z-10">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
        </div>
      )}
    </div>
  );
};

export default memo(CustomRoadmapNode);

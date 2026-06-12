import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Check } from 'lucide-react';

interface CustomRoadmapNodeProps {
  data: {
    label: string;
    status: 'completed' | 'current' | 'in_progress' | 'locked';
    level?: number;
    themeColor?: string;
    isIsolated?: boolean;
  };
  selected?: boolean;
}

const CustomRoadmapNode = ({ data, selected }: CustomRoadmapNodeProps) => {
  const isCompleted = data.status === 'completed';
  const isCurrent = data.status === 'current' || data.status === 'in_progress';
  const isLocked = data.status === 'locked' || (!isCompleted && !isCurrent);
  const isMain = data.level && data.level > 0;
  const isIsolated = !!data.isIsolated;
  const isChild = !isMain && !isIsolated;
  
  const themeColor = data.themeColor || 'cyan';

  let gradientClass = '';
  let lightGradientClass = '';
  let textLightClass = '';

  switch (themeColor) {
    case 'emerald': 
      gradientClass = 'from-emerald-500 to-teal-600'; 
      lightGradientClass = 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-900';
      textLightClass = 'text-emerald-900';
      break;
    case 'violet': 
      gradientClass = 'from-violet-500 to-fuchsia-600'; 
      lightGradientClass = 'bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-900';
      textLightClass = 'text-violet-900';
      break;
    case 'amber': 
      gradientClass = 'from-amber-400 to-orange-500'; 
      lightGradientClass = 'bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900';
      textLightClass = 'text-amber-900';
      break;
    case 'rose': 
      gradientClass = 'from-rose-400 to-red-600'; 
      lightGradientClass = 'bg-gradient-to-br from-rose-50 to-red-50 text-rose-900';
      textLightClass = 'text-rose-900';
      break;
    case 'monochrome': 
      gradientClass = 'from-slate-700 to-slate-900'; 
      lightGradientClass = 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-900';
      textLightClass = 'text-slate-900';
      break;
    case 'cyan':
    default: 
      gradientClass = 'from-cyan-500 to-blue-600'; 
      lightGradientClass = 'bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-900';
      textLightClass = 'text-cyan-900';
      break;
  }

  return (
    <div className="w-[280px] min-h-[70px] relative group cursor-pointer">
      
      {/* Outer Shell (Double-Bezel) */}
      <div className={`w-full h-full rounded-[1.5rem] p-1.5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${selected ? 'shadow-[0_16px_40px_rgb(0,0,0,0.12)] scale-[1.02] ring-1 ring-black/10' : 'shadow-[0_4px_20px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.04] group-hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] group-hover:scale-[1.02]'}
        ${isMain ? `bg-gradient-to-br ${gradientClass}` : isIsolated ? 'bg-white ring-1 ring-slate-200 border border-dashed border-slate-300' : 'bg-white'}
      `}>
        {/* Inner Core */}
        <div className={`w-full h-full rounded-[calc(1.5rem-0.375rem)] px-5 py-3 flex flex-col justify-center items-center text-center transition-colors duration-700
          ${isMain ? 'bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md' : 
            isIsolated ? 'bg-slate-50/50 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]' : 
            `${lightGradientClass} shadow-[inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-black/[0.03]`}
          ${isChild && isCompleted ? 'ring-1 ring-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]' : ''}
          ${isChild && isCurrent ? 'ring-1 ring-blue-500/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : ''}
          ${isMain && isCompleted ? 'ring-1 ring-emerald-300/60 shadow-[inset_0_0_20px_rgba(16,185,129,0.3)]' : ''}
          ${isMain && isCurrent ? 'ring-1 ring-white/60 shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]' : ''}
        `}>
          <p className={`text-[14px] font-semibold tracking-wide leading-snug transition-colors duration-500
            ${isMain ? (isLocked ? 'text-white/60' : 'text-white') : 
              isIsolated ? (isLocked ? 'text-slate-400' : 'text-slate-500') :
              (isLocked ? 'text-slate-400/80' : textLightClass)}
          `}>
            {data.label}
          </p>
        </div>
      </div>

      {/* Target Handles (Nhận dây) */}
      <Handle type="target" position={Position.Top} id="t-top" className="w-1 h-1 opacity-0" />
      <Handle type="target" position={Position.Left} id="t-left" className="w-1 h-1 opacity-0" />
      <Handle type="target" position={Position.Right} id="t-right" className="w-1 h-1 opacity-0" />

      {/* Source Handles (Phóng dây) */}
      <Handle type="source" position={Position.Bottom} id="s-bottom" className="w-1 h-1 opacity-0" />
      <Handle type="source" position={Position.Left} id="s-left" className="w-1 h-1 opacity-0" />
      <Handle type="source" position={Position.Right} id="s-right" className="w-1 h-1 opacity-0" />

      {/* Status Badges */}
      {isCompleted && (
        <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)] ring-2 ring-white z-10 transition-transform group-hover:scale-110 duration-500">
          <Check size={12} strokeWidth={3} />
        </div>
      )}
      {isCurrent && (
        <div className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_4px_10px_rgba(59,130,246,0.3)] ring-2 ring-white animate-pulse z-10 transition-transform group-hover:scale-110 duration-500">
          <div className="h-2 w-2 rounded-full bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default memo(CustomRoadmapNode);

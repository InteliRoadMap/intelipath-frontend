import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Check, LockKeyhole } from 'lucide-react';

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
  const isMain = data.level !== undefined && data.level > 0;
  const isIsolated = !!data.isIsolated;
  
  const themeColor = data.themeColor || 'amber';

  const getVividColor = () => {
    if (isCompleted) return 'bg-[#00ffa3]'; 
    if (isLocked && !isCurrent) return 'bg-slate-300'; 
    
    switch (themeColor) {
      case 'cyan': return 'bg-[#00f0ff]';
      case 'emerald': return 'bg-[#00ffa3]';
      case 'violet': return 'bg-[#b05dff]';
      case 'amber': return 'bg-[#ffe500]';
      case 'rose': return 'bg-[#ff3b8d]';
      case 'monochrome': return 'bg-white';
      default: return 'bg-[#ffe500]';
    }
  };

  if (isMain) {
    const bgColor = getVividColor();
    const shadowClass = selected || isCurrent 
      ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[4px] translate-y-[4px]' 
      : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-[2px] group-hover:-translate-x-[2px]';

    return (
      <div className="relative group cursor-pointer w-[280px]">
        <div className={`
          flex items-center justify-center min-h-[64px] px-6 py-4 
          rounded-full border-[3.5px] border-black
          transition-all duration-200 ease-out
          ${bgColor} ${shadowClass}
        `}>
          {isCompleted && <Check size={20} strokeWidth={4} className="text-black absolute left-5" />}
          {isLocked && !isCompleted && !isCurrent && <LockKeyhole size={18} strokeWidth={3} className="text-black/50 absolute left-5" />}
          <p className="text-[15px] font-black uppercase tracking-[0.08em] text-black text-center w-full px-6">
            {data.label}
          </p>
        </div>

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

  return (
    <div className="relative group cursor-pointer w-[240px]">
      <div className={`
        flex items-center justify-between min-h-[56px] px-5 py-3 
        rounded-xl border-[3px] border-black bg-white
        transition-all duration-200 ease-out
        ${subShadowClass}
        ${isIsolated ? 'border-dashed' : ''}
        ${isCurrent ? 'ring-2 ring-black ring-offset-2' : ''}
      `}>
        <div className="flex-1">
          <p className={`text-[14px] font-bold tracking-wide leading-tight text-black ${isLocked && !isCurrent ? 'opacity-50' : ''}`}>
            {data.label}
          </p>
        </div>
        <div className="shrink-0 ml-3">
          {isCompleted && (
            <div className="w-6 h-6 rounded-full bg-[#00ffa3] border-2 border-black flex items-center justify-center">
              <Check size={14} strokeWidth={4} className="text-black" />
            </div>
          )}
          {isLocked && !isCompleted && !isCurrent && (
            <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-black flex items-center justify-center">
              <LockKeyhole size={12} strokeWidth={3} className="text-black/50" />
            </div>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} id="t-top" className="w-1 h-1 opacity-0" />
      <Handle type="source" position={Position.Bottom} id="s-bottom" className="w-1 h-1 opacity-0" />
      <Handle type="target" position={Position.Left} id="t-left" className="w-1 h-1 opacity-0" />
      <Handle type="source" position={Position.Right} id="s-right" className="w-1 h-1 opacity-0" />
      <Handle type="source" position={Position.Left} id="s-left" className="w-1 h-1 opacity-0" />
      <Handle type="target" position={Position.Right} id="t-right" className="w-1 h-1 opacity-0" />
      
      {isCurrent && (
        <div className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_4px_10px_rgba(59,130,246,0.3)] ring-2 ring-white animate-pulse z-10 transition-transform group-hover:scale-110 duration-500">
          <div className="h-2 w-2 rounded-full bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default memo(CustomRoadmapNode);

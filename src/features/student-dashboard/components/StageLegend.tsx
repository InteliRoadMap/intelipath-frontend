import { STAGE_LEGEND } from "../lib/stageColors";

/**
 * Compact floating legend that maps each stage colour to its label, so a
 * student can read the colour bands on the roadmap graph.
 */
const StageLegend = () => {
  return (
    <div className="absolute top-4 left-4 z-20 bg-white/70 backdrop-blur-md rounded-xl ring-1 ring-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.06)] px-3.5 py-3">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        Stages
      </p>
      <div className="flex flex-col gap-1.5">
        {STAGE_LEGEND.map((stage) => (
          <div key={stage.key} className="flex items-center gap-2">
            <span
              style={{ backgroundColor: stage.color }}
              className="h-3 w-3 rounded-[4px] border-2 border-black shrink-0"
            />
            <span className="text-[11px] font-semibold text-slate-700">{stage.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageLegend;

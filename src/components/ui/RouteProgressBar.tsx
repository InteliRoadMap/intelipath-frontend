export default function RouteProgressBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-cyan-50">
      <div className="h-full w-1/3 rounded-r-full bg-[#00838f] shadow-[0_0_18px_rgba(0,131,143,0.45)] [animation:route-progress_1.2s_ease-in-out_infinite]" />
      <style>{`
        @keyframes route-progress {
          0% { transform: translateX(-110%); }
          70% { transform: translateX(260%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  )
}

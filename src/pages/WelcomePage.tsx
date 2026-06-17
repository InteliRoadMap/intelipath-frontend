import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  ArrowRight,
  MapTrifold,
  Code,
  Terminal
} from "@phosphor-icons/react"
import { ROUTES } from "@/shared"

export default function WelcomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.2 } })
    
    // Navbar entry
    tl.fromTo(".floating-nav", 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    
    // Hero Text Group
    tl.fromTo(".hero-elem", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 1 },
      "-=0.4"
    )

    // Hero Cards Entry - CLEAN Wrapper Animation (No conflicts with Parallax)
    tl.fromTo(".card-wrapper",
      { 
        y: 100, 
        opacity: 0,
        scale: 0.85
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        stagger: 0.15, 
        duration: 1.4,
        ease: "back.out(1.2)"
      },
      "-=0.6"
    )

    // Subtle continuous breathing effect on Wrappers
    gsap.to(".card-wrapper", {
      y: "+=12",
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.2
    })

  }, { scope: containerRef })

  // 3D Mouse Parallax - Applied to INNER layers for depth!
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 30; // Max 15px shift
      const y = (clientY / window.innerHeight - 0.5) * 30;
      
      const tiltX = y * -0.6; // Inverse mouse Y for natural tilt
      const tiltY = x * 0.6;  // Mouse X tilts Y axis
      
      gsap.to(".parallax-layer-1", { 
        x: x * 0.6, y: y * 0.6, 
        rotateX: tiltX, rotateY: tiltY,
        duration: 0.8, ease: "power2.out" 
      });
      gsap.to(".parallax-layer-2", { 
        x: x * 1.5, y: y * 1.5, 
        rotateX: tiltX * 1.5, rotateY: tiltY * 1.5,
        duration: 0.8, ease: "power2.out" 
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} style={{ fontFamily: 'var(--font-manrope)' }} className="relative w-full h-screen overflow-hidden bg-[#f4f1ea] text-[#0a0a0a] selection:bg-cyan-200 flex flex-col">
      
      {/* =========================================
          BACKGROUND - Textured Paper
          ========================================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-[0.15] grayscale contrast-125" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/60 via-transparent to-black/5" />
      </div>

      {/* =========================================
          FLOATING NAVBAR
          ========================================= */}
      <nav className="floating-nav relative z-50 pt-6 px-6 sm:px-12 flex justify-between items-center pointer-events-none opacity-0">
        <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-3 rounded-full shadow-[var(--shadow-taste-2)] border border-white">
          <div className="bg-[#0a0a0a] text-white p-1.5 rounded-[10px]">
            <MapTrifold size={16} weight="fill" />
          </div>
          <span className="font-bold text-[14px] tracking-tight text-[#0a0a0a]">InteliPath</span>
        </div>

        <div className="pointer-events-auto hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-[var(--shadow-taste-2)] border border-white">
          <Link to={ROUTES.LOGIN} className="flex items-center gap-2 bg-[#0a0a0a] !text-white px-5 py-2 rounded-full text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-sm">
            <span className="text-white">Log in</span> <ArrowRight size={12} weight="bold" className="text-white" />
          </Link>
        </div>
      </nav>

      {/* =========================================
          HERO SECTION (100vh Centered)
          ========================================= */}
      <main className="relative z-10 flex-1 flex items-center px-6 sm:px-12 pb-10">
        <div className="mx-auto w-full max-w-[1400px] grid lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full">
            
          {/* ---------------- LEFT CONTENT ---------------- */}
          <div className="flex flex-col items-start mt-8">

            <h1 className="hero-elem text-[clamp(3.5rem,6vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[#0a0a0a] mb-4 drop-shadow-sm opacity-0">
              InteliPath
            </h1>
            <h2 className="hero-elem text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[#3f3f46] mb-6 max-w-xl opacity-0">
              The AI-Powered Career Roadmap for Students
            </h2>

            <p className="hero-elem text-[18px] font-medium text-cyan-600 mb-8 opacity-0">
              Less guessing, more building.
            </p>

            <p className="hero-elem text-[16px] leading-[26px] text-[#52525b] mb-10 max-w-md opacity-0">
              Dynamic roadmaps that adapt to your GitHub commits, market trends, and learning pace. Stop wandering, start shipping.
            </p>

            <div className="hero-elem flex flex-wrap items-center gap-4 opacity-0">
              <Link
                to={ROUTES.LOGIN}
                className="group flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-8 text-[15px] font-semibold !text-white transition-all duration-200 hover:bg-slate-800 shadow-[var(--shadow-taste-2)]"
              >
                <span className="text-white">Start your roadmap</span> <ArrowRight size={14} weight="bold" className="text-white transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="group flex h-[48px] items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-semibold text-[#0a0a0a] transition-all duration-200 hover:bg-slate-50 shadow-[var(--shadow-taste-1)] border border-slate-200/60"
              >
                Read the docs <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1 text-slate-400" />
              </a>
            </div>
          </div>

          {/* ---------------- RIGHT CONTENT: STRUCTURED CARDS WITH 3D ---------------- */}
          <div className="relative w-full h-[540px] max-w-[640px] mx-auto hidden lg:block" style={{ perspective: "1600px" }}>
            
            {/* WRAPPER 1: Handles Static Positioning, Rotation Z, and Entrance Animation */}
            <div className="card-wrapper absolute top-4 right-0 z-10 opacity-0" style={{ transform: "rotateZ(2deg)" }}>
              {/* INNER LAYER 1: Handles Mouse Parallax (X, Y, RotateX, RotateY) */}
              <div className="parallax-layer-1 w-[520px] h-[340px] bg-[#ffffff]/90 backdrop-blur-xl rounded-[24px] p-2 shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-white" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-full h-full bg-slate-50/50 rounded-[18px] border border-slate-100 overflow-hidden flex flex-col relative">
                  <div className="h-10 border-b border-slate-200/60 flex items-center px-4 justify-between bg-white/60">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="h-4 w-24 bg-slate-200/80 rounded-md" />
                    <div className="w-5 h-5 rounded-full bg-cyan-100" />
                  </div>
                  <div className="flex-1 p-8 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20">
                    <h3 className="text-[28px] font-medium text-slate-900 tracking-tight leading-none mb-8 relative z-10">
                      Frontend Architecture <br/> <span className="text-cyan-600 font-serif italic text-[32px]">mastery.</span>
                    </h3>
                    
                    {/* Nodes */}
                    <div className="absolute top-[130px] left-10 w-44 h-16 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center px-4 gap-3 z-10">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px]">01</div>
                      <div className="h-2 w-20 bg-slate-200 rounded-full" />
                    </div>
                    <div className="absolute top-[200px] left-32 w-52 h-16 bg-white border border-cyan-200 rounded-xl shadow-md flex items-center px-4 gap-3 ring-4 ring-cyan-50 z-10">
                      <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600"><Terminal size={14} weight="bold"/></div>
                      <div className="h-2.5 w-24 bg-slate-800 rounded-full" />
                    </div>
                    {/* Connecting lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                      <path d="M 120 160 C 120 180, 160 180, 160 210" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* WRAPPER 2 */}
            <div className="card-wrapper absolute bottom-6 left-0 z-20 opacity-0" style={{ transform: "rotateZ(-3deg)" }}>
              {/* INNER LAYER 2 */}
              <div className="parallax-layer-2 w-[420px] bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-[20px] p-1 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-white/10" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-full h-full bg-[#18181b]/50 rounded-[16px] overflow-hidden flex flex-col relative">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0a0a0a]/30">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-2"><Code size={12}/> RoadmapNode.tsx</span>
                    <div className="w-10" />
                  </div>
                  <div className="p-6 font-mono text-[13px] leading-[22px] text-slate-300">
                    <p><span className="text-pink-500">import</span> {'{'} <span className="text-cyan-300">Card</span> {'}'} <span className="text-pink-500">from</span> <span className="text-green-300">'@/ui/card'</span></p>
                    <p className="mt-5"><span className="text-pink-500">export default function</span> <span className="text-blue-400">Node</span>() {'{'}</p>
                    <p className="ml-4"><span className="text-pink-500">return</span> (</p>
                    <p className="ml-8"><span className="text-slate-400">&lt;</span><span className="text-cyan-400">Card</span> <span className="text-emerald-300">className</span><span className="text-slate-400">=</span><span className="text-green-300">"glass-card"</span><span className="text-slate-400">&gt;</span></p>
                    <p className="ml-12"><span className="text-slate-400">&lt;</span><span className="text-cyan-400">h1</span><span className="text-slate-400">&gt;</span>InteliPath<span className="text-slate-400">&lt;/</span><span className="text-cyan-400">h1</span><span className="text-slate-400">&gt;</span></p>
                    <p className="ml-12"><span className="text-slate-400">&lt;</span><span className="text-cyan-400">p</span><span className="text-slate-400">&gt;</span>Anti-Slop AI roadmaps.<span className="text-slate-400">&lt;/</span><span className="text-cyan-400">p</span><span className="text-slate-400">&gt;</span></p>
                    <p className="ml-8"><span className="text-slate-400">&lt;/</span><span className="text-cyan-400">Card</span><span className="text-slate-400">&gt;</span></p>
                    <p className="ml-4">)</p>
                    <p>{'}'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}

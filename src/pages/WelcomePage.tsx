import { useRef } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowRight,
  Brain,
  ChartLineUp,
  CheckCircle,
  GithubLogo,
  MapTrifold,
  Target,
  TrendUp
} from "@phosphor-icons/react"
import { Header } from "@/components/ui"
import { ROUTES } from "@/shared"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const capabilities = [
  {
    title: "Dynamic roadmap",
    description: "A prioritized learning sequence built around your target career and current skill set.",
    icon: MapTrifold,
    iconClassName: "bg-cyan-50 text-cyan-800"
  },
  {
    title: "Skill intelligence",
    description: "See required, selected, and missing skills together so the next move stays obvious.",
    icon: Target,
    iconClassName: "bg-emerald-50 text-emerald-700"
  },
  {
    title: "AI mentor context",
    description: "Ask questions with your profile, roadmap, GitHub, and market signals available as context.",
    icon: Brain,
    iconClassName: "bg-violet-50 text-violet-700"
  }
]

const journeySteps = [
  {
    number: "01",
    title: "Set your direction",
    description: "Choose a target career and complete the profile that shapes your recommendations."
  },
  {
    number: "02",
    title: "Map the gap",
    description: "Compare your current skills with the capabilities required for that role."
  },
  {
    number: "03",
    title: "Move with focus",
    description: "Follow the roadmap, review market signals, and ask the AI mentor when you get stuck."
  }
]

export default function WelcomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrubTextRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    // 1. Hero Animations (Staggered Entry)
    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.4 } })
    
    tl.fromTo(".hero-text-line", 
      { yPercent: 120, opacity: 0, rotateZ: 2 },
      { yPercent: 0, opacity: 1, rotateZ: 0, stagger: 0.1, duration: 1.8 }
    )
    .fromTo(".hero-pill", 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1 },
      "-=1.2"
    )
    .fromTo(".hero-image-block",
      { xPercent: 20, opacity: 0, scale: 0.95 },
      { xPercent: 0, opacity: 1, scale: 1, duration: 1.8 },
      "-=1.4"
    )

    // 2. Card Stacking & Scale
    gsap.utils.toArray<HTMLElement>(".bento-card").forEach((card, i) => {
      gsap.fromTo(card,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: i * 0.1
        }
      )
    })

    // 3. Scrubbing Text Reveal (Desire Section)
    if (scrubTextRef.current) {
      const splitText = scrubTextRef.current.innerText.split(/(\s+)/)
      scrubTextRef.current.innerHTML = ""
      
      splitText.forEach((word) => {
        if (word.trim() === "") {
          scrubTextRef.current?.appendChild(document.createTextNode(word))
        } else {
          const span = document.createElement("span")
          span.innerText = word
          span.className = "scrub-word opacity-10"
          scrubTextRef.current?.appendChild(span)
        }
      })

      gsap.to(".scrub-word", {
        scrollTrigger: {
          trigger: scrubTextRef.current,
          start: "top 75%",
          end: "bottom 40%",
          scrub: 1.5,
        },
        opacity: 1,
        stagger: 0.1,
        ease: "none"
      })
    }

  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full max-w-full overflow-x-hidden bg-linear-to-br from-blue-50 via-white to-blue-100 font-sans text-slate-900 selection:bg-cyan-200">
      
      {/* Shared AuthLayout Background Engine */}
      <div className="absolute inset-0 z-0 grid-overlay-light pointer-events-none opacity-60" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] animate-[spin_120s_linear_infinite] rounded-full bg-gradient-radial from-blue-400/20 via-sky-300/10 to-transparent blur-3xl" />
        <div className="absolute left-1/4 top-1/4 h-[80%] w-[80%] animate-[spin_90s_linear_infinite_reverse] rounded-full bg-gradient-radial from-cyan-300/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="fixed inset-x-0 top-0 z-50">
        <Header />
      </div>

      <main className="relative z-10 pt-[74px]">
        {/* =========================================
            ATTENTION (HERO) - Editorial Split
            ========================================= */}
        <section className="relative flex min-h-[90vh] items-center px-4 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid w-full max-w-[1440px] gap-16 lg:grid-cols-2 lg:items-center">
            
            <div className="flex flex-col items-start justify-center">
              {/* 2-Line Iron Rule Enforced */}
              <h1 className="w-full max-w-4xl font-display text-[clamp(3.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-slate-950">
                <div className="overflow-hidden pb-2"><div className="hero-text-line">Map the gap.</div></div>
                <div className="overflow-hidden pb-2"><div className="hero-text-line text-cyan-700">Move with focus.</div></div>
              </h1>

              <div className="overflow-hidden mt-8 max-w-xl">
                <p className="hero-text-line text-lg leading-relaxed text-slate-600 sm:text-xl">
                  Turn your target role into a precise learning sequence. We connect your profile, GitHub signals, and AI context into one unified workspace.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-cyan-500 px-8 text-[15px] font-bold text-white transition-all duration-500 hover:scale-[1.02] hover:bg-cyan-400 hover:shadow-[0_12px_30px_rgba(6,182,212,0.4)] active:scale-95"
                >
                  <span className="relative z-10">Start with InteliPath</span>
                  <ArrowRight size={18} weight="bold" className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Media Right - GSAP Physics Block */}
            <div className="hero-image-block relative hidden aspect-square w-full max-w-[600px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cyan-100/40 to-blue-50/10 border border-white/40 shadow-2xl backdrop-blur-2xl lg:block">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity opacity-40 contrast-125" />
              
              {/* Complex Floating UI Elements */}
              <div className="absolute bottom-10 left-10 flex flex-col gap-5 w-[85%] max-w-[340px]">
                {/* Widget 1: Progress Tracker */}
                <div className="group relative flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/80 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-inner">
                        <MapTrifold size={20} weight="fill" className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Module</p>
                        <p className="font-display text-sm font-bold text-slate-900">React Architecture</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[10px] font-bold text-cyan-800">In Progress</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                    <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 relative">
                      <div className="absolute inset-0 w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </div>
                  </div>
                  <p className="text-right text-[10px] font-bold text-slate-500">65% Completed</p>
                </div>

                {/* Widget 2: Skill Insight */}
                <div className="group relative flex flex-col gap-3 rounded-2xl border border-white/40 bg-slate-900/90 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-transform hover:-translate-y-1 translate-x-12">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-indigo-500/30 bg-indigo-500/20">
                      <Target size={20} weight="duotone" className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Identified Gap</p>
                      <p className="font-display text-sm font-bold text-white">TypeScript Generics</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">High Priority</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">Market Demand: 94%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            INTEREST (BENTO) - Gapless grid-flow-dense
            ========================================= */}
        <section className="relative px-4 py-32 sm:px-8 md:py-48 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="bento-card mb-20 max-w-3xl">
              <h2 className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-bold leading-[1.1] text-slate-950">
                A single connected <span className="text-cyan-700">workspace</span>.
              </h2>
            </div>

            {/* Mathematically interlocking 3-column dense grid */}
            <div className="grid grid-flow-dense grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              {/* Card 1: Huge 2x2 */}
              <div className="bento-card group relative col-span-1 row-span-1 overflow-hidden rounded-[2rem] bg-slate-950 p-8 md:col-span-2 md:row-span-2 md:p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-screen transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end pt-32">
                  <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                    <Brain size={28} weight="duotone" className="text-cyan-300" />
                  </div>
                  <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">AI Mentor Context</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-400">
                    Your queries are inherently aware of your roadmap, GitHub commits, and market requirements. Never explain your skill level to the AI again.
                  </p>
                </div>
              </div>

              {/* Card 2: 1x1 Complex Roadmap Widget */}
              <div className="bento-card group relative col-span-1 row-span-1 flex flex-col overflow-hidden rounded-[2rem] bg-white p-8 border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/3 rounded-full bg-cyan-100/50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                <div className="relative z-10 mb-6 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 border border-cyan-100">
                    <MapTrifold size={24} weight="duotone" className="text-cyan-700" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Live Sync</span>
                </div>
                <h3 className="relative z-10 font-display text-2xl font-bold text-slate-900">Dynamic Roadmap</h3>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-600">
                  A prioritized learning sequence built specifically around your target career.
                </p>
                {/* Internal UI Widget */}
                <div className="relative z-10 mt-8 flex flex-col gap-4 border-l-2 border-slate-100 pl-4">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <p className="text-xs font-bold text-slate-900">1. Core Foundations</p>
                    <p className="text-[10px] font-semibold text-emerald-600">Completed</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-500 ring-4 ring-white" />
                    <p className="text-xs font-bold text-slate-900">2. Advanced State Management</p>
                    <p className="text-[10px] font-semibold text-cyan-600">Current Focus</p>
                  </div>
                  <div className="relative opacity-50">
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                    <p className="text-xs font-bold text-slate-900">3. System Architecture</p>
                    <p className="text-[10px] font-semibold text-slate-500">Locked</p>
                  </div>
                </div>
              </div>

              {/* Card 3: 1x1 Complex Skill Widget */}
              <div className="bento-card group relative col-span-1 row-span-1 flex flex-col overflow-hidden rounded-[2rem] bg-white p-8 border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                 <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/3 rounded-full bg-emerald-100/50 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                <div className="relative z-10 mb-6 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 border border-emerald-100">
                    <Target size={24} weight="duotone" className="text-emerald-700" />
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-800 uppercase">Analysis</span>
                </div>
                <h3 className="relative z-10 font-display text-2xl font-bold text-slate-900">Skill Intelligence</h3>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-600">
                  See required, selected, and missing skills together so the next move stays obvious.
                </p>
                {/* Internal UI Widget - Bar Chart */}
                <div className="relative z-10 mt-auto pt-8">
                  <div className="flex h-24 items-end gap-2 border-b border-slate-100 pb-2">
                    {[40, 75, 50, 90, 60, 100].map((height, i) => (
                      <div key={i} className="group/bar relative flex h-full flex-1 flex-col justify-end">
                        <div 
                          className={`w-full rounded-t-md transition-all duration-500 group-hover/bar:brightness-110 ${i === 5 ? "bg-emerald-500" : i === 3 ? "bg-cyan-500" : "bg-slate-200"}`} 
                          style={{ height: `${height}%` }}
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover/bar:opacity-100">
                          <div className="whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white shadow-xl">{height}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================
            DESIRE - Scrubbing Text Reveal
            ========================================= */}
        <section className="relative px-4 py-32 sm:px-8 md:py-48 lg:px-12">
          <div className="mx-auto max-w-[1000px] text-center">
            <h2 
              ref={scrubTextRef} 
              className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.2] tracking-tight text-slate-900"
            >
              Stop collecting bookmarks and endless tutorials. Start moving through a sequence designed specifically for your career trajectory.
            </h2>
          </div>
        </section>

        {/* =========================================
            ACTION - Massive CTA Footer
            ========================================= */}
        <section className="relative overflow-hidden bg-slate-950 px-4 py-32 sm:px-8 md:py-48 lg:px-12">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          
          <div className="relative z-10 mx-auto max-w-[1440px] text-center">
            <h2 className="mx-auto max-w-4xl font-display text-[clamp(3.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white">
              Ready to focus your learning?
            </h2>
            <div className="mt-12 flex justify-center">
              <Link
                to={ROUTES.LOGIN}
                className="group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-full bg-cyan-500 px-10 text-lg font-bold text-white transition-all duration-500 hover:scale-[1.02] hover:bg-cyan-400 hover:shadow-[0_12px_40px_rgba(6,182,212,0.4)] active:scale-95"
              >
                <span className="relative z-10">Start with InteliPath</span>
                <ArrowRight size={20} weight="bold" className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-20 border-t border-slate-800 bg-slate-950 px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display font-bold text-white">InteliPath</p>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2">
              <GithubLogo size={16} weight="duotone" />
              GitHub-aware guidance
            </span>
            <span className="flex items-center gap-2">
              <TrendUp size={16} weight="duotone" />
              Market-aware learning
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

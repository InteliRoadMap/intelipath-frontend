import { useRef } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  ArrowRight,
  Brain,
  ChartLineUp,
  Code,
  Compass,
  Path,
  Play,
  Robot,
  Sparkle
} from "@phosphor-icons/react"
import { Logo } from "@/components/ui"
import { ROUTES } from "@/shared"
import robotHead from "@/assets/robot/head.png"
import robotBody from "@/assets/robot/body.png"
import robotLeftArm from "@/assets/robot/left-arm.png"
import robotRightArm from "@/assets/robot/right-arm.png"
import "@/styles/welcome-demo.css"

gsap.registerPlugin(useGSAP)

const featureCards = [
  {
    label: "Signal",
    title: "Skill gap scan",
    text: "Compare your current ability with role-ready expectations.",
    icon: ChartLineUp
  },
  {
    label: "Path",
    title: "Adaptive roadmap",
    text: "Milestones shift around your goal, pace, and learning history.",
    icon: Path
  },
  {
    label: "Mentor",
    title: "AI guidance loop",
    text: "Ask for next actions, blockers, resources, and review notes.",
    icon: Brain
  }
]

const marqueeItems = ["Roadmap", "Skills", "Career Role", "AI Mentor", "Market Pulse", "Progress"]

export default function WelcomeDemo() {
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 900px)"
      },
      (context) => {
        const conditions = context.conditions as { reduceMotion?: boolean; desktop?: boolean }

        if (conditions.reduceMotion) {
          gsap.set(".welcome-demo-reveal, .welcome-demo-card, .welcome-demo-stage-piece", {
            autoAlpha: 1,
            clearProps: "transform"
          })
          return
        }

        const intro = gsap.timeline({
          defaults: {
            duration: 0.8,
            ease: "power4.out"
          }
        })

        intro
          .from(".welcome-demo-nav", { y: -26, autoAlpha: 0 })
          .from(".welcome-demo-reveal", {
            y: 48,
            autoAlpha: 0,
            stagger: 0.08
          }, "-=0.35")
          .from(".welcome-demo-stage-piece", {
            y: 42,
            rotation: (index) => [-5, 4, -2, 5][index] ?? 0,
            autoAlpha: 0,
            stagger: 0.09
          }, "-=0.55")
          .from(".welcome-demo-card", {
            y: 34,
            autoAlpha: 0,
            stagger: 0.08
          }, "-=0.4")

        gsap.to(".welcome-demo-robot-stack", {
          y: conditions.desktop ? -18 : -10,
          rotation: 2,
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        })

        gsap.to(".welcome-demo-ribbon-track", {
          xPercent: -50,
          duration: 18,
          ease: "none",
          repeat: -1
        })

        gsap.to(".welcome-demo-code-line span", {
          scaleX: () => gsap.utils.random(0.46, 1),
          transformOrigin: "left center",
          duration: 1.2,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.18
        })
      }
    )

    return () => media.revert()
  }, { scope: pageRef })

  return (
    <div ref={pageRef} className="welcome-demo-page">
      <header className="welcome-demo-nav">
        <Logo hideIcon className="welcome-demo-logo" />
        <nav className="welcome-demo-actions" aria-label="Welcome demo navigation">
          <Link to={ROUTES.LOGIN} className="welcome-demo-ghost">
            Sign in
          </Link>
          <Link to={ROUTES.REGISTER} className="welcome-demo-pill">
            Start
            <ArrowRight size={16} weight="bold" />
          </Link>
        </nav>
      </header>

      <main>
        <section className="welcome-demo-hero">
          <div className="welcome-demo-backdrop" aria-hidden="true">
            <div className="welcome-demo-mesh" />
            <div className="welcome-demo-scanline welcome-demo-scanline-a" />
            <div className="welcome-demo-scanline welcome-demo-scanline-b" />
          </div>

          <div className="welcome-demo-hero-grid">
            <div className="welcome-demo-copy">
              <h1 className="welcome-demo-title welcome-demo-reveal">
                Your career path,
                <span> animated.</span>
              </h1>

              <p className="welcome-demo-lede welcome-demo-reveal">
                InteliPath turns skill gaps, target roles, mentor feedback, and market demand into a learning journey that feels alive.
              </p>

              <div className="welcome-demo-cta-row welcome-demo-reveal">
                <Link to={ROUTES.REGISTER} className="welcome-demo-primary">
                  Build my roadmap
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link to={ROUTES.LOGIN} className="welcome-demo-secondary">
                  <Play size={16} weight="fill" />
                  Preview flow
                </Link>
              </div>
            </div>

            <div className="welcome-demo-stage" aria-label="InteliPath animated product showcase">
              <div className="welcome-demo-stage-piece welcome-demo-console">
                <div className="welcome-demo-console-top">
                  <span>
                    <Code size={16} weight="bold" />
                    roadmap.timeline()
                  </span>
                  <strong>running</strong>
                </div>
                <div className="welcome-demo-code-line"><span /></div>
                <div className="welcome-demo-code-line"><span /></div>
                <div className="welcome-demo-code-line"><span /></div>
              </div>

              <div className="welcome-demo-stage-piece welcome-demo-robot-shell">
                <div className="welcome-demo-robot-stack" aria-hidden="true">
                  <img src={robotLeftArm} alt="" className="welcome-demo-robot-arm welcome-demo-robot-left" />
                  <img src={robotRightArm} alt="" className="welcome-demo-robot-arm welcome-demo-robot-right" />
                  <img src={robotBody} alt="" className="welcome-demo-robot-body" />
                  <img src={robotHead} alt="" className="welcome-demo-robot-head" />
                </div>
              </div>

              <div className="welcome-demo-stage-piece welcome-demo-score">
                <Sparkle size={18} weight="fill" />
                <span>Role match</span>
                <strong>91%</strong>
              </div>

              <div className="welcome-demo-stage-piece welcome-demo-path-card">
                <Compass size={19} weight="duotone" />
                <div>
                  <span>Next checkpoint</span>
                  <strong>React Patterns</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="welcome-demo-ribbon" aria-label="InteliPath capabilities">
          <div className="welcome-demo-ribbon-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </section>

        <section className="welcome-demo-showcase">
          <div className="welcome-demo-section-heading">
            <span>System modules</span>
            <h2>Designed for momentum, not static dashboards.</h2>
          </div>

          <div className="welcome-demo-cards">
            {featureCards.map((card) => {
              const Icon = card.icon

              return (
                <article key={card.title} className="welcome-demo-card">
                  <div className="welcome-demo-card-icon">
                    <Icon size={24} weight="duotone" />
                  </div>
                  <span>{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <Robot size={22} weight="duotone" className="welcome-demo-card-mark" />
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

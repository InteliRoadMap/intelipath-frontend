import React, { useState } from 'react'
import Header from '../components/Header'
import leftArm from '../assets/robot/left-arm.png'
import head from '../assets/robot/head.png'
import rightArm from '../assets/robot/right-arm.png'
import body from '../assets/robot/body.png'
import '../styles/welcome.css'

/* ──── Inline SVG: Radar / Spider Chart ──── */
function SkillGapChart() {
  const [hoveredData, setHoveredData] = useState<string | null>(null)
  
  const cx = 120, cy = 110, levels = 5
  const labels = [
    { name: 'LOGIC', angle: -90 },
    { name: 'INFRA', angle: -18 },
    { name: 'DATA', angle: 54 },
    { name: 'API', angle: 126 },
    { name: 'SECURITY', angle: 198 },
  ]

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const point = (angle: number, r: number) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  })

  const maxR = 75

  // Grid lines
  const gridPaths = Array.from({ length: levels }, (_, i) => {
    const r = (maxR / levels) * (i + 1)
    const pts = labels.map((l) => point(l.angle, r))
    return pts.map((p) => `${p.x},${p.y}`).join(' ')
  })

  // Axis lines
  const axes = labels.map((l) => {
    const p = point(l.angle, maxR)
    return { x1: cx, y1: cy, x2: p.x, y2: p.y }
  })

  // Data sets
  const current = [0.55, 0.7, 0.45, 0.35, 0.5]
  const target = [0.85, 0.75, 0.8, 0.7, 0.9]
  const average = [0.6, 0.55, 0.6, 0.5, 0.65]

  const toPath = (data: number[]) =>
    labels
      .map((l, i) => point(l.angle, maxR * data[i]))
      .map((p) => `${p.x},${p.y}`)
      .join(' ')

  const labelPos = labels.map((l) => {
    const p = point(l.angle, maxR + 18)
    return { ...p, name: l.name }
  })

  // Colors
  const colCurrent = "#f97316"
  const colTarget = "#06b6d4"
  const colAverage = "#eab308"

  const getOpacity = (key: string) => hoveredData ? (hoveredData === key ? 1 : 0.2) : 1

  return (
    <>
      <svg viewBox="0 0 240 230" className="radar-svg">
        {/* Grid */}
        {gridPaths.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
        ))}
        {/* Axes */}
        {axes.map((a, i) => (
          <line key={i} {...a} stroke="#e2e8f0" strokeWidth="0.8" />
        ))}
        
        {/* Data areas */}
        <polygon points={toPath(average)} fill="none" stroke={colAverage} strokeWidth="1.5" style={{ opacity: getOpacity('AVERAGE'), transition: 'opacity 0.2s' }} />
        <polygon points={toPath(target)} fill="none" stroke={colTarget} strokeWidth="1.5" style={{ opacity: getOpacity('TARGET'), transition: 'opacity 0.2s' }} />
        <polygon points={toPath(current)} fill="none" stroke={colCurrent} strokeWidth="1.8" style={{ opacity: getOpacity('CURRENT'), transition: 'opacity 0.2s' }} />
        
        {/* Data points */}
        {labels.map((l, i) => {
          const cp = point(l.angle, maxR * current[i])
          const tp = point(l.angle, maxR * target[i])
          const ap = point(l.angle, maxR * average[i])
          return (
            <g key={i}>
              <circle cx={ap.x} cy={ap.y} r="2.5" fill={colAverage} style={{ opacity: getOpacity('AVERAGE'), transition: 'opacity 0.2s' }} />
              <circle cx={tp.x} cy={tp.y} r="2.5" fill={colTarget} style={{ opacity: getOpacity('TARGET'), transition: 'opacity 0.2s' }} />
              <circle cx={cp.x} cy={cp.y} r="3" fill={colCurrent} style={{ opacity: getOpacity('CURRENT'), transition: 'opacity 0.2s' }} />
            </g>
          )
        })}
        
        {/* Labels */}
        {labelPos.map((lp, i) => (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="radar-label"
          >
            {lp.name}
          </text>
        ))}
      </svg>

      <div className="chart-legend">
        <span 
          className="legend-item" 
          onMouseEnter={() => setHoveredData('CURRENT')} 
          onMouseLeave={() => setHoveredData(null)}
          style={{ cursor: 'pointer', opacity: getOpacity('CURRENT'), transition: 'opacity 0.2s' }}
        >
          <span className="legend-dot" style={{ background: colCurrent }} /> CURRENT
        </span>
        <span 
          className="legend-item" 
          onMouseEnter={() => setHoveredData('TARGET')} 
          onMouseLeave={() => setHoveredData(null)}
          style={{ cursor: 'pointer', opacity: getOpacity('TARGET'), transition: 'opacity 0.2s' }}
        >
          <span className="legend-dot" style={{ background: colTarget }} /> TARGET
        </span>
        <span 
          className="legend-item" 
          onMouseEnter={() => setHoveredData('AVERAGE')} 
          onMouseLeave={() => setHoveredData(null)}
          style={{ cursor: 'pointer', opacity: getOpacity('AVERAGE'), transition: 'opacity 0.2s' }}
        >
          <span className="legend-dot" style={{ background: colAverage }} /> AVERAGE
        </span>
      </div>
    </>
  )
}

function RoadmapCard() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const steps = [
    { status: 'completed', label: 'HTML & CSS Basics', learn: 14, track: 9 },
    { status: 'completed', label: 'JavaScript Core', learn: 21, track: 15 },
    { status: 'current', label: 'React Framework', learn: 12, track: 8 },
    { status: 'upcoming', label: 'Node & APIs', learn: '--', track: '--' }
  ]

  const activeIdx = hoveredStep !== null ? hoveredStep : 2
  const currentStep = steps[activeIdx]

  return (
    <div className="hero-card roadmap-card">
      <div className="roadmap-header">
        <h3 className="hero-card-title">ROADMAP</h3>
        <span className="roadmap-badge" style={{ transition: 'all 0.2s' }}>{currentStep.label}</span>
      </div>
      <div className="roadmap-progress">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div 
              className={`progress-step ${step.status}`}
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{ cursor: 'pointer', transform: hoveredStep === i ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s' }}
            >
              {step.status === 'completed' ? (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : step.status === 'upcoming' ? (
                <svg width="10" height="12" viewBox="0 0 14 16" fill="none">
                  <rect x="2" y="7" width="10" height="8" rx="2" fill="#f59e0b" />
                  <path d="M4 7V4.5C4 2.5 5.5 1 7 1C8.5 1 10 2.5 10 4.5V7" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="7" cy="11" r="1" fill="white" />
                </svg>
              ) : (
                '4'
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`progress-connector ${step.status === 'completed' ? 'done' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="roadmap-stats">
        <div className="roadmap-stat">
          <span className="roadmap-stat-label">LEARN</span>
          <span className="roadmap-stat-value" style={{ transition: 'all 0.2s' }}>{currentStep.learn}</span>
        </div>
        <div className="roadmap-stat">
          <span className="roadmap-stat-label">TRACK</span>
          <span className="roadmap-stat-value" style={{ transition: 'all 0.2s' }}>{currentStep.track}</span>
        </div>
      </div>
    </div>
  )
}

/* ──── Main Page ──── */
export default function WelcomePage() {
  return (
    <div className="welcome-page">
      <Header />

      <section className="welcome-hero">
        {/* ── Left Content ── */}
        <div className="welcome-hero-left">
          <div className="welcome-badge">
            <span className="welcome-badge-icon">⚡</span>
            AI-POWERED GUIDANCE
          </div>

          <h1 className="welcome-hero-title">
            Welcome to<br />
            <span className="font-display font-bold tracking-tight">
              Inteli<span className="bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">Path</span>
            </span>
          </h1>

          <p className="welcome-hero-desc">
            Navigate your learning journey and career path through AI-powered
            techniques. We use intelligent algorithms to help you become a next-generation software engineer.
          </p>
        </div>

        {/* ── Right Cards ── */}
        <div className="welcome-hero-right">
          <div className="hero-cards-grid">
            
            {/* Skill Gap Card */}
            <div className="hero-card skill-gap-card">
              <h3 className="hero-card-title">SKILL GAP</h3>
              <SkillGapChart />
            </div>

            {/* Roadmap Card */}
            <RoadmapCard />

            {/* AI Mentor Card */}
            <div className="hero-card mentor-card ai-mentor-card">
              <div className="mentor-img-wrapper">
                <div className="radar-circles">
                  <div className="circle-1"></div>
                  <div className="circle-2"></div>
                  <div className="circle-3"></div>
                </div>
                <div className="mentor-robot-container">
                  <img src={head} className="robot-part robot-head" alt="head" />
                  <img src={body} className="robot-part robot-body" alt="body" />
                  <img src={leftArm} className="robot-part robot-arm-left" alt="left arm" />
                  <img src={rightArm} className="robot-part robot-arm-right" alt="right arm" />
                </div>
              </div>
              <h2 className="mentor-title">I'm your AI Mentor at InteliPath.</h2>
              <p className="mentor-desc">How can I assist your career growth today?</p>
              <button className="mentor-btn">
                <span className="btn-icon">💬</span> Chat Now
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
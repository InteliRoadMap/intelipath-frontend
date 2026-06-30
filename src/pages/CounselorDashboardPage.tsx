import React, { useState, useRef, useEffect } from "react"
import gsap from "gsap"
import { Users, TrendingDown, MessageSquare } from "lucide-react"
import { CounselorDashboardTemplate } from "@/components/counselor-dashboard/templates/CounselorDashboardTemplate"
import { CounselorHero } from "@/components/counselor-dashboard/organisms/CounselorHero"
import { CareerDistributionChart } from "@/components/counselor-dashboard/organisms/CareerDistributionChart"
import { MissingSkillsChart } from "@/components/counselor-dashboard/organisms/MissingSkillsChart"
import { FeedbackListWidget } from "@/components/counselor-dashboard/organisms/FeedbackListWidget"
import { StatItem } from "@/types/dashboard"

export function CounselorDashboardPage() {
  const [selectedCareer, setSelectedCareer] = useState("")
  const sparkleRef = useRef<SVGSVGElement>(null)

  // Totals for hero stat pills — populated by widget callbacks
  const [totalStudents, setTotalStudents] = useState<number | null>(null)
  const [totalSkillGaps, setTotalSkillGaps] = useState<number | null>(null)
  const [totalFeedbacks, setTotalFeedbacks] = useState<number | null>(null)

  useEffect(() => {
    // Sparkle twinkle (infinite loop)
    if (sparkleRef.current) {
      const tl = gsap.timeline({ repeat: -1, delay: 1.2 })
      tl.to(sparkleRef.current, {
        scale: 1.3,
        opacity: 0.4,
        rotate: 20,
        duration: 0.35,
        ease: "power2.in"
      })
        .to(sparkleRef.current, {
          scale: 1.15,
          opacity: 1,
          rotate: -15,
          duration: 0.25,
          ease: "power2.out"
        })
        .to(sparkleRef.current, {
          scale: 1.4,
          opacity: 0.6,
          rotate: 10,
          duration: 0.3,
          ease: "power2.inOut"
        })
        .to(sparkleRef.current, {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        })
        .to(sparkleRef.current, {
          duration: 2.5 // idle pause before next twinkle
        })

      return () => {
        tl.kill()
      }
    }
  }, [])

  const stats: StatItem[] = [
    { icon: Users, label: "Students", value: totalStudents },
    { icon: TrendingDown, label: "Missing Skills", value: totalSkillGaps },
    { icon: MessageSquare, label: "Feedbacks", value: totalFeedbacks }
  ]

  return (
    <CounselorDashboardTemplate
      hero={<CounselorHero stats={stats} ref={sparkleRef} />}
      careerChart={
        <CareerDistributionChart
          onSelectCareer={setSelectedCareer}
          onTotalLoaded={setTotalStudents}
        />
      }
      missingSkillsChart={
        <MissingSkillsChart
          careerFilter={selectedCareer}
          onTotalLoaded={setTotalSkillGaps}
        />
      }
      feedbackList={<FeedbackListWidget onTotalLoaded={setTotalFeedbacks} />}
    />
  )
}

export default CounselorDashboardPage

import { useEffect, useState, useRef } from "react"
import { onLoadingChange } from "@/shared/api"
import gsap from "gsap"

export default function GlobalLoadingBar() {
  const [isLoading, setIsLoading] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cb = (loading: boolean) => {
      setIsLoading(loading)
    }
    onLoadingChange.add(cb)
    return () => {
      onLoadingChange.delete(cb)
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      // Start loading animation: slide smoothly from 0 to 80%
      gsap.fromTo(
        barRef.current,
        { width: "0%", opacity: 1 },
        { width: "80%", duration: 3, ease: "power2.out" }
      )
      
      // Pulse glow effect
      gsap.to(glowRef.current, {
        opacity: 0.8,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      })
    } else {
      // Finish loading: snap to 100% then fade out
      gsap.to(barRef.current, {
        width: "100%",
        duration: 0.15,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(barRef.current, {
            opacity: 0,
            duration: 0.15,
            delay: 0.05,
            onComplete: () => {
              gsap.set(barRef.current, { width: "0%" })
              gsap.killTweensOf(glowRef.current)
            }
          })
        }
      })
    }
  }, [isLoading])

  return (
    <div className="fixed bottom-0 left-0 w-full h-[3px] z-[9999] pointer-events-none overflow-hidden">
      <div
        ref={barRef}
        className="relative h-full w-0 opacity-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-300"
      >
        <div 
          ref={glowRef}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-[10px] bg-cyan-400 blur-[8px] opacity-0"
        />
      </div>
    </div>
  )
}

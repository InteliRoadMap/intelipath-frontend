export default function SharedAppBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        // Whisper of a cool tint at the top, settling into the original slate-50.
        background: "linear-gradient(180deg, #f3f5ff 0%, #f8fafc 55%)",
      }}
    >
      {/* Soft pastel aurora anchored at the top — gives the glass nav color to
          refract so it reads as a bubble instead of a flat grey bar. */}
      <div
        className="absolute -left-24 -top-32 h-[440px] w-[440px] rounded-full"
        style={{ background: "rgba(129,140,248,0.16)", filter: "blur(90px)" }}
      />
      <div
        className="absolute -right-20 -top-28 h-[400px] w-[400px] rounded-full"
        style={{ background: "rgba(56,189,248,0.13)", filter: "blur(90px)" }}
      />

      {/* Blueprint grid, brightest at the top then fading out (unchanged). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
    </div>
  )
}

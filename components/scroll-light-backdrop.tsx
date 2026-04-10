"use client"

export default function ScrollLightBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-color/12 to-transparent" />
      <div className="absolute right-[9%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/6 to-transparent" />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function ScrollLightBackdrop() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {isLight ? (
        <>
          {/* Light mode: Sunrise God Rays & Drifting Clouds atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-200/20 via-transparent to-amber-100/15" />
          
          {/* Drifting Clouds (radial overlay) */}
          <div className="absolute -top-[20%] -left-[10%] w-[130%] h-[130%] opacity-[0.45] bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.85)_0%,_transparent_55%),radial-gradient(circle_at_top_left,_rgba(240,238,228,0.9)_0%,_transparent_65%)] animate-clouds" />
          
          {/* God Rays (skewed translucent gradients) */}
          <div className="absolute top-0 right-[10%] w-[40rem] h-[150vh] opacity-[0.12] bg-gradient-to-b from-amber-300/40 via-amber-200/10 to-transparent skew-x-[-15deg] origin-top animate-god-rays" />
          <div className="absolute top-0 left-[20%] w-[30rem] h-[150vh] opacity-[0.08] bg-gradient-to-b from-white/30 via-transparent to-transparent skew-x-[-12deg] origin-top animate-god-rays [animation-delay:4s]" />

          {/* Survey Corps military grid outline - lighter green */}
          <div className="absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-800/10 to-transparent" />
          <div className="absolute right-[9%] top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-850/8 to-transparent" />
        </>
      ) : (
        <>
          {/* Dark mode: original runic wires */}
          <div className="absolute left-[8%] top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-color/12 to-transparent" />
          <div className="absolute right-[9%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/6 to-transparent" />
        </>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

export default function Preloader({ onFinish }: { onFinish?: () => void }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsVisible(false)
    }, 700)

    const finishTimer = window.setTimeout(() => {
      onFinish?.()
    }, 1000)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-dark-color px-6 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="liquid-glass relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/15 p-8 shadow-liquid dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgb(var(--primary-color)_/_0.2),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgb(var(--accent-color)_/_0.18),_transparent_45%)]" />
        <div className="relative space-y-5">
          <div className="glass-pill inline-flex items-center rounded-full border border-primary-color/30 bg-primary-color/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.32em] text-primary-color">
            Portfolio
          </div>

          <div className="space-y-2">
            <p className="text-3xl font-semibold text-text-color md:text-4xl">Abhinav Sahu</p>
            <p className="max-w-md text-sm leading-6 text-text-secondary md:text-base">
              Launching a faster, cleaner showcase of AI projects, engineering work, and real-world builds.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10 dark:bg-white/10">
              <div className="preloader-progress h-full rounded-full bg-gradient-to-r from-primary-color via-primary-light to-accent-color" />
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-text-secondary">
              <span>Preparing experience</span>
              <span>01 / 01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

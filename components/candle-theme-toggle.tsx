"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"

type CandleThemeToggleProps = {
  className?: string
}

export default function CandleThemeToggle({ className = "" }: CandleThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })

    // Preload sword sound for theme transition
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav") // sword slice sound
    audio.volume = 0.2
    audioRef.current = audio

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)

    // Play whoosh sound if unmuted
    const isMuted = localStorage.getItem("portfolio-muted") !== "false"
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group relative flex items-center justify-center overflow-visible cursor-pointer ${className}`}
      aria-label="Toggle theme coordinate"
      title={theme === "dark" ? "Switch to Hope (AoT)" : "Switch to Despair (Berserk)"}
    >
      <div className="relative h-6 w-6 scale-75">
        {mounted && theme === "dark" ? (
          <div className="absolute -top-8 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-red-600/20 blur-xl animate-pulse" />
        ) : null}

        {/* Outer Cylinder (White Wax Candle) */}
        <div
          className={`absolute h-6 w-6 duration-500 rounded-sm border border-stone-350 bg-white ${
            mounted && theme === "dark"
              ? "shadow-[0_-4px_8px_rgba(220,38,38,0.25)]"
              : "shadow-[0_-4px_8px_rgba(52,211,153,0.2)]"
          }`}
        >
          {/* Top cover */}
          <div className="absolute -top-[3px] left-0 right-0 h-1.5 rounded-full border-t border-stone-300 bg-stone-100 [transform:rotateX(80deg)]" />
        </div>

        {/* Small Flame Vector */}
        <svg
          className={`absolute -top-4 left-[2px] h-4 w-4 rounded-full duration-500 ${
            mounted && theme === "dark" ? "fill-red-500 animate-[pulse_1.8s_ease-in-out_infinite]" : "fill-emerald-400"
          }`}
          viewBox="0 0 100 100"
        >
          <path d="M59.5,20.5a3.9,3.9,0,0,0-2.5-2,4.3,4.3,0,0,0-3.3.5,11.9,11.9,0,0,0-3.2,3.5,26,26,0,0,0-2.3,4.4,76.2,76.2,0,0,0-3.3,10.8,120.4,120.4,0,0,0-2.4,14.2,11.4,11.4,0,0,1-3.8-4.2c-1.3-2.7-1.5-6.1-1.5-10.5a4,4,0,0,0-2.5-3.7,3.8,3.8,0,0,0-4.3.9,27.7,27.7,0,1,0,39.2,0" />
        </svg>
      </div>
    </button>
  )
}

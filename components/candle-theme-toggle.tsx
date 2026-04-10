"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

type CandleThemeToggleProps = {
  className?: string
}

export default function CandleThemeToggle({ className = "" }: CandleThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`group relative flex items-center justify-center overflow-visible cursor-pointer ${className}`}
      aria-label="Toggle theme"
    >
      <div className="relative h-6 w-6 scale-75">
        {mounted && theme === "dark" ? (
          <div className="absolute -top-8 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-yellow-400/30 blur-xl animate-pulse" />
        ) : null}

        <div
          className={`absolute h-6 w-6 duration-500 ${
            mounted && theme === "dark"
              ? "bg-neutral-50 shadow-[0_-6px_12px_rgba(255,200,0,0.4),0_-18px_40px_rgba(255,200,0,0.55),0_-30px_70px_rgba(255,200,0,0.35)]"
              : "bg-neutral-200 shadow-none"
          }`}
        >
          <div className="h-6 w-6 bg-neutral-50 shadow-inner shadow-yellow-200" />
          <div className="absolute -bottom-3 h-6 w-6 rounded-full bg-neutral-50 [transform:rotateX(80deg)]" />

          <div
            className={`absolute -top-3 h-6 w-6 rounded-full border-2 [transform:rotateX(80deg)] ${
              mounted && theme === "dark" ? "border-yellow-300 bg-yellow-400" : "border-gray-400 bg-gray-300"
            }`}
          />
        </div>

        <svg
          className={`absolute -top-3 left-[2px] h-4 w-4 rounded-full duration-500 ${
            mounted && theme === "dark" ? "fill-yellow-300 animate-[pulse_1.8s_ease-in-out_infinite]" : "fill-gray-400"
          }`}
          viewBox="0 0 100 100"
        >
          <path d="M59.5,20.5a3.9,3.9,0,0,0-2.5-2,4.3,4.3,0,0,0-3.3.5,11.9,11.9,0,0,0-3.2,3.5,26,26,0,0,0-2.3,4.4,76.2,76.2,0,0,0-3.3,10.8,120.4,120.4,0,0,0-2.4,14.2,11.4,11.4,0,0,1-3.8-4.2c-1.3-2.7-1.5-6.1-1.5-10.5a4,4,0,0,0-2.5-3.7,3.8,3.8,0,0,0-4.3.9,27.7,27.7,0,1,0,39.2,0" />
        </svg>
      </div>
    </button>
  )
}

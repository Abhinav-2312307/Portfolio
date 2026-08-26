"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { HeroContent } from "@/lib/portfolio/schema"

const DESPAIR_QUOTES = [
  {
    text: "In this world, is the destiny of mankind controlled by some transcendental entity or law?",
    author: "Causality",
    source: "Berserk"
  },
  {
    text: "If you don't fight, you can't win. Fight. Fight!",
    author: "Eren Yeager",
    source: "Attack on Titan"
  },
  {
    text: "Struggle, endure, contend. That is the only way of a struggler.",
    author: "Skull Knight",
    source: "Berserk"
  },
  {
    text: "This world is cruel, but also beautiful.",
    author: "Mikasa Ackerman",
    source: "Attack on Titan"
  }
]

const HOPE_QUOTES = [
  {
    text: "If you begin to regret, you'll dull your future decisions. Keep moving forward.",
    author: "Erwin Smith",
    source: "Attack on Titan"
  },
  {
    text: "Even if everything's been lost, it's still possible to dream.",
    author: "Guts",
    source: "Berserk"
  },
  {
    text: "We will see the ocean. Beyond the walls, there is freedom.",
    author: "Armin Arlert",
    source: "Attack on Titan"
  },
  {
    text: "What is the point of being born if we do not keep moving forward?",
    author: "Eren Yeager",
    source: "Attack on Titan"
  }
]

export default function Preloader({ onFinish, hero }: { onFinish?: () => void; hero?: HeroContent }) {
  const heroData = hero || defaultPortfolioContent.hero
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isDoneLoading, setIsDoneLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [muted, setMuted] = useState(true)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [impactFlash, setImpactFlash] = useState(false)
  const [isLight, setIsLight] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize theme & volume preferences from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedTheme = localStorage.getItem("theme")
    setIsLight(savedTheme === "light")

    const savedMuted = localStorage.getItem("portfolio-muted")
    setMuted(savedMuted !== "false")
  }, [])

  // Sync mute state to localStorage
  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    localStorage.setItem("portfolio-muted", String(nextMuted))
    if (audioRef.current) {
      audioRef.current.muted = nextMuted
      if (!nextMuted) {
        audioRef.current.play().catch(() => {})
      }
    }
  }

  // Load atmospheric sound
  useEffect(() => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav") // sword clash
    audio.volume = 0.35
    audioRef.current = audio
  }, [])

  // Progress Bar simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsDoneLoading(true), 400)
          return 100
        }
        return prev + Math.random() * 8
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Typist effect for quotes
  useEffect(() => {
    const quotes = isLight ? HOPE_QUOTES : DESPAIR_QUOTES
    const quote = quotes[currentQuoteIndex]?.text ?? ""
    let charIndex = 0
    setTypedText("")

    const typingInterval = setInterval(() => {
      if (charIndex < quote.length) {
        setTypedText((prev) => prev + quote.charAt(charIndex))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
        }, 2500)
      }
    }, 40)

    return () => clearInterval(typingInterval)
  }, [currentQuoteIndex, isLight])

  const handleEnter = () => {
    if (isUnlocking) return
    setIsUnlocking(true)

    if (!muted && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }

    setImpactFlash(true)

    setTimeout(() => {
      onFinish?.()
    }, 850)
  }

  const quotes = isLight ? HOPE_QUOTES : DESPAIR_QUOTES

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 px-6 ${
        isLight ? "bg-[#f4f2e9]" : "bg-[#07080a]"
      } ${isUnlocking ? "scale-105 pointer-events-none opacity-0" : "opacity-100"}`}
    >
      {/* Background Vignette */}
      {isLight ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(232,230,220,0.85)_100%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.95)_100%)]" />
      )}

      {/* Floating Canvas/Mist Layer */}
      <div
        className={`absolute inset-0 opacity-[0.06] bg-cover bg-center filter blur-xs ${
          isLight ? "mix-blend-multiply" : "mix-blend-color-dodge"
        }`}
        style={{
          backgroundImage: `url('${isLight ? (heroData.lightWallpaper ?? "/assets/wallpapersden.com_eren-yeager-cool-attack-on-titan_4808x3858.jpg") : (heroData.lightCutout ?? "/assets/Eren-Yeager-Lock-Screen-Wallpaper-4k.jpg")}')`
        }}
      />

      {/* Volume Toggle */}
      <div className="absolute right-6 top-6 z-50">
        <button
          type="button"
          onClick={toggleMute}
          className={`flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:scale-105 ${
            isLight
              ? "border-emerald-800/25 bg-white/40 text-emerald-800 hover:border-emerald-800/40"
              : "border-white/10 bg-black/40 text-white/70 hover:border-white/20 hover:text-white"
          }`}
          aria-label="Volume toggle"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center space-y-12">
        {/* Branding Title */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`inline-flex items-center gap-2 border-x px-6 py-1 ${
              isLight ? "border-emerald-800/30" : "border-red-800/40"
            }`}
          >
            <span className={`h-1 w-1 animate-pulse ${isLight ? "bg-emerald-600" : "bg-red-600"}`} />
            <span
              className={`text-[0.62rem] uppercase tracking-[0.45em] font-semibold font-mono ${
                isLight ? "text-emerald-700" : "text-red-500"
              }`}
            >
              {isLight ? "WINGS OF FREEDOM" : "CAUSALITY x FREEDOM"}
            </span>
            <span className={`h-1 w-1 animate-pulse ${isLight ? "bg-emerald-600" : "bg-red-600"}`} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className={`text-4xl md:text-5xl font-bold uppercase tracking-[-0.04em] font-sans ${
              isLight ? "text-emerald-950" : "text-white/90"
            }`}
          >
            Abhinav Sahu
          </motion.h1>
        </div>

        {/* Quotes Display */}
        <div className="min-h-[7rem] flex flex-col justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <p
                className={`text-lg md:text-xl font-medium italic max-w-xl mx-auto leading-relaxed ${
                  isLight ? "text-emerald-900" : "text-white/80"
                }`}
              >
                "{typedText}"
                <span className={`animate-pulse font-normal ${isLight ? "text-emerald-600" : "text-red-500"}`}>|</span>
              </p>
              <p className={`text-xs uppercase tracking-[0.25em] ${isLight ? "text-emerald-800/55" : "text-white/40"}`}>
                — {quotes[currentQuoteIndex]?.author} ({quotes[currentQuoteIndex]?.source})
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Loader Action */}
        <div className="w-full max-w-md mx-auto space-y-6 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isDoneLoading ? (
              <motion.div key="loading-bar" exit={{ opacity: 0 }} className="w-full space-y-2">
                <div className={`h-0.5 w-full rounded-full overflow-hidden ${isLight ? "bg-emerald-800/10" : "bg-white/5"}`}>
                  <div
                    className={`h-full transition-all duration-150 ${
                      isLight
                        ? "bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-500"
                        : "bg-gradient-to-r from-red-800 via-red-600 to-amber-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className={`flex justify-between text-[0.62rem] uppercase tracking-[0.25em] ${
                  isLight ? "text-emerald-800/40" : "text-white/30"
                }`}>
                  <span>{isLight ? "ARCHIVE RECOVERY" : "LOADING ARSENAL"}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="enter-button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative px-10 py-4 overflow-hidden rounded-md border text-xs font-semibold uppercase tracking-[0.35em] transition-all ${
                  isLight
                    ? "border-emerald-800/40 bg-gradient-to-b from-emerald-950/10 to-white text-emerald-800 shadow-[0_0_24px_rgba(32,96,74,0.1)] hover:border-emerald-600 hover:text-emerald-600 hover:shadow-[0_0_36px_rgba(32,96,74,0.2)]"
                    : "border-red-700/60 bg-gradient-to-b from-red-950/40 to-black text-red-500 shadow-[0_0_24px_rgba(180,15,15,0.18)] hover:border-red-500 hover:text-white hover:shadow-[0_0_36px_rgba(180,15,15,0.4)]"
                }`}
              >
                {/* Button Glow reflection */}
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
                {isLight ? "ENTER THE DAWN" : "ENTER THE REALM"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Runic Frame Borders */}
      <div className={`absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-${isLight ? "emerald-800/10" : "white/5"} to-transparent`} />
      <div className={`absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-${isLight ? "emerald-800/10" : "white/5"} to-transparent`} />
      <div className={`absolute inset-y-8 left-8 w-px bg-gradient-to-b from-transparent via-${isLight ? "emerald-800/10" : "white/5"} to-transparent`} />
      <div className={`absolute inset-y-8 right-8 w-px bg-gradient-to-b from-transparent via-${isLight ? "emerald-800/10" : "white/5"} to-transparent`} />

      {/* Screen Shake & Impact Flash triggers */}
      {impactFlash && (
        <div className={`pointer-events-none fixed inset-0 z-[10000] animate-impact-flash ${
          isLight ? "bg-amber-100" : ""
        }`} />
      )}
    </div>
  )
}

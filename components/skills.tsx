"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Swords, CircleDot, Activity } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import * as SimpleIcons from "react-icons/si"
import { IconType } from "react-icons"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { SkillsContent } from "@/lib/portfolio/schema"
import { cn } from "@/lib/utils"

type SkillsProps = {
  skills?: SkillsContent
}

const skillIconMap: Record<string, IconType> = {
  SiTypescript: SimpleIcons.SiTypescript,
  SiJavascript: SimpleIcons.SiJavascript,
  SiPython: SimpleIcons.SiPython,
  SiCplusplus: SimpleIcons.SiCplusplus,
  SiReact: SimpleIcons.SiReact,
  SiNextdotjs: SimpleIcons.SiNextdotjs,
  SiTailwindcss: SimpleIcons.SiTailwindcss,
  SiFramer: SimpleIcons.SiFramer,
  SiNodejs: SimpleIcons.SiNodedotjs,
  SiPostgresql: SimpleIcons.SiPostgresql,
  SiMongodb: SimpleIcons.SiMongodb,
  SiRedis: SimpleIcons.SiRedis,
  SiDocker: SimpleIcons.SiDocker,
  SiGit: SimpleIcons.SiGit,
  SiHtml5: SimpleIcons.SiHtml5,
  SiCss3: SimpleIcons.SiCss,
}

const categoryArsenalLabels: Record<string, { label: string; desc: string }> = {
  Languages: {
    label: "Primary Blades",
    desc: "Core coding parameters loaded for immediate compilation."
  },
  Frontend: {
    label: "Maneuver Handles",
    desc: "Tactical HUD controls and responsive client interface frames."
  },
  Backend: {
    label: "Gas Propulsion",
    desc: "High-velocity backend pipelines and transactional microservices."
  },
  Databases: {
    label: "Reinforced Hooks",
    desc: "Secure storage anchors and optimized indexing pipelines."
  },
  Tooling: {
    label: "Ancillary Gear",
    desc: "Deployment containers, workflow controls, and codebase automation."
  }
}

export default function Skills({ skills }: SkillsProps) {
  const skillsData = skills || defaultPortfolioContent.skills
  const categories = skillsData?.categories || []
  const items = skillsData?.cards || []

  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "Languages")
  const [hoveredCardOrder, setHoveredCardOrder] = useState<number | null>(null)
  const sliceAudioRef = useRef<HTMLAudioElement | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  // Preload sound
  useEffect(() => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav") // Slice whoosh sound
    audio.volume = 0.12
    sliceAudioRef.current = audio
  }, [])

  const playSliceSound = () => {
    const isMuted = localStorage.getItem("portfolio-muted") !== "false"
    if (!isMuted && sliceAudioRef.current) {
      sliceAudioRef.current.currentTime = 0
      sliceAudioRef.current.play().catch(() => {})
    }
  }

  const filteredCards = useMemo(() => {
    return items.filter((card) => {
      if (activeCategory === "Languages") {
        return card.category === "Languages" || card.category === "Scripts"
      }
      if (activeCategory === "Backend") {
        return card.category === "Backend" || card.category === "Frameworks"
      }
      return card.category === activeCategory
    })
  }, [activeCategory, items])

  return (
    <section
      id="skills"
      data-scroll-section
      className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20 bg-dark-color transition-colors duration-700"
    >
      {/* Background visual layout */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(110,5,5,0.04)_0%,_transparent_70%)]" />
      <div className="absolute inset-y-0 right-[5%] w-px bg-gradient-to-b from-transparent via-red-900/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-text-color/5 pb-8">
          <div>
            <div
              className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-sm ${
                isLight
                  ? "border-emerald-800/30 bg-emerald-950/10 text-emerald-600"
                  : "border-red-800/30 bg-red-950/10 text-red-500"
              }`}
            >
              <Swords size={12} className={`${isLight ? "text-emerald-500" : "text-red-500"} animate-pulse`} />
              <span className="text-[0.62rem] uppercase tracking-[0.38em] font-semibold font-mono">
                {isLight ? "ODM WEAPON TRAINING ROOM" : "ODM WEAPON ARSENAL"}
              </span>
            </div>

            <h2 className="gothic-header text-4xl md:text-5xl font-bold uppercase tracking-[-0.04em] text-text-color mt-4">
              Combat <br className="md:hidden" />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isLight ? "from-emerald-600 via-teal-500 to-amber-500" : "from-red-600 to-amber-500"
                }`}
              >
                Capabilities
              </span>
            </h2>
          </div>

          <div className="text-left md:text-right max-w-sm">
            <p className="text-xs font-mono text-text-secondary/50 uppercase tracking-widest">
              Gear Unit Status: Optimal // Calibrated
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Select a gear module to inspect component blueprints.
            </p>
          </div>
        </div>

        {/* Weapons HUD Framework */}
        <div className="grid lg:grid-cols-[16rem_minmax(0,1fr)] gap-8 items-start">
          
          {/* HUD Module Tabs */}
          <nav className="flex flex-row lg:flex-col flex-wrap gap-2 z-10">
            {categories.map((cat) => {
              const info = categoryArsenalLabels[cat] || { label: cat, desc: "" }
              const isActive = activeCategory === cat

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 min-w-[8rem] lg:w-full text-left p-4 rounded-sm border transition-all ${
                    isActive
                      ? isLight
                        ? "border-emerald-600/40 bg-emerald-950/10 text-emerald-800 shadow-[0_0_15px_rgba(32,96,74,0.1)] font-bold"
                        : "border-red-600/40 bg-red-950/20 text-white shadow-[0_0_15px_rgba(180,15,15,0.15)] font-bold"
                      : isLight
                        ? "border-emerald-800/10 bg-white/20 text-text-secondary hover:text-emerald-700 hover:border-emerald-800/20"
                        : "border-white/5 bg-black/40 text-text-secondary hover:text-white hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CircleDot
                      size={10}
                      className={
                        isActive
                          ? isLight
                            ? "text-emerald-600 animate-pulse"
                            : "text-red-500 animate-pulse"
                          : "text-text-secondary/25"
                      }
                    />
                    <span className="text-[0.68rem] uppercase tracking-[0.22em] font-mono">
                      {info.label}
                    </span>
                  </div>
                  <p className="text-[0.55rem] font-mono text-text-secondary/40 hidden lg:block mt-1 truncate">
                    {info.desc}
                  </p>
                </button>
              )
            })}
          </nav>

          {/* Cards Display Grid */}
          <div className="space-y-6">
            
            {/* Category Description Tag */}
            <div className="steel-runic-panel p-4 rounded-[20px] flex items-center gap-4 border border-text-color/5">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border ${
                  isLight
                    ? "border-emerald-800/25 bg-emerald-950/5 text-emerald-700"
                    : "border-red-800/30 bg-red-950/20 text-red-500"
                }`}
              >
                <Activity size={14} className="animate-pulse" />
              </div>
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.25em] text-text-secondary/40 font-mono">
                  Module Specification
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {categoryArsenalLabels[activeCategory]?.desc}
                </p>
              </div>
            </div>

            {/* Cards Array */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredCards.map((item) => {
                  const Icon = skillIconMap[item.iconName] ?? SimpleIcons.SiReact
                  const isHovered = hoveredCardOrder === item.order

                  return (
                    <motion.article
                      key={item.name}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => {
                        setHoveredCardOrder(item.order)
                        playSliceSound()
                      }}
                      onMouseLeave={() => setHoveredCardOrder(null)}
                      className={cn(
                        "skill-card steel-runic-panel rounded-[20px] p-6 cursor-pointer select-none group overflow-hidden border border-text-color/5 relative transition-colors duration-300",
                        isLight
                          ? "bg-gradient-to-b from-secondary-color/25 to-dark-color/35 hover:border-emerald-500/30"
                          : "bg-gradient-to-b from-black/40 to-[#0c0d10] hover:border-red-500/30"
                      )}
                      style={{ "--skill-accent": item.accent } as React.CSSProperties}
                    >
                      {/* Brand Slash Overlay Flash */}
                      <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* A slash line cutting diagonally */}
                        <div
                          className={`absolute top-0 bottom-0 left-[-20%] right-[-20%] bg-gradient-to-r from-transparent to-transparent rotate-[40deg] scale-0 group-hover:scale-150 transition-transform duration-[600ms] ease-out ${
                            isLight ? "via-emerald-500/15" : "via-red-500/10"
                          }`}
                        />
                      </div>

                      {/* Accent Glow backdrop */}
                      <div
                        className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 h-14 w-28 rounded-full blur-[32px] opacity-10 group-hover:opacity-30 transition-all duration-300"
                        style={{ backgroundColor: item.accent }}
                      />

                      {/* Header row */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[0.55rem] uppercase tracking-widest font-mono text-text-secondary/40">
                            {item.category}
                          </span>
                          <h3
                            className={`text-xl font-bold uppercase tracking-tight text-text-color mt-1 transition-colors ${
                              isLight ? "group-hover:text-emerald-600" : "group-hover:text-red-500"
                            }`}
                          >
                            {item.name}
                          </h3>
                        </div>

                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-text-color/5 bg-black/5 text-text-color shadow-inner"
                          style={{ color: isHovered ? item.accent : undefined }}
                        >
                          <Icon size={16} />
                        </div>
                      </div>

                      {/* Level progress indicator */}
                      <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-[0.62rem] font-mono text-text-secondary/60">
                          <span>Sync Efficiency</span>
                          <span>{item.level}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? "bg-emerald-800/10" : "bg-black/50"}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.level}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isLight
                                ? "bg-gradient-to-r from-emerald-600 to-teal-500"
                                : "bg-gradient-to-r from-red-800 to-amber-500"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

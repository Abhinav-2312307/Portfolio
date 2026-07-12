"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ExternalLink, Github, Swords, Shield } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { ProjectItem, ProjectsContent } from "@/lib/portfolio/schema"
import { cn } from "@/lib/utils"

const projectWallpapers: Record<string, string> = {
  "PrintMyPagePSIT": "/assets/guts-illustration-5120x2880-26034.jpg",
  "JusticeAlly": "/assets/eren-yeager-dark-wind-cliff-anime-realism-live-wallpaper-mobile-hd-4k-8k.jpg",
  "Civic Intelligence Platform": "/assets/berserk-knight-guts-5120x2880-18713.jpg",
  "Image Encryption Tool": "/assets/guts-neon-iconic-5120x2880-21415.png",
  "MapMyPSIT": "/assets/wallpapersden.com_eren-yeager-cool-attack-on-titan_4808x3858.jpg",
  "Tic Tac Toe": "/assets/be48f2bbee4c7b0ff38c85a86feca549.jpg",
  "Travel AI": "/assets/guts-battle-dragon-5120x2880-26066.jpg",
  "A Silent Voice": "/assets/eren-eren-yeager.gif",
  "Portfolio Experience": "/assets/berserker-armor-5120x2880-13643.jpg",
}

function getCategoryLabel(category: string) {
  switch (category) {
    case "full-stack":
      return "Full Stack"
    case "ai":
      return "AI Agent"
    case "utility":
      return "Tactical Utility"
    default:
      return "Web Grid"
  }
}

function getThematicStatus(status: string | undefined, isLight: boolean) {
  if (isLight) {
    if (status === "In Progress") return "[SURVEYING STATE]"
    return "[CAMPAIGN SECURED]"
  }
  if (!status) return "[FORGED IN STEEL]"
  if (status === "In Progress") return "[SURVEYING STATE]"
  return `[${status.toUpperCase()}]`
}

type ProjectsProps = {
  projects?: ProjectsContent
}

export default function Projects({ projects }: ProjectsProps) {
  const projectsData = projects || defaultPortfolioContent.projects
  const items = projectsData?.items || []
  const filters = projectsData?.filters || []

  const [filter, setFilter] = useState<string>("all")
  const [selectedTitle, setSelectedTitle] = useState(items[0]?.title ?? "")
  const prefersReducedMotion = useReducedMotion()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  const filteredProjects = useMemo(() => {
    return filter === "all" ? items : items.filter((project) => project.category === filter)
  }, [filter, items])

  const activeProject =
    filteredProjects.find((project) => project.title === selectedTitle) ?? filteredProjects[0] ?? items[0]

  const activeProjectIndex = Math.max(
    0,
    filteredProjects.findIndex((project) => project.title === activeProject?.title),
  )

  const activeBg = useMemo(() => {
    return activeProject ? (projectWallpapers[activeProject.title] ?? "/assets/berserk-knight-guts-5120x2880-18713.jpg") : "/assets/berserk-knight-guts-5120x2880-18713.jpg"
  }, [activeProject])

  useEffect(() => {
    if (!filteredProjects.some((project) => project.title === selectedTitle)) {
      setSelectedTitle(filteredProjects[0]?.title ?? "")
    }
  }, [filteredProjects, selectedTitle])

  return (
    <section
      id="projects"
      data-scroll-section
      className="relative overflow-visible w-full px-6 py-24 md:px-12 lg:px-20 min-h-screen bg-dark-color transition-colors duration-700"
    >
      {/* Immersive background wallpaper reacting to current active project */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLight ? 0.08 : 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeBg})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-color via-dark-color/90 to-dark-color" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-text-color/5 pb-8">
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
                {isLight ? "MILITARY STRATEGY ARCHIVES" : "CONQUESTS & SHIELDWORK"}
              </span>
            </div>

            <h2 className="gothic-header text-4xl md:text-5xl font-bold uppercase tracking-[-0.04em] text-text-color mt-4">
              {isLight ? "Military" : "Forged"} <br className="md:hidden" />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isLight ? "from-emerald-600 via-teal-500 to-amber-500" : "from-red-600 to-amber-500"
                }`}
              >
                {isLight ? "Campaigns" : "Endeavors"}
              </span>
            </h2>
          </div>

          {/* Filtering handles */}
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setFilter(item.value)
                  const next =
                    item.value === "all"
                      ? items[0]
                      : items.find((p) => p.category === item.value)
                  setSelectedTitle(next?.title ?? items[0]?.title ?? "")
                }}
                className={cn(
                  "text-[0.65rem] font-mono uppercase tracking-widest px-4 py-2 border rounded-sm transition-all",
                  filter === item.value
                    ? isLight
                      ? "border-emerald-600/40 bg-emerald-950/10 text-emerald-800 shadow-[0_0_12px_rgba(32,96,74,0.1)] font-bold"
                      : "border-red-600/40 bg-red-950/20 text-red-500 shadow-[0_0_12px_rgba(180,15,15,0.15)] font-bold"
                    : isLight
                      ? "border-emerald-850/10 bg-white/20 text-text-secondary hover:text-emerald-700 hover:border-emerald-800/20"
                      : "border-white/5 bg-black/40 text-text-secondary hover:text-white hover:border-white/10",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid lg:grid-cols-[22rem_minmax(0,1fr)] gap-8">
          
          {/* Details Sidebar panel */}
          <aside className="lg:sticky lg:top-28 lg:self-start steel-runic-panel p-6 rounded-[24px] bg-gradient-to-b from-secondary-color/40 to-dark-color/60 border border-text-color/5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject?.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Index / category */}
                <div className="flex items-center justify-between border-b border-text-color/5 pb-4">
                  <div>
                    <span
                      className={`text-[0.55rem] font-mono uppercase tracking-widest block ${
                        isLight ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {isLight ? "strategic blueprint" : "CONQUEST blueprint"}
                    </span>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-text-color mt-1">
                      {activeProject?.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-text-secondary/50 border border-text-color/5 px-2.5 py-1 rounded-sm bg-black/5">
                    {String(activeProjectIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-[0.62rem] font-mono uppercase border px-2 py-0.5 rounded-sm ${
                      isLight
                        ? "text-emerald-600 bg-emerald-950/15 border-emerald-900/20"
                        : "text-red-400 bg-red-950/15 border-red-900/20"
                    }`}
                  >
                    {getCategoryLabel(activeProject?.category ?? "web")}
                  </span>
                  <span
                    className={`text-[0.62rem] font-mono uppercase border px-2 py-0.5 rounded-sm ${
                      isLight
                        ? "text-emerald-700 bg-emerald-950/5 border-emerald-800/20"
                        : "text-text-secondary bg-black/40 border-text-color/5"
                    }`}
                  >
                    {getThematicStatus(activeProject?.status, isLight)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-text-secondary">
                  {activeProject?.description}
                </p>

                {/* Highlights dossier */}
                <div className="border border-text-color/5 bg-black/5 p-4 rounded-sm space-y-3 font-mono">
                  <span className="text-[0.55rem] uppercase tracking-widest text-text-secondary/40 block border-b border-text-color/5 pb-1.5">
                    Combat Highlights
                  </span>
                  {activeProject?.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 ${isLight ? "bg-emerald-500" : "bg-red-500"}`} />
                      <p className="text-xs leading-relaxed text-text-secondary/80">{item}</p>
                    </div>
                  ))}
                </div>

                {/* Tech specifications */}
                <div className="space-y-2">
                  <span className="text-[0.55rem] font-mono uppercase tracking-widest text-text-secondary/40 block">
                    Alloy components
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject?.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[0.62rem] font-mono px-2 py-1 rounded-sm border border-text-color/5 bg-dark-color text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct link gateways */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-text-color/5">
                  {activeProject?.github ? (
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center justify-center inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-sm bg-black/5 transition-colors ${
                        isLight
                          ? "border-text-color/10 hover:border-emerald-600 hover:text-emerald-600"
                          : "border-white/10 hover:border-red-800 hover:text-red-500"
                      }`}
                    >
                      <Github size={13} />
                      Codebase
                    </a>
                  ) : null}
                  {activeProject?.live ? (
                    <a
                      href={activeProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center justify-center inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors ${
                        isLight
                          ? "border-emerald-800 bg-emerald-950/20 text-emerald-700 hover:bg-emerald-900/20 hover:border-emerald-500"
                          : "border-red-800 bg-red-950/20 text-red-500 hover:bg-red-900/20 hover:border-red-500"
                      }`}
                    >
                      View Live
                      <ArrowUpRight size={13} />
                    </a>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>

          {/* Cards Grid list */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredProjects.map((project, index) => {
              const isSelected = activeProject?.title === project.title
              const wallpaper = projectWallpapers[project.title] ?? "/assets/berserk-knight-guts-5120x2880-18713.jpg"

              return (
                <article
                  key={project.title}
                  onClick={() => setSelectedTitle(project.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      setSelectedTitle(project.title)
                    }
                  }}
                  className={cn(
                    "steel-runic-panel rounded-[24px] cursor-pointer select-none overflow-hidden transition-all duration-300 relative border group flex flex-col justify-between h-[20rem]",
                    isSelected
                      ? isLight
                        ? "border-emerald-600/40 shadow-[0_0_20px_rgba(32,96,74,0.15)]"
                        : "border-red-600/40 shadow-[0_0_20px_rgba(180,15,15,0.2)]"
                      : "border-text-color/5 bg-black/5 hover:border-text-color/15 hover:shadow-lg",
                  )}
                >
                  {/* Card Background image visual */}
                  <div className="absolute inset-0 z-0">
                    {/* Anime wallpaper (default view) */}
                    <Image
                      src={wallpaper}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover object-center opacity-[0.24] group-hover:opacity-0 transition-all duration-500 filter saturate-[0.6] group-hover:scale-105"
                    />
                    {/* Real project screenshot (shown on hover) */}
                    <Image
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover object-center opacity-0 group-hover:opacity-95 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </div>

                  {/* Card Header information */}
                  <div className="relative z-10 p-5 flex justify-between items-start">
                    <span
                      className={`text-[0.62rem] font-mono uppercase tracking-widest border px-2 py-0.5 rounded-sm ${
                        isLight
                          ? "text-emerald-700 border-emerald-850 bg-emerald-950/10"
                          : "text-red-500/80 border-red-950 bg-red-950/20"
                      }`}
                    >
                      {getCategoryLabel(project.category)}
                    </span>
                    <span className="text-[0.68rem] font-mono text-text-secondary/35">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Card Footer details */}
                  <div className="relative z-10 p-5 border-t border-text-color/5 bg-black/40 backdrop-blur-xs space-y-2">
                    <h3
                      className={`text-xl font-bold uppercase tracking-tight text-white transition-colors truncate ${
                        isLight ? "group-hover:text-emerald-500" : "group-hover:text-red-500"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {project.summary}
                    </p>
                    
                    {/* Status link triggers */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        {project.github ? <Github size={12} className="text-white/40" /> : null}
                        {project.live ? <ExternalLink size={12} className="text-white/40" /> : null}
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                              isLight
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                            }`}
                          />
                          <span
                            className={`text-[0.55rem] font-mono uppercase tracking-widest ${
                              isLight ? "text-emerald-500" : "text-red-500"
                            }`}
                          >
                            {isLight ? "SURVEYING" : "ACTIVE"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}

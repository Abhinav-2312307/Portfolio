"use client"

import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ExternalLink, Github } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type Project = {
  category: "ai" | "full-stack" | "utility" | "web"
  description: string
  details: string
  github?: string
  highlights: string[]
  image: string
  live?: string
  period?: string
  stack: string[]
  status?: string
  summary: string
  title: string
}

const projectFilters = [
  { label: "All Work", value: "all" },
  { label: "AI", value: "ai" },
  { label: "Full Stack", value: "full-stack" },
  { label: "Web", value: "web" },
  { label: "Utility", value: "utility" },
] as const

const projects: Project[] = [
  {
    category: "full-stack",
    description: "A SaaS-oriented multi-portal printing platform for students, admins, and order workflows.",
    details:
      "Built as a production-style printing system with student ordering, admin visibility, supplier handling, and payment-aware flows so the full document journey feels reliable instead of pieced together.",
    github: "https://github.com/Abhinav-2312307/printmypagex",
    highlights: [
      "Designed a student-to-admin order flow with clearer operational states.",
      "Connected payment, fulfillment, and status visibility into one product surface.",
    ],
    image: "/printmypagepsit.png",
    live: "https://printmypagepsit.store/",
    stack: ["Next.js", "React", "Node.js", "MongoDB", "Firebase", "REST APIs"],
    summary: "Production-style platform for seamless document printing and order flows.",
    title: "PrintMyPagePSIT",
  },
  {
    category: "ai",
    description: "Legal information experience shaped around AI-assisted support and accessible resource discovery.",
    details:
      "JusticeAlly is centered on making legal help feel easier to navigate through cleaner information architecture, guided support, and AI-assisted discovery across complex topics.",
    github: "https://github.com/Abhinav-2312307/JusticeAlly",
    highlights: [
      "Focused the product on legal information clarity and discoverability.",
      "Used AI support to make interaction more direct and useful.",
    ],
    image: "/justiceAlly.png",
    live: "https://justice-ally.vercel.app/",
    stack: ["Next.js", "React", "OpenAI API", "Python", "MySQL"],
    summary: "AI-powered legal helper focused on clarity, accessibility, and real utility.",
    title: "JusticeAlly",
  },
  {
    category: "full-stack",
    description: "Geospatial civic issue reporting platform with AQI comparison and authority routing.",
    details:
      "Built around map-based complaint reporting, regional comparison, and smarter routing so infrastructure issues become visible, comparable, and easier to direct to the right department.",
    highlights: [
      "Architected a geospatial civic issue reporting flow with public complaint visibility.",
      "Built an Area Quality Index across 10+ infrastructure parameters.",
    ],
    image: "/placeholder.jpg",
    period: "Apr 2026 - Present",
    stack: ["React.js", "Node.js", "PostgreSQL", "PostGIS", "Leaflet.js"],
    status: "In Progress",
    summary: "Civic reporting system combining live maps, AQI-style comparison, and smarter complaint routing.",
    title: "Civic Intelligence Platform",
  },
  {
    category: "utility",
    description: "Encryption-focused interface for image security workflows with a clean, task-first shell.",
    details:
      "The image encryption tool keeps the interface direct so secure image handling stays simple, fast, and focused on the core task.",
    github: "https://github.com/Abhinav-2312307/Image-Encryption",
    highlights: [
      "Built a direct interface for image security-oriented tasks.",
      "Kept the product shell simple so the main action stays obvious.",
    ],
    image: "/imgEnc.png",
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    summary: "Secure image transformation utility with emphasis on direct user actions.",
    title: "Image Encryption Tool",
  },
  {
    category: "web",
    description: "Directional product site for mapping PSIT campus routes with stronger navigation context.",
    details:
      "MapMyPSIT turns campus navigation into a clearer experience with route-oriented interaction, location context, and better discoverability.",
    github: "https://github.com/Abhinav-2312307/Map-MY-PSIT",
    highlights: [
      "Built around campus-specific route discovery rather than a generic site shell.",
      "Made navigation easier for students with clearer location context.",
    ],
    image: "/mapmypsit.png",
    live: "https://map-my-psit.vercel.app/#",
    stack: ["Next.js", "React", "Node.js", "DBMS", "Tailwind CSS"],
    summary: "Campus navigation project built around discoverability and student convenience.",
    title: "MapMyPSIT",
  },
  {
    category: "web",
    description: "Classic game interaction rebuilt with cleaner frontend flow and browser-friendly polish.",
    details:
      "This Tic Tac Toe project reworks a familiar interaction into a sharper browser experience with quicker feedback and replay flow.",
    github: "https://github.com/Abhinav-2312307/TicTacToe",
    highlights: [
      "Rebuilt the game loop with smoother browser interaction.",
      "Focused on fast feedback and replayability in the UI.",
    ],
    image: "/tictactoe.png",
    live: "https://tictactoe-psit.vercel.app/",
    stack: ["HTML", "CSS", "JavaScript"],
    summary: "Fast browser game experiment focused on interaction and replayability.",
    title: "Tic Tac Toe",
  },
  {
    category: "ai",
    description: "Upcoming trip-planning system shaped around itinerary generation and assistive booking flows.",
    details:
      "Travel AI explores how itinerary generation, NLP, and travel support can come together in one system that helps users move from idea to plan with less friction.",
    github: "https://github.com/Abhinav-2312307/TravelAI",
    highlights: [
      "Combined itinerary thinking with conversational travel assistance.",
      "Explored NLP-driven planning and support experiences.",
    ],
    image: "/travelAI.png",
    live: "https://travel-ai-red.vercel.app/",
    stack: ["Next.js", "React", "OpenAI API", "Node.js", "NLP"],
    status: "In Progress",
    summary: "AI-assisted travel concept combining planning, automation, and conversational support.",
    title: "Travel AI",
  },
  {
    category: "ai",
    description: "Sign-language communication concept built around interpretation and expressive accessibility.",
    details:
      "A Silent Voice focuses on communication accessibility by translating user input into sign-oriented guidance.",
    highlights: [
      "Built around accessibility and communication support as the main outcome.",
      "Combined input interpretation with sign-language-oriented responses.",
    ],
    image: "/silentvoice.png",
    stack: ["Next.js", "React", "OpenAI API", "NLP", "DBMS"],
    status: "In Progress",
    summary: "Accessibility-first concept for converting input into hand-sign communication cues.",
    title: "A Silent Voice",
  },
  {
    category: "web",
    description: "The portfolio itself, rebuilt as a sharper product experience rather than a flat resume page.",
    details:
      "This portfolio pushes toward stronger interaction hierarchy, more intentional motion, and cleaner section behavior.",
    highlights: [
      "Reworked the layout toward editorial structure instead of flat cards.",
      "Focused on stronger section transitions and scroll behavior.",
    ],
    image: "/portf.png",
    live: "https://portfolio-abhinavsahu.vercel.app/",
    stack: ["Next.js", "Framer Motion", "Tailwind CSS", "Locomotive Scroll"],
    summary: "This site, now treated like a product experience rather than a static resume page.",
    title: "Portfolio Experience",
  },
]

function getCategoryLabel(category: Project["category"]) {
  switch (category) {
    case "full-stack":
      return "Full Stack"
    case "ai":
      return "AI"
    case "utility":
      return "Utility"
    default:
      return "Web"
  }
}

function StickyProjectPanel({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frameId = 0

    const updatePosition = () => {
      frameId = 0

      const wrapper = wrapperRef.current
      const panel = panelRef.current

      if (!wrapper || !panel) {
        return
      }

      if (window.innerWidth < 1024) {
        panel.style.transform = "translate3d(0, 0, 0)"
        return
      }

      const wrapperRect = wrapper.getBoundingClientRect()
      const wrapperHeight = wrapper.offsetHeight
      const panelHeight = panel.offsetHeight
      const maxTranslate = Math.max(0, wrapperHeight - panelHeight)

      if (maxTranslate === 0) {
        panel.style.transform = "translate3d(0, 0, 0)"
        return
      }

      const minViewportTop = 152
      const maxViewportTop = Math.max(minViewportTop, window.innerHeight - panelHeight - 28)
      const travelDistance = Math.max(1, maxTranslate - (maxViewportTop - minViewportTop))
      const progress = Math.min(Math.max((minViewportTop - wrapperRect.top) / travelDistance, 0), 1)
      const translate = progress * maxTranslate

      panel.style.transform = `translate3d(0, ${translate}px, 0)`
    }

    const scheduleUpdate = () => {
      if (frameId !== 0) {
        return
      }

      frameId = window.requestAnimationFrame(updatePosition)
    }

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            scheduleUpdate()
          })

    if (wrapperRef.current) {
      resizeObserver?.observe(wrapperRef.current)
    }

    if (panelRef.current) {
      resizeObserver?.observe(panelRef.current)
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate, { passive: true })

    scheduleUpdate()
    const timeoutId = window.setTimeout(scheduleUpdate, 120)

    return () => {
      window.clearTimeout(timeoutId)
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
      resizeObserver?.disconnect()
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="hidden lg:block lg:h-full">
      <div ref={panelRef} className="space-y-4 will-change-transform">
        {children}
      </div>
    </div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]["value"]>("all")
  const [selectedTitle, setSelectedTitle] = useState(projects[0]?.title ?? "")
  const prefersReducedMotion = useReducedMotion()

  const filteredProjects = useMemo(() => {
    return filter === "all" ? projects : projects.filter((p) => p.category === filter)
  }, [filter])

  const activeProject = filteredProjects.find((p) => p.title === selectedTitle) ?? filteredProjects[0] ?? projects[0]

  useEffect(() => {
    if (!filteredProjects.some((p) => p.title === selectedTitle)) {
      setSelectedTitle(filteredProjects[0]?.title ?? "")
    }
  }, [filteredProjects, selectedTitle])

  return (
    <section
      id="projects"
      data-scroll-section
      className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--dark-color)_/_0.98),rgb(var(--secondary-color)_/_0.94))]" />
      <div className="absolute inset-0 opacity-14 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:94px_94px]" />
      <div className="absolute right-[-8%] top-[16%] h-[16rem] w-[24rem] bg-[radial-gradient(circle,rgba(90,121,255,0.14),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header + Filters */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-primary-light">Selected Work</p>
            <h2 className="mt-3 text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-text-color">
              Projects
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {projectFilters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setFilter(item.value)
                  const next = item.value === "all" ? projects[0] : projects.find((p) => p.category === item.value)
                  setSelectedTitle(next?.title ?? projects[0]?.title ?? "")
                }}
                className={cn(
                  "glass-pill px-3.5 py-2 text-[0.68rem] uppercase tracking-[0.24em] transition-all duration-200",
                  filter === item.value
                    ? "border-primary-color/35 bg-primary-color/10 text-primary-color"
                    : "text-text-secondary hover:border-primary-color/18 hover:text-text-color",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main layout: sticky panel + 2-col grid */}
        <div id="projects-grid-wrap" className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-stretch">
          {/* Sticky detail panel */}
          <StickyProjectPanel>
            <div className="glass-panel-strong rounded-[28px] p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject?.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.34em] text-text-secondary">Active Project</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-text-color">
                        {activeProject?.title}
                      </h3>
                    </div>
                    {activeProject?.status ? (
                      <span className="glass-pill shrink-0 border-primary-color/28 bg-primary-color/10 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-primary-color">
                        {activeProject.status}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="glass-pill px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-text-color">
                      {getCategoryLabel(activeProject?.category ?? "web")}
                    </span>
                    {activeProject?.period ? (
                      <span className="glass-pill px-2.5 py-1 text-[0.68rem] text-text-color">{activeProject.period}</span>
                    ) : null}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-text-color">{activeProject?.summary}</p>

                  <div className="mt-3 space-y-2">
                    {activeProject?.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-color" />
                        <p className="text-[0.82rem] leading-6 text-text-secondary">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeProject?.github ? (
                      <a
                        href={activeProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-pill inline-flex items-center gap-2 px-3.5 py-2 text-sm text-text-color transition-all duration-200 hover:border-primary-color/35 hover:text-primary-color"
                      >
                        <Github size={15} />
                        GitHub
                      </a>
                    ) : null}
                    {activeProject?.live ? (
                      <a
                        href={activeProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgb(var(--primary-color)_/_0.94),rgb(var(--accent-color)_/_0.84))] px-3.5 py-2 text-sm font-semibold text-contrast-color shadow-[0_10px_24px_rgb(var(--primary-color)_/_0.16)] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        View Live
                        <ArrowUpRight size={14} />
                      </a>
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </StickyProjectPanel>

          {/* 2-column grid of project cards */}
          <div className="grid gap-5 self-start sm:grid-cols-2">
            {filteredProjects.map((project, index) => {
              const isSelected = activeProject?.title === project.title

              return (
                <motion.article
                  key={project.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: index % 2 === 1 ? 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedTitle(project.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setSelectedTitle(project.title)
                    }
                  }}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-[22px] border transition-all duration-200",
                    isSelected
                      ? "border-primary-color/30 bg-[linear-gradient(180deg,rgb(var(--glass-bg-strong)_/_0.96),rgb(var(--glass-bg)_/_0.76))] shadow-[0_16px_36px_rgb(var(--primary-color)_/_0.1)]"
                      : "border-[rgb(var(--glass-border)_/_0.1)] bg-[linear-gradient(180deg,rgb(var(--glass-bg-strong)_/_0.9),rgb(var(--glass-bg)_/_0.6))] shadow-[0_10px_24px_rgb(var(--overlay-color)_/_0.12)] hover:border-[rgb(var(--glass-border)_/_0.18)]",
                  )}
                >
                  {/* Image on top */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-400 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,8,12,0.75)_88%,rgba(6,8,12,0.95))]" />

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <span className="glass-pill bg-black/40 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-white/90">
                        {getCategoryLabel(project.category)}
                      </span>
                      {project.status ? (
                        <span className="glass-pill border-primary-color/30 bg-primary-color/15 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-primary-color">
                          {project.status}
                        </span>
                      ) : null}
                    </div>

                    <div className="absolute right-3 top-3 text-[0.58rem] uppercase tracking-[0.3em] text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Title on bottom of image */}
                    <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-white">{project.title}</h3>
                    </div>
                  </div>

                  {/* Info below */}
                  <div className="space-y-3 p-4">
                    <p className="text-[0.82rem] leading-6 text-text-secondary">{project.summary}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="glass-pill px-2 py-0.5 text-[0.65rem] text-text-secondary">
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 3 ? (
                        <span className="glass-pill px-2 py-0.5 text-[0.65rem] text-text-secondary">
                          +{project.stack.length - 3}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-pill inline-flex h-8 w-8 items-center justify-center text-text-secondary transition-colors duration-200 hover:text-primary-color"
                          aria-label={`${project.title} GitHub`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={14} />
                        </a>
                      ) : null}
                      {project.live ? (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-pill inline-flex h-8 w-8 items-center justify-center text-text-secondary transition-colors duration-200 hover:text-primary-color"
                          aria-label={`${project.title} live`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : null}

                      {isSelected && (
                        <span className="ml-auto flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-color shadow-[0_0_8px_rgb(var(--primary-color)/0.5)]" />
                          <span className="text-[0.55rem] uppercase tracking-[0.2em] text-primary-color">Active</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

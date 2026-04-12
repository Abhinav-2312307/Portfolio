"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { ProjectItem, ProjectsContent } from "@/lib/portfolio/schema"
import { cn } from "@/lib/utils"

function getCategoryLabel(category: string) {
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
  const trackRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frameId = 0

    const updatePosition = () => {
      frameId = 0

      const track = trackRef.current
      const shell = shellRef.current

      if (!track || !shell) {
        return
      }

      if (window.innerWidth < 1024) {
        shell.style.position = "relative"
        shell.style.top = "0px"
        shell.style.left = "0px"
        shell.style.width = "100%"
        shell.style.transform = "translate3d(0, 0, 0)"
        return
      }

      const trackRect = track.getBoundingClientRect()
      const shellHeight = shell.offsetHeight
      const maxTranslate = Math.max(0, track.offsetHeight - shellHeight)
      const startTop = 110
      const endTop = Math.max(startTop, window.innerHeight - shellHeight - 28)
      const progress = Math.min(Math.max((startTop - trackRect.top) / Math.max(1, maxTranslate), 0), 1)
      const desiredTop = startTop + (endTop - startTop) * progress

      if (trackRect.top > startTop) {
        shell.style.position = "absolute"
        shell.style.top = "0px"
        shell.style.left = "0px"
        shell.style.width = "100%"
        shell.style.transform = "translate3d(0, 0, 0)"
        return
      }

      const bottomLocked = trackRect.bottom <= desiredTop + shellHeight

      if (bottomLocked) {
        shell.style.position = "absolute"
        shell.style.top = `${maxTranslate}px`
        shell.style.left = "0px"
        shell.style.width = "100%"
        shell.style.transform = "translate3d(0, 0, 0)"
        return
      }

      shell.style.position = "fixed"
      shell.style.top = `${desiredTop}px`
      shell.style.left = `${trackRect.left}px`
      shell.style.width = `${trackRect.width}px`
      shell.style.transform = "translate3d(0, 0, 0)"
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

    if (trackRef.current) {
      resizeObserver?.observe(trackRef.current)
    }

    if (shellRef.current) {
      resizeObserver?.observe(shellRef.current)
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
    <aside ref={trackRef} className="relative hidden lg:block lg:h-full lg:self-stretch">
      <div ref={shellRef} className="w-full will-change-transform">
        <div className="relative overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(9,12,20,0.96),rgba(12,17,27,0.92))] shadow-[0_24px_56px_rgba(0,0,0,0.22)]">
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(79,239,255,0.06),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(90,121,255,0.06))]" />
          <div className="absolute bottom-5 right-4 top-5 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />

          <div className="relative z-20 px-4 py-3">{children}</div>
        </div>
      </div>
    </aside>
  )
}

type ProjectsProps = {
  projects?: ProjectsContent
}

export default function Projects({ projects = defaultPortfolioContent.projects }: ProjectsProps) {
  const [filter, setFilter] = useState<string>(projects.filters[0]?.value ?? "all")
  const [selectedTitle, setSelectedTitle] = useState(projects.items[0]?.title ?? "")
  const prefersReducedMotion = useReducedMotion()

  const filteredProjects = useMemo(() => {
    return filter === "all" ? projects.items : projects.items.filter((project) => project.category === filter)
  }, [filter, projects.items])

  const activeProject =
    filteredProjects.find((project) => project.title === selectedTitle) ?? filteredProjects[0] ?? projects.items[0]
  const activeProjectIndex = Math.max(
    0,
    filteredProjects.findIndex((project) => project.title === activeProject?.title),
  )

  useEffect(() => {
    setFilter((currentFilter) =>
      projects.filters.some((item) => item.value === currentFilter) ? currentFilter : projects.filters[0]?.value ?? "all",
    )
    setSelectedTitle((currentTitle) =>
      projects.items.some((project) => project.title === currentTitle) ? currentTitle : projects.items[0]?.title ?? "",
    )
  }, [projects.filters, projects.items])

  useEffect(() => {
    if (!filteredProjects.some((project) => project.title === selectedTitle)) {
      setSelectedTitle(filteredProjects[0]?.title ?? "")
    }
  }, [filteredProjects, selectedTitle])

  return (
    <section
      id="projects"
      data-scroll-section
      className="relative overflow-hidden px-6 pb-20 pt-10 md:px-10 md:pb-24 md:pt-12 lg:px-16 lg:pb-28 lg:pt-14"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--dark-color)_/_0.98),rgb(var(--secondary-color)_/_0.94))]" />
      <div className="absolute inset-0 opacity-14 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:94px_94px]" />
      <div className="absolute right-[-8%] top-[16%] h-[16rem] w-[24rem] bg-[radial-gradient(circle,rgba(90,121,255,0.14),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-5 md:mb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-primary-light">{projects.sectionLabel}</p>
            <h2 className="mt-3 text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-text-color">
              {projects.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {projects.filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setFilter(item.value)
                  const next =
                    item.value === "all" ? projects.items[0] : projects.items.find((project) => project.category === item.value)
                  setSelectedTitle(next?.title ?? projects.items[0]?.title ?? "")
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

        <div id="projects-grid-wrap" className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-stretch">
          <StickyProjectPanel>
            <div className="glass-panel-strong overflow-hidden rounded-[26px] border-white/10 bg-[linear-gradient(180deg,rgba(6,10,18,0.96),rgba(10,16,26,0.88))] px-3.5 py-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeProject?.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                  className="project-sidebar-scroll flex max-h-[calc(100vh-10.25rem)] flex-col gap-2.5 overflow-y-auto pr-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.56rem] uppercase tracking-[0.3em] text-primary-light">Selected Project</p>
                      <h3 className="mt-2 max-w-[11rem] text-[1.18rem] font-semibold leading-[1.06] tracking-[-0.05em] text-white">
                        {activeProject?.title}
                      </h3>
                    </div>
                    <div className="shrink-0 rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.24em] text-white/72">
                      {String(activeProjectIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="glass-pill border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-white/88">
                      {getCategoryLabel(activeProject?.category ?? "web")}
                    </span>
                    {activeProject?.status ? (
                      <span className="glass-pill border-primary-color/28 bg-primary-color/12 px-2.5 py-1 text-[0.56rem] uppercase tracking-[0.22em] text-primary-color">
                        {activeProject.status}
                      </span>
                    ) : null}
                    {activeProject?.period ? (
                      <span className="glass-pill border-white/10 bg-white/[0.02] px-2.5 py-1 text-[0.6rem] text-text-color">
                        {activeProject.period}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[0.8rem] leading-6 text-text-secondary">{activeProject?.description}</p>

                  <div className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,14,24,0.88),rgba(12,18,28,0.74))] p-3.5">
                    <p className="text-[0.54rem] uppercase tracking-[0.3em] text-text-secondary">Highlights</p>

                    <div className="mt-3 space-y-2.5">
                      {activeProject?.highlights.slice(0, 2).map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-color shadow-[0_0_10px_rgb(var(--primary-color)/0.42)]" />
                          <p className="text-[0.79rem] leading-6 text-text-secondary">{item}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-[0.54rem] uppercase tracking-[0.3em] text-text-secondary">Tech Stack</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activeProject?.stack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="glass-pill border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.62rem] text-text-color"
                          >
                            {tech}
                          </span>
                        ))}
                        {activeProject && activeProject.stack.length > 4 ? (
                          <span className="glass-pill border-white/10 bg-white/[0.02] px-2 py-0.5 text-[0.62rem] text-text-color">
                            +{activeProject.stack.length - 4}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeProject?.github ? (
                        <a
                          href={activeProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-pill inline-flex items-center gap-2 px-3 py-2 text-[0.78rem] text-text-color transition-all duration-200 hover:border-primary-color/35 hover:text-primary-color"
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
                          className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgb(var(--primary-color)_/_0.94),rgb(var(--accent-color)_/_0.84))] px-3 py-2 text-[0.78rem] font-semibold text-contrast-color shadow-[0_10px_24px_rgb(var(--primary-color)_/_0.16)] transition-all duration-200 hover:-translate-y-0.5"
                        >
                          View Live
                          <ArrowUpRight size={14} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </StickyProjectPanel>

          <div className="grid gap-5 self-start sm:grid-cols-2">
            {filteredProjects.map((project, index) => {
              const isSelected = activeProject?.title === project.title

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
                    "group relative cursor-pointer overflow-hidden rounded-[22px] border transition-all duration-200",
                    isSelected
                      ? "border-primary-color/30 bg-[linear-gradient(180deg,rgb(var(--glass-bg-strong)_/_0.96),rgb(var(--glass-bg)_/_0.76))] shadow-[0_16px_36px_rgb(var(--primary-color)_/_0.1)]"
                      : "border-[rgb(var(--glass-border)_/_0.1)] bg-[linear-gradient(180deg,rgb(var(--glass-bg-strong)_/_0.9),rgb(var(--glass-bg)_/_0.6))] shadow-[0_10px_24px_rgb(var(--overlay-color)_/_0.12)] hover:border-[rgb(var(--glass-border)_/_0.18)]",
                  )}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-400 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,8,12,0.75)_88%,rgba(6,8,12,0.95))]" />

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

                    <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-white">{project.title}</h3>
                    </div>
                  </div>

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
                          onClick={(event) => event.stopPropagation()}
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
                          onClick={(event) => event.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : null}

                      {isSelected ? (
                        <span className="ml-auto flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-color shadow-[0_0_8px_rgb(var(--primary-color)/0.5)]" />
                          <span className="text-[0.55rem] uppercase tracking-[0.2em] text-primary-color">Active</span>
                        </span>
                      ) : null}
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

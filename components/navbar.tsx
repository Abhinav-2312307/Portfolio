"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

import CandleThemeToggle from "@/components/candle-theme-toggle"
import ResumeButton from "@/components/resume-button"
import { useActiveSection } from "@/hooks/use-active-section"
import { lockActiveSection, requestPortfolioScrollTo } from "@/lib/smooth-scroll"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Wins" },
  { id: "hobbies", label: "Beyond" },
  { id: "contact", label: "Contact" },
] as const

type NavItemId = (typeof navItems)[number]["id"]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    opacity: 0,
    width: 0,
  })
  const sectionIds = useMemo(() => navItems.map((item) => item.id), [])
  const activeSection = useActiveSection(sectionIds, 132) as NavItemId
  const activeItem = useMemo(() => navItems.find((item) => item.id === activeSection) ?? navItems[0], [activeSection])
  const desktopNavRef = useRef<HTMLDivElement>(null)
  const desktopButtonRefs = useRef<Record<NavItemId, HTMLButtonElement | null>>({
    home: null,
    about: null,
    education: null,
    skills: null,
    projects: null,
    achievements: null,
    hobbies: null,
    contact: null,
  })

  useEffect(() => {
    const updateScrolled = (y: number) => {
      setScrolled((current) => {
        const next = y > 24
        return current === next ? current : next
      })
    }

    const handleWindowScroll = () => {
      updateScrolled(window.scrollY)
    }

    window.addEventListener("scroll", handleWindowScroll, { passive: true })
    handleWindowScroll()

    return () => {
      window.removeEventListener("scroll", handleWindowScroll)
    }
  }, [])

  useEffect(() => {
    const updateIndicator = () => {
      const container = desktopNavRef.current
      const button = desktopButtonRefs.current[activeSection]

      if (!container || !button) {
        setIndicatorStyle((current) => (current.opacity === 0 ? current : { ...current, opacity: 0 }))
        return
      }

      const containerRect = container.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        opacity: 1,
        width: buttonRect.width,
      })
    }

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            updateIndicator()
          })

    if (desktopNavRef.current) {
      resizeObserver?.observe(desktopNavRef.current)
    }

    updateIndicator()
    window.addEventListener("resize", updateIndicator, { passive: true })
    window.addEventListener("load", updateIndicator)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener("resize", updateIndicator)
      window.removeEventListener("load", updateIndicator)
    }
  }, [activeSection])

  const scrollToSection = (id: NavItemId) => {
    lockActiveSection(id, 1100)
    requestPortfolioScrollTo({
      id,
      offset: id === "home" ? -84 : -104,
    })
    setIsOpen(false)
  }

  const isActive = (section: NavItemId) => activeSection === section

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <motion.div
        className={cn(
          "liquid-glass theme-transition-safe mx-auto max-w-[90rem] rounded-[28px] border border-[rgb(var(--glass-border)_/_0.16)] bg-[linear-gradient(135deg,rgb(var(--glass-bg-strong)_/_0.9),rgb(var(--glass-bg)_/_0.68))] shadow-[0_18px_40px_rgb(var(--overlay-color)_/_0.14)] px-4 md:px-5",
          scrolled ? "py-2.5" : "py-3",
        )}
        animate={{
          scale: scrolled ? 0.992 : 1,
          y: scrolled ? -2 : 0,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="flex min-w-0 items-center gap-3 rounded-full text-left transition-transform duration-300 hover:-translate-y-0.5"
            aria-label="Scroll to hero section"
          >
            <span className="glass-pill flex h-10 w-10 shrink-0 items-center justify-center border border-[rgb(var(--glass-border)_/_0.16)] bg-[linear-gradient(135deg,rgb(var(--glass-bg-strong)_/_0.92),rgb(var(--glass-bg)_/_0.74))] text-sm font-semibold text-text-color shadow-[0_8px_22px_rgb(var(--overlay-color)_/_0.12)]">
              AS
            </span>
            <span className="min-w-0">
              <span className="block truncate bg-[linear-gradient(135deg,rgb(var(--primary-light)),rgb(var(--accent-color)))] bg-clip-text text-[1.02rem] font-semibold tracking-[-0.04em] text-transparent">
                Abhinav Sahu
              </span>
              <span className="hidden truncate text-[0.62rem] uppercase tracking-[0.34em] text-text-secondary md:block">
                AI Product Engineer
              </span>
            </span>
          </button>

          <div ref={desktopNavRef} className="relative hidden flex-1 items-center justify-center xl:flex">
            <div className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--glass-border)_/_0.18)] to-transparent" />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-[linear-gradient(90deg,rgba(79,239,255,0.92),rgba(90,121,255,0.92))] shadow-[0_0_18px_rgba(79,239,255,0.26)]"
              animate={indicatorStyle}
              transition={{ type: "spring", stiffness: 800, damping: 50, mass: 0.2 }}
            />

            <div className="flex items-center gap-1 pb-3 pt-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  ref={(element) => {
                    desktopButtonRefs.current[item.id] = element
                  }}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  aria-current={isActive(item.id) ? "page" : undefined}
                  className={cn(
                    "theme-transition-safe rounded-full px-3.5 py-2.5 text-[0.72rem] uppercase tracking-[0.22em]",
                    isActive(item.id)
                      ? "bg-[linear-gradient(135deg,rgba(78,123,255,0.18),rgba(79,239,255,0.14))] text-text-color shadow-[0_12px_24px_rgba(77,122,255,0.12)]"
                      : "text-text-secondary hover:bg-white/6 hover:text-text-color",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <div className="glass-pill inline-flex items-center gap-2 border border-[rgb(var(--glass-border)_/_0.14)] px-3 py-2 text-[0.65rem] uppercase tracking-[0.26em] text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-primary-color" />
              {activeItem.label}
            </div>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="glass-pill inline-flex items-center gap-2 border border-[rgb(var(--glass-border)_/_0.16)] px-4 py-2.5 text-sm font-semibold text-text-color transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--primary-color)_/_0.35)] hover:text-primary-color"
            >
              Contact
              <ArrowUpRight size={16} />
            </button>
            <ResumeButton />
            <CandleThemeToggle />
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <CandleThemeToggle className="scale-[0.96]" />
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="glass-pill theme-transition-safe flex h-11 w-11 items-center justify-center text-text-color hover:text-primary-color"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="overflow-hidden xl:hidden"
            >
              <div className="glass-panel space-y-3 rounded-[24px] p-4">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <span className="text-[0.64rem] uppercase tracking-[0.28em] text-text-secondary">Now viewing</span>
                  <span className="text-sm font-medium text-text-color">{activeItem.label}</span>
                </div>

                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "theme-transition-safe flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm uppercase tracking-[0.18em]",
                      isActive(item.id)
                        ? "bg-[linear-gradient(135deg,rgba(78,123,255,0.18),rgba(79,239,255,0.14))] text-text-color"
                        : "bg-white/[0.03] text-text-secondary hover:bg-white/[0.06] hover:text-text-color",
                    )}
                  >
                    <span>{item.label}</span>
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-all duration-300",
                        isActive(item.id) ? "bg-primary-color shadow-[0_0_16px_rgb(var(--primary-color)/0.35)]" : "bg-white/10",
                      )}
                    />
                  </button>
                ))}

                <div className="grid gap-3 pt-1 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection("contact")}
                    className="rounded-2xl bg-[linear-gradient(135deg,rgb(var(--primary-color)_/_0.92),rgb(var(--accent-color)_/_0.84))] px-4 py-3 text-sm font-semibold text-contrast-color"
                  >
                    Contact
                  </button>
                  <ResumeButton fullWidth />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <Link href="#home" className="sr-only">
        Skip to home
      </Link>
    </nav>
  )
}

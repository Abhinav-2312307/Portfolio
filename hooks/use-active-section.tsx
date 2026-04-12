"use client"

import { useEffect, useRef, useState } from "react"

import {
  PORTFOLIO_SECTION_LOCK_EVENT,
  type PortfolioSectionLock,
} from "@/lib/smooth-scroll"

export function useActiveSection(sections: string[], offset = 120) {
  const [activeSection, setActiveSection] = useState<string>(sections[0] ?? "")
  const frameRef = useRef<number | null>(null)
  const sectionLockRef = useRef<{ id: string; until: number } | null>(null)

  useEffect(() => {
    const resolveActiveSection = () => {
      const entries = sections
        .map((sectionId) => {
          const element = document.getElementById(sectionId)

          if (!element) {
            return null
          }

          return {
            id: sectionId,
            rect: element.getBoundingClientRect(),
          }
        })
        .filter((entry): entry is { id: string; rect: DOMRect } => entry !== null)

      if (!entries.length) {
        return
      }

      const currentLock = sectionLockRef.current
      if (currentLock) {
        if (Date.now() < currentLock.until) {
          setActiveSection(currentLock.id)
          return
        }

        sectionLockRef.current = null
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
        const lastSection = entries[entries.length - 1]?.id
        if (lastSection) {
          setActiveSection((current) => (current === lastSection ? current : lastSection))
        }
        return
      }

      const marker = offset + 24
      let candidate = entries[0]?.id ?? ""

      for (const entry of entries) {
        if (entry.rect.top <= marker) {
          candidate = entry.id
          continue
        }

        break
      }

      setActiveSection((current) => (current === candidate ? current : candidate))
    }

    const scheduleResolve = () => {
      if (frameRef.current !== null) {
        return
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        resolveActiveSection()
      })
    }

    const handleScroll = () => {
      scheduleResolve()
    }

    const handleLock = (event: Event) => {
      const detail = (event as CustomEvent<PortfolioSectionLock>).detail
      if (!detail) {
        return
      }

      sectionLockRef.current = {
        id: detail.sectionId,
        until: Date.now() + detail.duration,
      }
      setActiveSection(detail.sectionId)
      scheduleResolve()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    window.addEventListener(PORTFOLIO_SECTION_LOCK_EVENT, handleLock as EventListener)

    scheduleResolve()
    const timeoutId = window.setTimeout(scheduleResolve, 180)

    return () => {
      window.clearTimeout(timeoutId)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      window.removeEventListener(PORTFOLIO_SECTION_LOCK_EVENT, handleLock as EventListener)
    }
  }, [offset, sections.join("|")])

  useEffect(() => {
    setActiveSection((current) => current || sections[0] || "")
  }, [sections])

  return activeSection
}

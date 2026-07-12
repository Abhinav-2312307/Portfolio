"use client"

import { useEffect, useRef, useState } from "react"
import { PORTFOLIO_SECTION_LOCK_EVENT, type PortfolioSectionLock } from "@/lib/smooth-scroll"

export function useActiveSection(sections: string[], offset = 120) {
  const [activeSection, setActiveSection] = useState<string>(sections[0] ?? "")
  const sectionLockRef = useRef<{ id: string; until: number } | null>(null)

  useEffect(() => {
    if (sections.length === 0) return

    const handleLock = (event: Event) => {
      const detail = (event as CustomEvent<PortfolioSectionLock>).detail
      if (!detail) return

      sectionLockRef.current = {
        id: detail.sectionId,
        until: Date.now() + detail.duration,
      }
      setActiveSection(detail.sectionId)
    }

    window.addEventListener(PORTFOLIO_SECTION_LOCK_EVENT, handleLock as EventListener)

    // Using IntersectionObserver for robust section detection on scroll
    const observerOptions = {
      root: null,
      // Focus detection on the upper half of the screen
      rootMargin: `-${offset}px 0px -45% 0px`,
      threshold: [0, 0.1, 0.2],
    }

    const callback = (entries: IntersectionObserverEntry[]) => {
      // Check if locked
      const currentLock = sectionLockRef.current
      if (currentLock) {
        if (Date.now() < currentLock.until) {
          setActiveSection(currentLock.id)
          return
        }
        sectionLockRef.current = null
      }

      // Find the best intersecting section
      let bestIntersecting: { id: string; ratio: number } | null = null

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ratio = entry.intersectionRatio
          if (!bestIntersecting || ratio > bestIntersecting.ratio) {
            bestIntersecting = { id: entry.target.id, ratio }
          }
        }
      })

      if (bestIntersecting) {
        setActiveSection((bestIntersecting as any).id)
      }
    };

    const observer = new IntersectionObserver(callback, observerOptions)

    // Observe each section
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
      }
    })

    // Periodic fallback check in case of scroll stops outside margins
    const scrollFallback = () => {
      const currentLock = sectionLockRef.current
      if (currentLock && Date.now() < currentLock.until) {
        return
      }

      const marker = offset + 30
      let candidate = activeSection

      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top <= marker && rect.bottom >= marker) {
          candidate = id
        }
      })

      setActiveSection(candidate)
    }

    window.addEventListener("scroll", scrollFallback, { passive: true })

    return () => {
      window.removeEventListener(PORTFOLIO_SECTION_LOCK_EVENT, handleLock as EventListener)
      window.removeEventListener("scroll", scrollFallback)
      observer.disconnect()
    }
  }, [sections, offset, activeSection])

  return activeSection
}

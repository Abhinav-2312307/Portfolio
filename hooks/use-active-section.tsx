"use client"

import { useEffect, useRef, useState } from "react"

import { PORTFOLIO_SCROLL_EVENT, type PortfolioScrollState } from "@/lib/smooth-scroll"

/**
 * Detects which section is currently "active" in the viewport.
 *
 * Uses getBoundingClientRect (which works with Locomotive Scroll transforms)
 * and tracks direction from Locomotive scroll events to prevent backward jumps.
 */
export function useActiveSection(sections: string[], offset = 120) {
  const [activeSection, setActiveSection] = useState<string>(sections[0] ?? "")
  const directionRef = useRef<1 | -1>(1)
  const lastUpdate = useRef(0)
  const prevYRef = useRef(0)

  useEffect(() => {
    const resolveActiveSection = () => {
      const anchorY = offset + 40

      let candidate = sections[0] ?? ""
      let bestDistance = Infinity

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        const top = rect.top
        const bottom = rect.bottom

        // Section is entirely above the anchor - it already passed
        if (bottom < anchorY - 50) continue

        // The section that has its top CLOSEST to (but at or above) the anchor wins
        if (top <= anchorY + 20) {
          // Section top is at or above anchor — this is the best candidate so far
          // Among those, prefer the one whose top is closest (most recently entered)
          const dist = anchorY - top
          if (dist < bestDistance) {
            bestDistance = dist
            candidate = sectionId
          }
        }
      }

      // Near bottom of page, activate last section
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
        candidate = sections[sections.length - 1] ?? candidate
      }

      setActiveSection((current) => {
        if (current === candidate) return current

        const currentIndex = sections.indexOf(current)
        const candidateIndex = sections.indexOf(candidate)

        // Direction guard: when scrolling DOWN, don't allow jumping backwards
        // This prevents the "bounce to home" issue during Locomotive interpolation
        if (directionRef.current === 1 && candidateIndex < currentIndex) {
          // Only allow going backwards if the current section
          // is truly completely off-screen above the viewport
          const currentEl = document.getElementById(current)
          if (currentEl) {
            const currentRect = currentEl.getBoundingClientRect()
            if (currentRect.top > window.innerHeight) {
              // Current section is below viewport — allow backwards
              return candidate
            }
            if (currentRect.bottom > anchorY - 200) {
              // Current section is still somewhat visible — block backwards jump
              return current
            }
          }
        }

        return candidate
      })
    }

    // Track direction from Locomotive scroll events
    const handleLocomotiveScroll = (event: Event) => {
      const detail = (event as CustomEvent<PortfolioScrollState>).detail
      if (detail) {
        directionRef.current = detail.direction
      }

      const now = performance.now()
      if (now - lastUpdate.current < 16) return
      lastUpdate.current = now
      resolveActiveSection()
    }

    // Track direction from native scroll
    const handleNativeScroll = () => {
      const currentY = window.scrollY
      directionRef.current = currentY >= prevYRef.current ? 1 : -1
      prevYRef.current = currentY

      const now = performance.now()
      if (now - lastUpdate.current < 16) return
      lastUpdate.current = now
      resolveActiveSection()
    }

    window.addEventListener("scroll", handleNativeScroll, { passive: true })
    window.addEventListener(PORTFOLIO_SCROLL_EVENT, handleLocomotiveScroll as EventListener)
    window.addEventListener("resize", handleNativeScroll, { passive: true })

    // Initial resolve + delayed for Locomotive init
    resolveActiveSection()
    const t = setTimeout(resolveActiveSection, 500)

    return () => {
      clearTimeout(t)
      window.removeEventListener("scroll", handleNativeScroll)
      window.removeEventListener(PORTFOLIO_SCROLL_EVENT, handleLocomotiveScroll as EventListener)
      window.removeEventListener("resize", handleNativeScroll)
    }
  }, [offset, sections])

  return activeSection
}

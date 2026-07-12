"use client"

import { gsap } from "gsap"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export interface TargetCursorProps {
  targetSelector?: string
  spinDuration?: number
  hideDefaultCursor?: boolean
  hoverDuration?: number
  parallaxOn?: boolean
}

const BORDER_WIDTH = 2
const CORNER_SIZE = 8

function detectMobileCursor() {
  if (typeof window === "undefined") {
    return false
  }

  const hasTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth <= 768
  const userAgent = navigator.userAgent || navigator.vendor
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase())

  return (hasTouchScreen && isSmallScreen) || isMobileUserAgent
}

export default function TargetCursor({
  targetSelector = "button, a, [data-cursor-target='true'], .cursor-target, [role='button']",
  spinDuration = 2.5,
  hideDefaultCursor = true,
  hoverDuration = 0.25,
  parallaxOn = true,
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const spinTl = useRef<gsap.core.Timeline | null>(null)
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null)
  const tickerFnRef = useRef<(() => void) | null>(null)
  const activeStrengthRef = useRef({ current: 0 })
  const [isReady, setIsReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) {
      return
    }

    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: "power2.out",
      overwrite: "auto",
    })
  }, [])

  useEffect(() => {
    const updateDeviceMode = () => {
      setIsMobile(detectMobileCursor())
      setIsReady(true)
    }

    updateDeviceMode()
    window.addEventListener("resize", updateDeviceMode, { passive: true })

    return () => {
      window.removeEventListener("resize", updateDeviceMode)
    }
  }, [])

  useEffect(() => {
    if (!isReady || isMobile || !cursorRef.current) {
      return
    }

    const originalCursor = document.body.style.cursor
    if (hideDefaultCursor) {
      document.body.style.cursor = "none"
    }

    const cursor = cursorRef.current
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner")

    let activeTarget: Element | null = null
    let currentLeaveHandler: (() => void) | null = null
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler)
      }
      currentLeaveHandler = null
    }

    gsap.set(cursor, {
      xPercent: -55,
      yPercent: -55,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })

    const createSpinTimeline = () => {
      spinTl.current?.kill()
      spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, {
        rotation: "+=360",
        duration: spinDuration,
        ease: "none",
      })
    }

    createSpinTimeline()

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return
      }

      const strength = activeStrengthRef.current.current
      if (strength === 0) {
        return
      }

      const cursorX = gsap.getProperty(cursorRef.current, "x") as number
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number
      const corners = Array.from(cornersRef.current)

      corners.forEach((corner, index) => {
        const currentX = gsap.getProperty(corner, "x") as number
        const currentY = gsap.getProperty(corner, "y") as number
        const targetX = targetCornerPositionsRef.current![index].x - cursorX
        const targetY = targetCornerPositionsRef.current![index].y - cursorY
        const finalX = currentX + (targetX - currentX) * strength
        const finalY = currentY + (targetY - currentY) * strength
        const duration = strength >= 0.99 ? (parallaxOn ? 0.22 : 0) : 0.05

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        })
      })
    }

    tickerFnRef.current = tickerFn

    const moveHandler = (event: MouseEvent) => moveCursor(event.clientX, event.clientY)

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) {
        return
      }

      const mouseX = gsap.getProperty(cursorRef.current, "x") as number
      const mouseY = gsap.getProperty(cursorRef.current, "y") as number
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY)
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget)

      if (!isStillOverTarget) {
        currentLeaveHandler?.()
      }
    }

    const mouseDownHandler = () => {
      if (!dotRef.current || !cursorRef.current) {
        return
      }
      const glowColor = document.documentElement.classList.contains("light") 
        ? "rgba(52, 211, 153, 0.9)"
        : "rgba(220, 20, 20, 0.95)"
      gsap.to(dotRef.current, { scale: 0.65, filter: `drop-shadow(0 0 12px ${glowColor})`, duration: 0.25 })
      gsap.to(cursorRef.current, { scale: 0.88, duration: 0.18 })
    }

    const mouseUpHandler = () => {
      if (!dotRef.current || !cursorRef.current) {
        return
      }
      const glowColor = document.documentElement.classList.contains("light") 
        ? "rgba(32, 96, 74, 0.5)"
        : "rgba(180, 15, 15, 0.6)"
      gsap.to(dotRef.current, { scale: 1, filter: `drop-shadow(0 0 8px ${glowColor})`, duration: 0.25 })
      gsap.to(cursorRef.current, { scale: 1, duration: 0.18 })
    }

    const enterHandler = (event: MouseEvent) => {
      const directTarget = event.target as Element | null
      if (!directTarget) {
        return
      }

      let current: Element | null = directTarget
      let target: Element | null = null

      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          target = current
          break
        }
        current = current.parentElement
      }

      if (!target || !cursorRef.current || !cornersRef.current) {
        return
      }

      if (activeTarget === target) {
        return
      }

      if (activeTarget) {
        cleanupTarget(activeTarget)
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout)
        resumeTimeout = null
      }

      activeTarget = target

      const corners = Array.from(cornersRef.current)
      corners.forEach((corner) => gsap.killTweensOf(corner))
      gsap.killTweensOf(cursorRef.current, "rotation")
      spinTl.current?.pause()
      gsap.set(cursorRef.current, { rotation: 0 })

      const rect = target.getBoundingClientRect()
      const cursorX = gsap.getProperty(cursorRef.current, "x") as number
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number

      targetCornerPositionsRef.current = [
        { x: rect.left - BORDER_WIDTH, y: rect.top - BORDER_WIDTH },
        { x: rect.right + BORDER_WIDTH - CORNER_SIZE, y: rect.top - BORDER_WIDTH },
        { x: rect.right + BORDER_WIDTH - CORNER_SIZE, y: rect.bottom + BORDER_WIDTH - CORNER_SIZE },
        { x: rect.left - BORDER_WIDTH, y: rect.bottom + BORDER_WIDTH - CORNER_SIZE },
      ]

      gsap.ticker.add(tickerFnRef.current!)
      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: "power2.out",
      })

      corners.forEach((corner, index) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![index].x - cursorX,
          y: targetCornerPositionsRef.current![index].y - cursorY,
          duration: 0.18,
          ease: "power2.out",
        })
      })

      const leaveHandler = () => {
        if (tickerFnRef.current) {
          gsap.ticker.remove(tickerFnRef.current)
        }

        targetCornerPositionsRef.current = null
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true })
        activeTarget = null

        if (cornersRef.current) {
          const resetCorners = Array.from(cornersRef.current)
          gsap.killTweensOf(resetCorners)

          const positions = [
            { x: -CORNER_SIZE * 1.5, y: -CORNER_SIZE * 1.5 },
            { x: CORNER_SIZE * 0.5, y: -CORNER_SIZE * 1.5 },
            { x: CORNER_SIZE * 0.5, y: CORNER_SIZE * 0.5 },
            { x: -CORNER_SIZE * 1.5, y: CORNER_SIZE * 0.5 },
          ]

          const timeline = gsap.timeline()
          resetCorners.forEach((corner, index) => {
            timeline.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.28,
                ease: "power3.out",
              },
              0,
            )
          })
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(cursorRef.current, "rotation") as number
            const normalizedRotation = currentRotation % 360

            spinTl.current.kill()
            spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
              rotation: "+=360",
              duration: spinDuration,
              ease: "none",
            })

            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: "none",
              onComplete: () => spinTl.current?.restart(),
            })
          }

          resumeTimeout = null
        }, 50)

        cleanupTarget(target)
      }

      currentLeaveHandler = leaveHandler
      target.addEventListener("mouseleave", leaveHandler)
    }

    window.addEventListener("mousemove", moveHandler)
    window.addEventListener("mouseover", enterHandler as EventListener)
    window.addEventListener("scroll", scrollHandler, { passive: true })
    window.addEventListener("mousedown", mouseDownHandler)
    window.addEventListener("mouseup", mouseUpHandler)

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current)
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout)
      }

      window.removeEventListener("mousemove", moveHandler)
      window.removeEventListener("mouseover", enterHandler as EventListener)
      window.removeEventListener("scroll", scrollHandler)
      window.removeEventListener("mousedown", mouseDownHandler)
      window.removeEventListener("mouseup", mouseUpHandler)

      if (activeTarget) {
        cleanupTarget(activeTarget)
      }

      spinTl.current?.kill()
      document.body.style.cursor = originalCursor
      targetCornerPositionsRef.current = null
      activeStrengthRef.current.current = 0
    }
  }, [hideDefaultCursor, hoverDuration, isMobile, isReady, moveCursor, parallaxOn, spinDuration, targetSelector])

  useEffect(() => {
    if (!isReady || isMobile || !cursorRef.current || !spinTl.current) {
      return
    }

    if (spinTl.current.isActive()) {
      spinTl.current.kill()
      spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
        rotation: "+=360",
        duration: spinDuration,
        ease: "none",
      })
    }
  }, [isMobile, isReady, spinDuration])

  if (!isReady || isMobile) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9998] h-0 w-0"
      style={{ willChange: "transform" }}
    >
      {/* Central Reticle Emblem - glows green/red based on theme */}
      <div
        ref={dotRef}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 filter",
          isLight 
            ? "text-emerald-700 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
            : "text-red-500 drop-shadow-[0_0_8px_rgba(180,15,15,0.6)]"
        )}
        style={{ willChange: "transform" }}
      >
        {isLight ? (
          /* Wings of Freedom Wings SVG */
          <svg
            width="18"
            height="22"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
          >
            <path d="M3 13C3 13 4.5 9 8 8C9.5 7.5 10.5 8 11.5 8.5C11.5 8.5 9.5 10 9 11.5C8.5 13 9 14.5 9 14.5C9 14.5 7 13.5 6 14.5C5 15.5 5 17 5 17C5 17 6.5 16 8 16.5C9.5 17 10 18.5 10 18.5C10 18.5 8.5 19.5 7 19.5C5.5 19.5 4 18 4 18C4 18 4.5 20.5 7.5 21C10.5 21.5 12 19 12 19C12 19 12.5 21 15 20.5C17.5 20 18 17 18 17C18 17 17 18 15.5 17.5C14 17 13.5 15.5 13.5 15.5C13.5 15.5 15 16.5 16.5 15.5C18 14.5 18 12.5 18 12.5C18 12.5 16 13 15 12C14 11 14.5 9.5 14.5 9.5C14.5 9.5 15.5 11 17 10.5C18.5 10 19 7 19 7C19 7 17.5 8.5 15 8C12.5 7.5 11 9 11 9C11 9 10.5 6.5 7.5 6C4.5 5.5 3 8 3 8C3 8 4 6.5 6 6.5C8 6.5 9 8.5 9 8.5C9 8.5 7.5 9.5 6 9.5C4.5 9.5 3 11 3 11C3 11 4.5 11 6 12C7.5 13 8 14.5 8 14.5C8 14.5 6 15 5 14C4 13 3 13 3 13Z" />
          </svg>
        ) : (
          /* Brand of Sacrifice SVG */
          <svg
            width="16"
            height="22"
            viewBox="0 0 20 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
          >
            <path d="M10 2C9.5 2 9 3 9 4.5V11L4 7.5L3 9L9 13.5V17L2 15L1 16.5L9 20.5V26C9 27 9.5 27.5 10 27.5C10.5 27.5 11 27 11 26V20.5L19 16.5L18 15L11 17V13.5L17 9L16 7.5L11 11V4.5C11 3 10.5 2 10 2Z" />
          </svg>
        )}
      </div>

      {/* Target HUD Reticle Brackets */}
      <div
        className={cn(
          "target-cursor-corner absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-[150%] -translate-y-[150%] border-2 border-b-0 border-r-0",
          isLight ? "border-emerald-600/60" : "border-red-500/60"
        )}
        style={{ willChange: "transform" }}
      />
      <div
        className={cn(
          "target-cursor-corner absolute left-1/2 top-1/2 h-2.5 w-2.5 translate-x-1/2 -translate-y-[150%] border-2 border-b-0 border-l-0",
          isLight ? "border-emerald-600/60" : "border-red-500/60"
        )}
        style={{ willChange: "transform" }}
      />
      <div
        className={cn(
          "target-cursor-corner absolute left-1/2 top-1/2 h-2.5 w-2.5 translate-x-1/2 translate-y-1/2 border-2 border-l-0 border-t-0",
          isLight ? "border-emerald-600/60" : "border-red-500/60"
        )}
        style={{ willChange: "transform" }}
      />
      <div
        className={cn(
          "target-cursor-corner absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-[150%] translate-y-1/2 border-2 border-r-0 border-t-0",
          isLight ? "border-emerald-600/60" : "border-red-500/60"
        )}
        style={{ willChange: "transform" }}
      />
    </div>
  )
}

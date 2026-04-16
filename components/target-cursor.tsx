"use client"

import { gsap } from "gsap"
import { useCallback, useEffect, useRef, useState } from "react"

export interface TargetCursorProps {
  targetSelector?: string
  spinDuration?: number
  hideDefaultCursor?: boolean
  hoverDuration?: number
  parallaxOn?: boolean
}

const BORDER_WIDTH = 3
const CORNER_SIZE = 12

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
  targetSelector = "button, a, [data-cursor-target='true'], .cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
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

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) {
      return
    }

    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: "power3.out",
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
      xPercent: -50,
      yPercent: -50,
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
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05

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

      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 })
      gsap.to(cursorRef.current, { scale: 0.92, duration: 0.2 })
    }

    const mouseUpHandler = () => {
      if (!dotRef.current || !cursorRef.current) {
        return
      }

      gsap.to(dotRef.current, { scale: 1, duration: 0.3 })
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 })
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
          duration: 0.2,
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
                duration: 0.3,
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
      <div
        ref={dotRef}
        className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--text-color))]"
        style={{ willChange: "transform" }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 h-3 w-3 -translate-x-[150%] -translate-y-[150%] border-[3px] border-[rgb(var(--text-color))] border-b-0 border-r-0"
        style={{ willChange: "transform" }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 h-3 w-3 translate-x-1/2 -translate-y-[150%] border-[3px] border-[rgb(var(--text-color))] border-b-0 border-l-0"
        style={{ willChange: "transform" }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 h-3 w-3 translate-x-1/2 translate-y-1/2 border-[3px] border-[rgb(var(--text-color))] border-l-0 border-t-0"
        style={{ willChange: "transform" }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 h-3 w-3 -translate-x-[150%] translate-y-1/2 border-[3px] border-[rgb(var(--text-color))] border-r-0 border-t-0"
        style={{ willChange: "transform" }}
      />
    </div>
  )
}

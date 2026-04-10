"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import "locomotive-scroll/dist/locomotive-scroll.css"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  PORTFOLIO_SCROLL_TO_EVENT,
  PORTFOLIO_SCROLL_UPDATE_EVENT,
  dispatchPortfolioScrollState,
  type PortfolioScrollToOptions,
} from "@/lib/smooth-scroll"

type SmoothScrollProps = {
  children: React.ReactNode
}

type LocomotiveScrollInstance = {
  destroy: () => void
  on: (event: string, callback: (args: any) => void) => void
  scrollTo: (target: HTMLElement | string | number, options?: Record<string, unknown>) => void
  update: () => void
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const locomotiveScrollRef = useRef<LocomotiveScrollInstance | null>(null)
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!scrollRef.current || isMobile || prefersReducedMotion) {
      return
    }

    let cleanup: (() => void) | undefined
    let cancelled = false

    const initialize = async () => {
      const { default: LocomotiveScroll } = await import("locomotive-scroll")

      if (cancelled || !scrollRef.current) {
        return
      }

      const instance = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        lerp: 0.14,
        multiplier: 1,
        touchMultiplier: 1.05,
        class: "is-revealed",
        getDirection: true,
        reloadOnContextChange: true,
        smartphone: {
          smooth: false,
        },
        tablet: {
          smooth: false,
          breakpoint: 1024,
        },
      }) as unknown as LocomotiveScrollInstance

      locomotiveScrollRef.current = instance

      const emitNativeState = () => {
        const limit = Math.max(document.body.scrollHeight - window.innerHeight, 1)
        const y = window.scrollY

        dispatchPortfolioScrollState({
          direction: 1,
          limit,
          progress: Math.min(y / limit, 1),
          y,
        })
      }

      const emitLocomotiveState = (args: {
        currentElements?: unknown
        direction?: "up" | "down"
        limit?: { x: number; y: number }
        scroll?: { x: number; y: number }
      }) => {
        const limit = Math.max(args.limit?.y ?? 0, 1)
        const y = args.scroll?.y ?? 0

        dispatchPortfolioScrollState({
          direction: args.direction === "up" ? -1 : 1,
          limit,
          progress: Math.min(y / limit, 1),
          y,
        })
      }

      const handleScrollTo = (event: Event) => {
        const { detail } = event as CustomEvent<PortfolioScrollToOptions>

        if (!detail) {
          return
        }

        const target = typeof detail.id === "string" ? document.getElementById(detail.id) : null

        if (target) {
          instance.scrollTo(target, {
            duration: detail.duration ?? 1100,
            disableLerp: false,
            offset: detail.offset ?? -100,
          })
          return
        }

        if (typeof detail.top === "number") {
          instance.scrollTo(detail.top, {
            duration: detail.duration ?? 900,
            disableLerp: false,
          })
        }
      }

      const updateScroll = () => {
        window.requestAnimationFrame(() => {
          instance.update()
        })
      }

      const resizeObserver =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => {
              updateScroll()
            })

      const handleInitialHash = () => {
        if (!window.location.hash) {
          return
        }

        const targetId = window.location.hash.replace("#", "")
        const target = document.getElementById(targetId)

        if (!target) {
          return
        }

        window.setTimeout(() => {
          instance.scrollTo(target, {
            duration: 1000,
            disableLerp: false,
            offset: -100,
          })
        }, 180)
      }

      instance.on("scroll", emitLocomotiveState)
      window.addEventListener(PORTFOLIO_SCROLL_TO_EVENT, handleScrollTo as EventListener)
      window.addEventListener(PORTFOLIO_SCROLL_UPDATE_EVENT, updateScroll as EventListener)
      window.addEventListener("resize", updateScroll, { passive: true })
      window.addEventListener("load", updateScroll)
      resizeObserver?.observe(scrollRef.current)

      window.setTimeout(updateScroll, 320)
      window.setTimeout(handleInitialHash, 380)
      emitNativeState()

      cleanup = () => {
        window.removeEventListener(PORTFOLIO_SCROLL_TO_EVENT, handleScrollTo as EventListener)
        window.removeEventListener(PORTFOLIO_SCROLL_UPDATE_EVENT, updateScroll as EventListener)
        window.removeEventListener("resize", updateScroll)
        window.removeEventListener("load", updateScroll)
        resizeObserver?.disconnect()
        instance.destroy()
        locomotiveScrollRef.current = null
      }
    }

    initialize()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [isMobile, prefersReducedMotion])

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  )
}

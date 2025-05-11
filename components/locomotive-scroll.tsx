"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import LocomotiveScroll from "locomotive-scroll"
import "locomotive-scroll/dist/locomotive-scroll.css"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null)

  useEffect(() => {
    if (!scrollRef.current) return

    // Wait for DOM to be fully loaded
    const initScroll = () => {
      // Destroy existing instance if it exists
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy()
      }

      // Initialize locomotive scroll with improved settings
      locomotiveScrollRef.current = new LocomotiveScroll({
        el: scrollRef.current as HTMLElement,
        smooth: true,
        smoothMobile: false,
        multiplier: 1,
        lerp: 0.07,
        class: "is-revealed",
        reloadOnContextChange: true,
        smartphone: {
          smooth: false,
        },
        tablet: {
          smooth: false,
          breakpoint: 1024,
        },
      })

      // Handle anchor links properly
      const handleAnchorLinks = () => {
        const anchorLinks = document.querySelectorAll('a[href^="#"]')

        anchorLinks.forEach((anchor) => {
          anchor.addEventListener("click", (e) => {
            e.preventDefault()

            const targetId = anchor.getAttribute("href")
            if (!targetId || targetId === "#") return

            const targetElement = document.querySelector(targetId)
            if (!targetElement) return

            // Use locomotive scroll to scroll to the target
            locomotiveScrollRef.current?.scrollTo(targetElement, {
              offset: -100,
              duration: 1000,
              disableLerp: false,
            })
          })
        })
      }

      // Update scroll after images and other resources are loaded
      window.addEventListener("load", () => {
        setTimeout(() => {
          locomotiveScrollRef.current?.update()
        }, 500)
      })

      // Handle hash links on page load
      setTimeout(() => {
        const hash = window.location.hash
        if (hash) {
          const targetElement = document.querySelector(hash)
          if (targetElement) {
            locomotiveScrollRef.current?.scrollTo(targetElement, {
              offset: -100,
              duration: 1000,
              disableLerp: false,
            })
          }
        }

        // Setup anchor link handling
        handleAnchorLinks()

        // Force update after everything is set up
        locomotiveScrollRef.current?.update()
      }, 1000)
    }

    // Initialize scroll
    initScroll()

    // Update scroll on window resize
    const handleResize = () => {
      setTimeout(() => {
        locomotiveScrollRef.current?.update()
      }, 200)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("load", () => {})
      locomotiveScrollRef.current?.destroy()
    }
  }, [])

  return (
    <div data-scroll-container ref={scrollRef}>
      {children}
    </div>
  )
}

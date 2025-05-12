"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Preloader from "./preloader"

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasSeenPreloader = sessionStorage.getItem("preloader-done") === "true"

    // Only run this after hydration to avoid SSR issues
    try {
      setShowPreloader(!hasSeenPreloader)
      // If we're not showing the preloader, make content visible immediately
      if (hasSeenPreloader) {
        setContentVisible(true)
      }
    } catch (error) {
      // Fallback in case of sessionStorage errors
      console.error("Session storage error:", error)
      setShowPreloader(false)
      setContentVisible(true)
    }

    setHydrated(true)
  }, [])

  const handlePreloaderFinish = () => {
    try {
      // Mark preloader as seen for this session
      sessionStorage.setItem("preloader-done", "true")
    } catch (error) {
      console.error("Error setting session storage:", error)
    }

    setShowPreloader(false)

    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setContentVisible(true)
    }, 100)
  }

  // Don't render anything until hydration is complete
  if (!hydrated) return null

  return (
    <>
      {showPreloader && <Preloader onFinish={handlePreloaderFinish} />}
      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          visibility: contentVisible ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </>
  )
}

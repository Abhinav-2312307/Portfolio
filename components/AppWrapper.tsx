"use client"

import { useState, useEffect } from "react"
import Preloader from "./preloader"

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(false)
  const [hydrated, setHydrated] = useState(false) // wait for client load

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem("preloader-done") === "true"
    if (hasSeenPreloader) {
      setShowPreloader(false)
    } else {
      setShowPreloader(true)
    }
    setHydrated(true)
  }, [])

  const handlePreloaderFinish = () => {
    sessionStorage.setItem("preloader-done", "true")
    setShowPreloader(false)
  }

  if (!hydrated) return null // prevents hydration mismatch

  return (
    <>
      {showPreloader && <Preloader onFinish={handlePreloaderFinish} />}
      {!showPreloader && children}
    </>
  )
}

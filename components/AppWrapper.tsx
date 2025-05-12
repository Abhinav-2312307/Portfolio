"use client"

import { useState, useEffect } from "react"
import Preloader from "./preloader"

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {!showContent && <Preloader />}
      {showContent && children}
    </>
  )
}

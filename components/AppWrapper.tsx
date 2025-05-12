"use client"

import { useState, useEffect } from "react"
import Preloader from "./preloader/Preloader"


export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Match this to the duration of your preloader
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 6000) // Adjust this to match your typing + progress bar time

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {!showContent && <Preloader />}
      {showContent && children}
    </>
  )
}

import { useState, useEffect } from "react"
import Preloader from "./preloader"

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem("preloader-done") === "true"
    setShowPreloader(!hasSeenPreloader)
    setHydrated(true)
  }, [])

  const handlePreloaderFinish = () => {
    sessionStorage.setItem("preloader-done", "true")
    setShowPreloader(false)
  }

  if (!hydrated) return null

  return (
    <>
      {showPreloader && <Preloader onFinish={handlePreloaderFinish} />}
      {!showPreloader && children}
    </>
  )
}

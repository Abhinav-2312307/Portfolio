"use client"

import { useState } from "react"
import Preloader from "./preloader"

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true)

  return (
    <>
      {showPreloader && <Preloader onFinish={() => setShowPreloader(false)} />}
      {!showPreloader && children}
    </>
  )
}

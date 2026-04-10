"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import { PORTFOLIO_SCROLL_EVENT, hasSmoothScroll, requestPortfolioScrollTo, type PortfolioScrollState } from "@/lib/smooth-scroll"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const updateVisibility = (y: number) => {
      setVisible(y > 300)
    }

    const handleWindowScroll = () => {
      updateVisibility(window.scrollY)
    }

    const handleSmoothScroll = (event: Event) => {
      const { detail } = event as CustomEvent<PortfolioScrollState>
      updateVisibility(detail?.y ?? 0)
    }

    window.addEventListener("scroll", handleWindowScroll, { passive: true })
    window.addEventListener(PORTFOLIO_SCROLL_EVENT, handleSmoothScroll as EventListener)
    handleWindowScroll()

    return () => {
      window.removeEventListener("scroll", handleWindowScroll)
      window.removeEventListener(PORTFOLIO_SCROLL_EVENT, handleSmoothScroll as EventListener)
    }
  }, [])

  const scrollToTop = () => {
    if (hasSmoothScroll()) {
      requestPortfolioScrollTo({ top: 0, duration: 900 })
      return
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`liquid-glass fixed bottom-[90px] right-[24px] z-[1000] flex h-[54px] w-[54px] items-center justify-center rounded-[1.3rem] border border-white/15 text-lg text-text-color shadow-liquid transition-all duration-300 hover:-translate-y-1 hover:text-primary-color dark:border-white/10 ${
            isMobile ? "cursor-pointer" : "cursor-none"
          }`}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up"></i>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

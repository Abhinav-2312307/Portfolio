"use client"

import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      className={`fixed bottom-[30px] right-[30px] w-[50px] h-[50px] bg-primary-color text-dark-color rounded-full flex items-center justify-center text-lg ${
        isMobile ? "cursor-pointer" : "cursor-none"
      } transition-all duration-300 z-[1000] shadow-md hover:bg-primary-dark hover:translate-y-[-5px] hover:shadow-lg ${
        visible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  )
}

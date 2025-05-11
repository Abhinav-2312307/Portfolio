"use client"

import type React from "react"
import { useInView } from "react-intersection-observer"

interface ScrollRevealProps {
  children: React.ReactNode
  id?: string
  className?: string
}

export default function ScrollReveal({ children, id, className = "" }: ScrollRevealProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <div
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
    >
      {children}
    </div>
  )
}

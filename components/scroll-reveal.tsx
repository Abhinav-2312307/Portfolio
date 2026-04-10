"use client"

import type React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
}

export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      data-scroll-section
      className={cn("section-shell", className)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-sheen" />
      <div className="scroll-frame">{children}</div>
    </motion.div>
  )
}

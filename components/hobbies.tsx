"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Film, Laptop, Rocket, Wrench, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { HobbiesContent } from "@/lib/portfolio/schema"
import { cn } from "@/lib/utils"

const hobbyIconMap = {
  film: Film,
  laptop: Laptop,
  rocket: Rocket,
  wrench: Wrench,
}

type HobbiesProps = {
  hobbies?: HobbiesContent
}

export default function Hobbies({ hobbies }: HobbiesProps) {
  const hobbiesData = hobbies || defaultPortfolioContent.hobbies
  const title = hobbiesData?.title || ""
  const highlight = hobbiesData?.highlight || ""
  const description = hobbiesData?.description || ""
  const items = hobbiesData?.items || []

  const shouldReduceMotion = useReducedMotion()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  return (
    <section
      id="hobbies"
      className="relative overflow-hidden bg-dark-color px-8 py-24 transition-colors duration-700"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(180,15,15,0.04),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(180,15,15,0.04),transparent_28%)]" />

      <div className="relative mx-auto max-w-6xl">
        
        {/* Header Block */}
        <div className="mx-auto mb-16 max-w-3xl text-center space-y-4">
          <div
            className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-sm ${
              isLight
                ? "border-emerald-800/30 bg-emerald-950/10 text-emerald-600"
                : "border-red-800/30 bg-red-950/10 text-red-500"
            }`}
          >
            <Shield size={12} className={`${isLight ? "text-emerald-500" : "text-red-500"} animate-pulse`} />
            <span className="text-[0.62rem] uppercase tracking-[0.38em] font-semibold font-mono">
              {isLight ? "THE STRUGGLER'S SUNRISE" : "THE STRUGGLER'S RESPITE"}
            </span>
          </div>

          <h2 className="gothic-header text-4xl md:text-5xl font-bold uppercase tracking-[-0.04em] text-text-color">
            {title}{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isLight ? "from-emerald-600 via-teal-500 to-amber-500" : "from-red-600 to-amber-500"
              }`}
            >
              {highlight}
            </span>
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>

        {/* Hobbies Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((hobby, index) => {
            const Icon = hobbyIconMap[hobby.iconName as keyof typeof hobbyIconMap] ?? Laptop

            return (
              <motion.div
                key={hobby.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                className={cn(
                  "steel-runic-panel p-6 rounded-[24px] transition-all group",
                  isLight ? "hover:border-emerald-500/20" : "hover:border-red-500/20"
                )}
              >
                <div className="relative z-10 flex h-full flex-col">
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-sm border mb-6 group-hover:scale-105 transition-transform duration-300 ${
                      isLight
                        ? "border-emerald-800/25 bg-emerald-950/5 text-emerald-650"
                        : "border-red-800/30 bg-red-950/20 text-red-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3
                    className={`text-lg font-bold uppercase tracking-tight text-text-color font-sans transition-colors ${
                      isLight ? "group-hover:text-emerald-600" : "group-hover:text-red-500"
                    }`}
                  >
                    {hobby.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary font-sans flex-1">
                    {hobby.description}
                  </p>

                  <div
                    className={`mt-6 flex items-center gap-2 text-[0.62rem] font-mono uppercase tracking-widest border-t border-text-color/5 pt-4 ${
                      isLight ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isLight ? "bg-emerald-600" : "bg-red-500"}`} />
                    {hobby.eyebrow}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

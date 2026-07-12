"use client"

import { motion } from "framer-motion"
import { Shield, Sparkles, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { EducationContent } from "@/lib/portfolio/schema"
import { cn } from "@/lib/utils"

type EducationProps = {
  education?: EducationContent
}

export default function Education({ education }: EducationProps) {
  const educationData = education || defaultPortfolioContent.education
  const items = educationData?.items || []
  const taglineBadge = educationData?.taglineBadge || ""

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  return (
    <section id="education" className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20 bg-dark-color transition-colors duration-700">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(30,70,59,0.06)_0%,_transparent_60%)]" />
      
      {/* Runic line details */}
      <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-emerald-800/20 to-transparent" />
      <div className="absolute left-[7%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        
        {/* Header Block */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-text-color/5 pb-8">
          <div>
            <div
              className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-sm ${
                isLight
                  ? "border-emerald-850/30 bg-emerald-950/10 text-emerald-600"
                  : "border-emerald-800/30 bg-emerald-950/10 text-emerald-500"
              }`}
            >
              <Shield size={12} className={`${isLight ? "text-emerald-650" : "text-emerald-500"} animate-pulse`} />
              <span className="text-[0.62rem] uppercase tracking-[0.38em] font-semibold font-mono">
                {isLight ? "ACADEMY SCROLL RECORDFILE" : "MILITARY COMMAND ARCHIVES"}
              </span>
            </div>

            <h2 className="gothic-header text-4xl md:text-5xl font-bold uppercase tracking-[-0.04em] text-text-color mt-4">
              {isLight ? (
                <>
                  Academic <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500">
                    Foundations
                  </span>
                </>
              ) : (
                <>
                  Foundational <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-amber-500">
                    Fortresses
                  </span>
                </>
              )}
            </h2>
          </div>

          <div
            className={`inline-flex items-center gap-2.5 rounded-sm border px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] font-mono self-start lg:self-auto ${
              isLight
                ? "border-emerald-800/30 bg-emerald-950/10 text-emerald-700"
                : "border-emerald-800/30 bg-emerald-950/20 text-emerald-400"
            }`}
          >
            <Sparkles size={13} className="animate-spin" />
            {taglineBadge}
          </div>
        </div>

        {/* Dossiers Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={cn(
                "steel-runic-panel p-8 rounded-[24px] border hover:border-emerald-550/40 transition-all group relative",
                isLight
                  ? "border-emerald-800/10 bg-gradient-to-b from-secondary-color/30 to-dark-color/40"
                  : "border-emerald-950/30 bg-gradient-to-b from-emerald-950/20 to-black/60"
              )}
            >
              {/* Corner Runic Stamps */}
              <div className={`absolute top-3 right-3 text-[0.55rem] font-mono select-none ${isLight ? "text-emerald-800/25" : "text-emerald-500/30"}`}>
                DOSSIER // 0{index + 1}
              </div>

              {/* Icon / Meta row */}
              <div className="flex items-center justify-between gap-4 border-b border-text-color/5 pb-4 mb-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-sm border ${
                    isLight
                      ? "border-emerald-800/20 bg-emerald-950/5 text-emerald-700"
                      : "border-emerald-800/30 bg-emerald-950/25 text-emerald-500"
                  }`}
                >
                  <BookOpen size={18} />
                </div>
                <span
                  className={`text-xs font-mono px-3 py-1 rounded-sm border ${
                    isLight
                      ? "text-emerald-700 bg-emerald-950/5 border-emerald-800/20"
                      : "text-emerald-400 bg-emerald-950/30 border-emerald-900/40"
                  }`}
                >
                  {item.meta}
                </span>
              </div>

              {/* Heading */}
              <h3
                className={`text-2xl font-bold uppercase tracking-tight text-text-color mb-2 font-sans transition-colors ${
                  isLight ? "group-hover:text-emerald-600" : "group-hover:text-emerald-400"
                }`}
              >
                {item.title}
              </h3>
              
              <div className="space-y-3 mt-6">
                {item.points.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isLight ? "bg-emerald-600" : "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"}`} />
                    <p className="text-sm leading-relaxed text-text-secondary font-mono">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              {/* dossier footer decoration */}
              <div className="mt-8 flex justify-between items-center text-[0.55rem] font-mono text-text-secondary/35 border-t border-dashed border-text-color/5 pt-4">
                <span>SECTOR: ELDIA // AKTU</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}

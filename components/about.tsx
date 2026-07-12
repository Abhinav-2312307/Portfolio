"use client"

import { motion } from "framer-motion"
import { Swords, GraduationCap, Code2, Rocket, BrainCircuit } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { AboutContent } from "@/lib/portfolio/schema"

type AboutProps = {
  about?: AboutContent
}

const CHRONICLES = [
  {
    title: "Eldian Awakening",
    subtitle: "B.Tech Entry (CSE) @ PSIT Kanpur",
    date: "2023 - Present",
    badge: "Academics",
    desc: "Began training in computational systems. Immersed in computer science foundations, algorithms, and modular design. Achieving a current GPA of 8.4/10.",
    icon: GraduationCap,
    gradient: "from-[#0c0d10] to-[#07080a]"
  },
  {
    title: "ODM Gear Training",
    subtitle: "550+ Algorithmic Trials",
    date: "2024",
    badge: "Combat Prep",
    desc: "Trained daily on LeetCode and GeeksforGeeks. Solved 550+ complex algorithms, mastering tree traversals, dynamic programming recursion, and optimal space complexity.",
    icon: Code2,
    gradient: "from-[#07080a] to-[#0c0d10]"
  },
  {
    title: "The Eclipse",
    subtitle: "Smart India Hackathon Finalist",
    date: "Late 2024",
    badge: "Alliance",
    desc: "Led a combat unit to construct a real-time tracking network. Handled full stack routing under pressure, qualifying as national finalists in Smart India Hackathon.",
    icon: Rocket,
    gradient: "from-[#0c0d10] to-[#07080a]"
  },
  {
    title: "Dragonslayer Forged",
    subtitle: "AI Systems Engineering",
    date: "2025",
    badge: "Ascent",
    desc: "Forged fully autonomous AI agents using frameworks (Next.js, LangChain, vector stores). Deploying scalable microservices capable of navigating complex data streams.",
    icon: BrainCircuit,
    gradient: "from-[#07080a] to-[#0c0d10]"
  }
]

export default function About({ about }: AboutProps) {
  const aboutData = about || defaultPortfolioContent.about
  const stats = aboutData?.stats || []

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20 bg-dark-color transition-colors duration-700"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(110,5,5,0.06)_0%,_transparent_60%)]" />
      
      {/* Decorative center background wire */}
      <div className="absolute left-[8%] md:left-1/2 md:-translate-x-1/2 top-40 bottom-24 w-px bg-gradient-to-b from-red-800/40 via-red-900/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        
        {/* Header Design */}
        <div className="mb-20 text-left md:text-center space-y-4 max-w-2xl mx-auto">
          <div
            className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-sm md:mx-auto ${
              isLight
                ? "border-emerald-800/30 bg-emerald-950/10 text-emerald-600"
                : "border-red-800/30 bg-red-950/20 text-red-500"
            }`}
          >
            <Swords size={12} className={`${isLight ? "text-emerald-500" : "text-red-500"} animate-pulse`} />
            <span className="text-[0.62rem] uppercase tracking-[0.38em] font-semibold font-mono">
              {isLight ? "THE ANCIENT ARCHIVES" : "THE STRUGGLER'S PATH"}
            </span>
          </div>

          <h2 className="gothic-header text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-text-color">
            {isLight ? (
              <>
                Chronicles of <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500">
                  Discovery &amp; Freedom
                </span>
              </>
            ) : (
              <>
                Chronicles of <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
                  Causality &amp; Growth
                </span>
              </>
            )}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-text-secondary">
            {isLight
              ? "Every chapter charts a voyage. From initial constraints to autonomous AI architecture, this journal documents my campaign through the digital realm."
              : "Every step represents a trial. From foundational constraints to full-stack AI autonomy, this timeline chronicles my path as a software engineer."}
          </p>
        </div>

        {/* Timeline Core */}
        <div className="relative space-y-16">
          {CHRONICLES.map((item, index) => {
            const isEven = index % 2 === 0
            const Icon = item.icon

            return (
              <div key={item.title} className="relative flex flex-col md:grid md:grid-cols-2 md:gap-16 items-center">
                
                {/* Timeline Dot Indicator */}
                <div className="absolute left-[8%] md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-20">
                  <div
                    className={`h-6 w-6 rounded-full border bg-dark-color flex items-center justify-center ${
                      isLight
                        ? "border-emerald-800 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                        : "border-red-800 shadow-[0_0_12px_rgba(180,15,15,0.4)]"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full animate-ping ${isLight ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span className={`absolute h-2.5 w-2.5 rounded-full ${isLight ? "bg-emerald-600" : "bg-red-600"}`} />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 ${isEven ? "md:text-right" : "md:col-start-2 text-left"}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`steel-runic-panel p-6 rounded-[24px] transition-colors group ${
                      isLight
                        ? "hover:border-emerald-600/30"
                        : "hover:border-red-500/30"
                    }`}
                  >
                    {/* Floating Glow on Hover */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        isLight
                          ? "bg-[radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.06)_0%,transparent_60%)]"
                          : "bg-[radial-gradient(circle_at_bottom_right,rgba(180,15,15,0.06)_0%,transparent_60%)]"
                      }`}
                    />

                    {/* Meta info */}
                    <div className={`flex flex-wrap items-center gap-3 mb-4 ${isEven ? "md:justify-end" : "justify-start"}`}>
                      <span
                        className={`text-[0.65rem] uppercase tracking-[0.3em] font-mono border px-2 py-0.5 rounded-sm ${
                          isLight
                            ? "text-emerald-600 border-emerald-500/25 bg-emerald-950/10"
                            : "text-red-500 border-red-500/20 bg-red-950/20"
                        }`}
                      >
                        {item.badge}
                      </span>
                      <span className="text-xs font-mono text-text-secondary/60">{item.date}</span>
                    </div>

                    {/* Headline */}
                    <h3
                      className={`text-2xl font-bold uppercase tracking-tight text-text-color mb-2 font-sans transition-colors ${
                        isLight ? "group-hover:text-emerald-600" : "group-hover:text-red-500"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wider text-text-secondary/75 mb-4 font-mono">
                      {item.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-text-secondary font-sans">
                      {item.desc}
                    </p>

                    {/* Embedded Runic Emblem */}
                    <div className={`mt-5 flex items-center ${isEven ? "md:justify-end" : "justify-start"}`}>
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full border border-text-color/5 bg-black/5 text-text-color shadow-[inset_0_0_8px_rgba(0,0,0,0.08)] ${
                          isLight ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                    </div>
                  </motion.article>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tactical Overview / Stats Panel */}
        <div className="mt-24 pt-12 border-t border-text-color/5 max-w-5xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`steel-runic-panel p-6 rounded-[20px] text-center transition-all group ${
                  isLight ? "hover:border-emerald-500/20" : "hover:border-red-500/20"
                }`}
              >
                <p
                  className={`text-[0.58rem] uppercase tracking-[0.3em] text-text-secondary/60 font-mono mb-2 transition-colors ${
                    isLight ? "group-hover:text-emerald-600/60" : "group-hover:text-red-500/60"
                  }`}
                >
                  {item.label}
                </p>
                <p className="gothic-header text-3xl font-bold text-text-color tracking-wide">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

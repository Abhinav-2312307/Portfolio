"use client"

import { Brain, Medal, Rocket, Trophy, Swords } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { defaultPortfolioContent } from "@/lib/portfolio/default-content"
import type { AchievementsContent } from "@/lib/portfolio/schema"
import { cn } from "@/lib/utils"

const achievementIconMap = {
  brain: Brain,
  medal: Medal,
  rocket: Rocket,
  trophy: Trophy,
}

type AchievementsProps = {
  achievements?: AchievementsContent
}

export default function Achievements({ achievements }: AchievementsProps) {
  const achievementsData = achievements || defaultPortfolioContent.achievements
  const title = achievementsData?.title || ""
  const description = achievementsData?.description || ""
  const items = achievementsData?.items || []
  const stats = achievementsData?.stats || []

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && theme === "light"

  return (
    <section id="achievements" className="relative overflow-hidden px-6 py-24 bg-dark-color transition-colors duration-700">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(110,5,5,0.05)_0%,_transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl">
        
        {/* Header Block */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <div
            className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-sm ${
              isLight
                ? "border-emerald-800/30 bg-emerald-950/10 text-emerald-600"
                : "border-red-800/30 bg-red-950/10 text-red-500"
            }`}
          >
            <Swords size={12} className={`${isLight ? "text-emerald-500" : "text-red-500"} animate-pulse`} />
            <span className="text-[0.62rem] uppercase tracking-[0.38em] font-semibold font-mono">
              {isLight ? "BATTLE victories // Hall of Honor" : "BATTLE victories // MILESTONES"}
            </span>
          </div>

          <h2 className="gothic-header text-4xl md:text-5xl font-bold uppercase tracking-[-0.04em] text-text-color">
            {title}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>

        {/* Dossiers Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((achievement, index) => {
            const Icon = achievementIconMap[achievement.iconName as keyof typeof achievementIconMap] ?? Trophy

            return (
              <motion.article
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={cn(
                  "steel-runic-panel p-6 rounded-[24px] transition-all group",
                  isLight ? "hover:border-emerald-555/20" : "hover:border-red-500/20"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border ${
                      isLight
                        ? "border-emerald-800/20 bg-emerald-950/5 text-emerald-600"
                        : "border-red-800/30 bg-red-950/20 text-red-500"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[0.58rem] font-mono uppercase border px-2 py-0.5 rounded-sm ${
                          isLight
                            ? "text-emerald-600 border-emerald-500/25 bg-emerald-950/10"
                            : "text-red-400 border-red-900/30 bg-red-950/25"
                        }`}
                      >
                        {achievement.category}
                      </span>
                      <span className="text-[0.68rem] font-mono text-text-secondary/50">{achievement.year}</span>
                    </div>

                    <h3
                      className={`text-xl font-bold uppercase tracking-tight text-text-color mt-4 transition-colors ${
                        isLight ? "group-hover:text-emerald-650" : "group-hover:text-red-500"
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <p className={`text-xs uppercase tracking-wider font-mono mt-1 ${isLight ? "text-emerald-700" : "text-red-400"}`}>
                      {achievement.subtitle}
                    </p>
                    <p className="text-sm leading-relaxed text-text-secondary mt-3">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Stats segment */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={cn(
                "steel-runic-panel p-5 rounded-[20px] text-center transition-all",
                isLight ? "hover:border-emerald-500/20" : "hover:border-red-500/20"
              )}
            >
              <p className="text-[0.58rem] uppercase tracking-[0.3em] text-text-secondary/50 font-mono mb-1">
                {item.label}
              </p>
              <p className="gothic-header text-2xl font-bold text-text-color tracking-wide">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
